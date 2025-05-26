import React, { useEffect, useState } from "react";
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

const YearlyTaxReportChart = () => {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("revenue");
  const [selectedYear, setSelectedYear] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableYears = [...new Set(data.map((d) => d.year))];

  // Fetch the data
  const fetchYearlyData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/yearly-tax-report');
      if (!response.ok) {
        throw new Error('Failed to fetch yearly tax data');
      }
      const fetchedData = await response.json();
      setData(fetchedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching yearly data:', err);
      setError(err.message);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlyData();
  }, []);

  const filteredData =
    selectedYear === "all"
      ? data
      : data.filter((d) => d.year === parseInt(selectedYear));

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
              backgroundColor: "#620F28 ",
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
              backgroundColor: "#684E12",
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
        color: "#986611",
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

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg border border-red-100 rounded-xl p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading yearly tax data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg border border-red-100 rounded-xl p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading data: {error}</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white shadow-lg border border-red-100 rounded-xl p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No tax data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg border border-red-100 rounded-xl p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              viewMode === "revenue"
                ? "bg-red-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode("revenue")}
          >
            Income Tax Revenue
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              viewMode === "breakdown"
                ? "bg-yellow-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode("breakdown")}
          >
            Approvals & Declines
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              viewMode === "submissions"
                ? "bg-rose-900 text-white"
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
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 "
          >
            <option value="all" >All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year} className="hover:bg-yellow-300">  
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