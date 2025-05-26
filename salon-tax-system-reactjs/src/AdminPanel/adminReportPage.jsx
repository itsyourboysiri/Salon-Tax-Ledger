// pages/ReportPage.jsx
import React, { useEffect, useState } from "react";
import YearlyTaxReportChart from "./Dashboard Components/adminChartComponent";
import TopAndSideBar from "./Dashboard Components/sideBar";

const ReportPage = () => {
  const [yearlyData, setYearlyData] = useState([]);


  return (
    <>
    <TopAndSideBar>
  
      <h1 className="text-3xl font-bold text-center mb-10 text-[#986611]">📊 Tax Year Report Summary</h1>
      <YearlyTaxReportChart  />
   
    </TopAndSideBar>
    </>
   
  );
};

export default ReportPage;
