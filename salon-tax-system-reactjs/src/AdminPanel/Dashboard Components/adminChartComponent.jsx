import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const YearlyTaxReportChart = ({ data }) => {
  const [viewMode, setViewMode] = useState("revenue");
  const [selectedYear, setSelectedYear] = useState("all");

  const availableYears = [...new Set(data.map((d) => d.year))];

  const filteredData =
    selectedYear === "all"
      ? data
      : data.filter((d) => d.year === selectedYear);

  const labels = filteredData.map((item) => item.year);

  const getChartData = () => {
    switch (viewMode) {
      case "revenue":
        return {
          labels,
          datasets: [
            {
              label: "Tax Collected (LKR)",
              data: filteredData.map((item) => item.taxCollected),
              backgroundColor: "#EF4444",
            },
          ],
        };
      case "breakdown":
        return {
          labels,
          datasets: [
            {
              label: "Approved Submissions",
              data: filteredData.map((item) => item.approved),
              backgroundColor: "#10B981",
            },
            {
              label: "Declined Submissions",
              data: filteredData.map((item) => item.declined),
              backgroundColor: "#F87171",
            },
          ],
        };
      case "submissions":
        return {
          labels,
          datasets: [
            {
              label: "Total Submissions",
              data: filteredData.map((item) => item.totalSubmissions),
              backgroundColor: "#FACC15",
            },
          ],
        };
      default:
        return {};
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: {
          revenue: "📊 Income Tax Revenue per Year",
          breakdown: "📋 Tax Submissions Breakdown",
          submissions: "📦 Total Tax Submissions",
        }[viewMode],
        font: { size: 18, weight: "bold" },
        color: "#1F2937",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Count / LKR" },
      },
      x: {
        title: { display: true, text: "Tax Year" },
      },
    },
  };

  return (
    <div className="bg-white shadow-lg border border-red-100 rounded-xl p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              viewMode === "revenue"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode("revenue")}
          >
            Income Tax Revenue
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              viewMode === "breakdown"
                ? "bg-yellow-400 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode("breakdown")}
          >
            Approvals & Declines
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              viewMode === "submissions"
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode("submissions")}
          >
            Total Submissions
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Bar data={getChartData()} options={options} />
    </div>
  );
};

export default YearlyTaxReportChart;
