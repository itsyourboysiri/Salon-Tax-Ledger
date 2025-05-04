import React, { useEffect, useState } from "react";
import TaxSummaryChart from "./taxPayableChart";

const TaxChartPage = () => {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    // Mock joined data
    const mockData = [
        {
          date: "2022-01-20",
          taxYear: "2021/2022",
          name: "Hansaja Pathan",
          salonName: "Glam Hub",
          username: "sewmini2022",
          status: "confirmed",
          totalTaxPayable: 15000,
          totalTaxPaid: 15000,
          incomeSources: {
            employment: 3000,
            business: 9000,
            foreign: 3000,
          },
          paymentType: "full",
          installments: [
            { amount: 15000, paidAt: "2022-01-20" }
          ]
        },
        {
          date: "2023-03-10",
          taxYear: "2022/2023",
          name: "Hansaja Pathan",
          salonName: "Rawula",
          username: "hansaja2023",
          status: "partial",
          totalTaxPayable: 20000,
          totalTaxPaid: 10000,
          incomeSources: {
            employment: 6000,
            business: 8000,
            foreign: 6000,
          },
          paymentType: "quarterly",
          installments: [
            { quarter: 1, amount: 5000, paidAt: "2023-01-15" },
            { quarter: 2, amount: 5000, paidAt: "2023-03-10" }
          ]
        },
        {
          date: "2023-07-15",
          taxYear: "2022/2023",
          name: "Hansaja Pathan",
          salonName: "Golden Touch",
          username: "nisa2023",
          status: "paid",
          totalTaxPayable: 18000,
          totalTaxPaid: 18000,
          incomeSources: {
            employment: 2000,
            business: 10000,
            foreign: 6000,
          },
          paymentType: "full",
          installments: [
            { amount: 18000, paidAt: "2023-07-15" }
          ]
        },
        {
          date: "2024-01-10",
          taxYear: "2023/2024",
          name: "Hansaja Pathan",
          salonName: "Beauty Bliss",
          username: "dula2024",
          status: "partial",
          totalTaxPayable: 22000,
          totalTaxPaid: 11000,
          incomeSources: {
            employment: 7000,
            business: 7000,
            foreign: 8000,
          },
          paymentType: "quarterly",
          installments: [
            { quarter: 1, amount: 6000, paidAt: "2024-01-10" },
            { quarter: 2, amount: 5000, paidAt: "2024-03-10" }
          ]
        },
        {
          date: "2025-03-15",
          taxYear: "2024/2025",
          name: "Hansaja Pathan",
          salonName: "Rawula",
          username: "asiri123",
          status: "partial",
          totalTaxPayable: 24000,
          totalTaxPaid: 16000,
          incomeSources: {
            employment: 6000,
            business: 10000,
            foreign: 8000,
          },
          paymentType: "quarterly",
          installments: [
            { quarter: 1, amount: 8000, paidAt: "2025-01-15" },
            { quarter: 2, amount: 8000, paidAt: "2025-03-15" }
          ]
        },
        {
          date: "2025-03-10",
          taxYear: "2024/2025",
          name: "Hansaja Pathan",
          salonName: "Rawula",
          username: "nethmi456",
          status: "confirmed",
          totalTaxPayable: 18000,
          totalTaxPaid: 18000,
          incomeSources: {
            employment: 3000,
            business: 10000,
            foreign: 5000,
          },
          paymentType: "full",
          installments: [
            { amount: 18000, paidAt: "2025-03-10" }
          ]
        }
      ];
      

    setSummaryData(mockData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tax Summary Reports</h1>
      <TaxSummaryChart data={summaryData} />
    </div>
  );
};

export default TaxChartPage;
