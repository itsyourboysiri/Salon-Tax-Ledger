// pages/ReportPage.jsx
import React, { useEffect, useState } from "react";
import YearlyTaxReportChart from "./Dashboard Components/adminChartComponent";

const ReportPage = () => {
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    // Replace this with API call if needed
    const mockYearlyReport = [
      {
        year: "2021/2022",
        taxCollected: 90000,
        totalSubmissions: 25,
        approved: 18,
        declined: 7,
      },
      {
        year: "2022/2023",
        taxCollected: 132000,
        totalSubmissions: 32,
        approved: 26,
        declined: 6,
      },
      {
        year: "2023/2024",
        taxCollected: 105000,
        totalSubmissions: 28,
        approved: 20,
        declined: 8,
      },
    ];
    setYearlyData(mockYearlyReport);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-rose-700">📊 Tax Year Report Summary</h1>
      <YearlyTaxReportChart data={yearlyData} />
    </div>
  );
};

export default ReportPage;
