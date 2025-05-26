import React, { useState, useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../components/navbar/navbar";
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

const statusColors = {
  confirmed: "#10B981",
  partial: "#F59E0B",
  paid: "#3B82F6",
};

const TaxPayableChart = ({ data }) => {
  const [chartType, setChartType] = useState("line");
  const [viewMode, setViewMode] = useState("month");
  const [summaryMode, setSummaryMode] = useState(false);

  const [selectedYear, setSelectedYear] = useState("");
  const [yearRange, setYearRange] = useState({ from: "", to: "" });

  // Extract unique years
  const availableYears = useMemo(() => {
    const years = new Set(data.map(item => item.date.split("-")[0]));
    return Array.from(years).sort();
  }, [data]);

  // Filter data by selected year or year range
  const getYearFilteredData = () => {
    if (selectedYear) {
      return data.filter(d => d.date.startsWith(selectedYear));
    }

    if (yearRange.from && yearRange.to) {
      return data.filter(d => {
        const year = parseInt(d.date.split("-")[0]);
        return year >= parseInt(yearRange.from) && year <= parseInt(yearRange.to);
      });
    }

    return data;
  };

  const getFilteredData = () => {
    const yearFiltered = getYearFilteredData();

    if (summaryMode) return yearFiltered;

    return viewMode === "year"
      ? aggregateByYear(yearFiltered)
      : yearFiltered;
  };

  const aggregateByYear = (arr) => {
    const yearMap = {};
    arr.forEach((item) => {
      const year = item.date.split("-")[0];
      yearMap[year] = (yearMap[year] || 0) + item.totalTaxPayable;
    });
    return Object.entries(yearMap).map(([date, totalTaxPayable]) => ({
      date,
      totalTaxPayable,
    }));
  };

  const chartData = {
    labels: getFilteredData().map((item) => item.date),
    datasets: summaryMode
      ? [
          {
            label: "Tax Paid",
            data: getFilteredData().map((item) => item.totalTaxPaid),
            backgroundColor: "#620F28 ",
          },
          {
            label: "Remaining Payable",
            data: getFilteredData().map(
              (item) => item.totalTaxPayable - item.totalTaxPaid
            ),
            backgroundColor: "#DAA520",
          },
        ]
      : [
          {
            label: "Tax Payable (LKR)",
            data: getFilteredData().map((item) => item.totalTaxPayable),
            borderColor: "#EF4444",
            backgroundColor: "rgba(250, 204, 21, 0.3)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#EF4444",
            pointBorderColor: "#FACC15",
            pointRadius: 6,
            pointHoverRadius: 8,
            barThickness: 40,
          },
        ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: summaryMode ? "📊 Tax Summary Report" : "📈 Tax Payable Over Time",
        font: { size: 20, weight: "bold" },
        color: "#380817",
      },
      
    },
    scales: {
      x: {
        stacked: summaryMode,
        title: {
          display: true,
          text: viewMode === "year" ? "Year" : "Month",
        },
      },
      y: {
        stacked: summaryMode,
        beginAtZero: true,
        title: { display: true, text: "LKR" },
      },
    },
  };

  
  return (

   
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl mx-auto border border-red-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-3 flex-wrap">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            disabled={summaryMode}
          >
            <option value="year">Yearly</option>
            <option value="month">Monthly</option>
          </select>

          <button
            onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-red-900 font-semibold rounded-md transition"
            disabled={summaryMode}
          >
            {chartType === "line" ? "Switch to Bar" : "Switch to Line"}
          </button>

          <button
            onClick={() => setSummaryMode(!summaryMode)}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-semibold rounded-md transition"
          >
            {summaryMode ? "View Trend Chart" : "View Summary Report"}
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            className="px-3 py-2 border rounded-md shadow-sm text-sm"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setYearRange({ from: "", to: "" }); // clear range
            }}
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

         
        </div>
      </div>

      {chartType === "line" && !summaryMode ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}

      {summaryMode && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredData().map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm"
              style={{
                border: "1px solid #986611",
                borderLeft: `6px solid ${statusColors[item.status] || "#D1D5DB"}`,
               
              }}
            >
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{item.salonName}</p>
              <p><strong>Tax Year:</strong> {item.taxYear}</p>
              <p><strong>Payable:</strong> LKR {item.totalTaxPayable}</p>
              <p><strong>Paid:</strong> LKR {item.totalTaxPaid}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{item.status}</span>
              </p>
             
            </div>
          ))}
        </div>
      )}
    </div>

    
  );
};

export default TaxPayableChart;
