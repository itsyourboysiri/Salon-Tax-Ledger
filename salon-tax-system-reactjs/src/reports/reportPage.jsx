import React, { useEffect, useState } from "react";
import TaxSummaryChart from "./taxPayableChart";
import Navbar from "../components/navbar/navbar";

const TaxChartPage = () => {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    // Mock joined data

      const fetchTaxData = async () => {
        try {

          const username = sessionStorage.getItem("username");
         
          const response = await fetch(`http://localhost:5000/api/users/reportdata/${username}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch tax data');
          }
          
          const data = await response.json();
          setSummaryData(data);
        } catch (err) {
          setError(err.message);
          
        } 
      };
      
      fetchTaxData()
    // setSummaryData(mockData);
  }, []);

  return (
    <>
     <Navbar/>
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl text-[#2C0613] font-bold text-center mb-8">Tax Summary Reports</h1>
      <TaxSummaryChart data={summaryData} />
    </div>
    </>
    
  );
};

export default TaxChartPage;
