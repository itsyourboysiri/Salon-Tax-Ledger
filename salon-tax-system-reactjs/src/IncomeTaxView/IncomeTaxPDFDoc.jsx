import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png"; // Base64 or direct import

const generatePDFReport = (entry) => {
  const doc = new jsPDF({ compress: true });

  const formatCurrency = (val) =>
    `LKR ${parseFloat(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;

  // === Logo and Title ===
  const logoWidth = 40;
  const logoAspectRatio = 1;
  const logoHeight = logoWidth / logoAspectRatio;
  const logoX = 20;
  const logoY = 15;

  doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

  const pageWidth = doc.internal.pageSize.getWidth();
  const titleY = logoY + logoHeight / 2 + 2;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#380817");
  doc.text("Income Tax Report", pageWidth / 2, titleY, { align: "center" });

  let y = logoY + logoHeight + 10;

  // === Summary Section ===
  const summary = [
    `Name: ${entry.name || "N/A"}`,
    `Salon Name: ${entry.salonName || "N/A"}`,
    `TIN Number: ${entry.tinNumber || "N/A"}`,
    `Submitted Date: ${new Date(entry.submittedAt).toLocaleDateString("en-GB")}`,
    `Taxable Income: ${formatCurrency(entry.taxableIncome)}`,
    `Total Tax Payable: ${formatCurrency(entry.totalTaxLiable)}`,
    `Balance Payable: ${formatCurrency(entry.balancePayable)}`
  ];

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#333");

  summary.forEach((line) => {
    doc.text(line, 14, y);
    y += 7;
  });

  y += 5;

  // === Utility ===
  const addSectionLabel = (label) => {
    doc.setFontSize(13);
    doc.setTextColor("#380817");
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, y);
    y += 4;
  };

  const tableStyles = {
    headStyles: {
      fillColor: [56, 8, 23],           // original header color
      textColor: [255, 255, 255],
      halign: "left",
      fontStyle: "bold",
    },
    bodyStyles: {
      fillColor: [240, 240, 240],       // light gray background
      textColor: [40, 40, 40],
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],       // same for alternate rows
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 80 },
    },
    didDrawCell: (data) => {
        if (data.section === 'body') {
          const yLine = data.cell.y + data.cell.height;
          doc.setDrawColor(255, 255, 255); // white separator
          doc.setLineWidth(0.5); // ✅ consistent across all tables
          doc.line(data.cell.x, yLine, data.cell.x + data.cell.width, yLine);
        }
      },
      
      
  };

  const renderEntryTable = (label, dataArray, keyName, keyAmount) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) return;
    addSectionLabel(label);
    autoTable(doc, {
      startY: y + 2,
      head: [[`${label} Name`, "Amount"]],
      body: dataArray.map((entry) => [
        entry[keyName],
        formatCurrency(entry[keyAmount]),
      ]),
      ...tableStyles,
    });
    y = doc.lastAutoTable.finalY + 10;
  };

  // === Render Income Tables ===
  renderEntryTable("Employment Income", entry.employeeIncomeEntries, "empIncomeName", "empIncome");
  renderEntryTable("Business Income", entry.businessIncomeEntries, "businessIncomeName", "businessIncome");
  renderEntryTable("Other Income", entry.otherIncomeEntries, "otherIncomeName", "otherIncome");
  renderEntryTable("Foreign Income", entry.foreignIncomeEntries, "foriegnIncomeName", "foriegnIncome");

  const investmentRows = Object.entries(entry.investmentIncomeEntries || {}).map(([name, value]) => [
    name,
    formatCurrency(value),
  ]);
  if (investmentRows.length > 0) {
    addSectionLabel("Investment Income");
    autoTable(doc, {
      startY: y + 2,
      head: [["Income Type", "Amount"]],
      body: investmentRows,
      ...tableStyles,
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // === Qualifying Payments ===
  if (entry.qualifyingPaymentsEntries?.length) {
    addSectionLabel("Qualifying Payments");
    autoTable(doc, {
      startY: y + 2,
      head: [["Donation Type", "Amount"]],
      body: entry.qualifyingPaymentsEntries.map((e) => [
        e.donationType,
        formatCurrency(e.donationAmount),
      ]),
      ...tableStyles,
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // === Relief Payments ===
  if (entry.reliefEntries?.length) {
    addSectionLabel("Relief Payments");
    autoTable(doc, {
      startY: y + 2,
      head: [["Relief Name", "Amount"]],
      body: entry.reliefEntries.map((e) => [
        e.reliefName,
        formatCurrency(e.reliefAmount),
      ]),
      ...tableStyles,
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // === Foreign Tax Credits / CGT ===
  if (entry.taxCreditsData) {
    addSectionLabel("Foreign Tax Credits / CGT");
    autoTable(doc, {
      startY: y + 2,
      head: [["Credit Type", "Amount"]],
      body: [
        ["Foreign Tax Credits", formatCurrency(entry.taxCreditsData.foreignTaxCredits)],
        ["Capital Gains Tax", formatCurrency(entry.taxCreditsData.capitalGainsTax)],
      ],
      ...tableStyles,
    });
  }

  const dateStr = new Date(entry.submittedAt).toLocaleDateString("en-GB").replace(/\//g, "-");
  doc.save(`Tax_Report_${dateStr}.pdf`);
};

export default generatePDFReport;
