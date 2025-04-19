import React from "react";

const QuarterlyPayment = ({ quarterlyAmount }) => {
  const dueDates = [
    "31st March",
    "30th June",
    "30th September",
    "31st December"
  ];

  const quarterlyData = [
    { quarter: "Q1", amount: quarterlyAmount, due: dueDates[0] },
    { quarter: "Q2", amount: quarterlyAmount, due: dueDates[1] },
    { quarter: "Q3", amount: quarterlyAmount, due: dueDates[2] },
    { quarter: "Q4", amount: quarterlyAmount, due: dueDates[3] },
  ];

  return (
    <div className="mt-10 p-6 bg-[#FFF3F0] border border-[#620F28] rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-[#620F28] mb-4">Quarterly Tax Payment Breakdown</h2>
  
    <div className="overflow-x-auto">
      <table className="min-w-full border border-[#41091B] rounded-md text-sm text-[#41091B] bg-white">
        <thead className="bg-[#620F28] text-white">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Quarter</th>
            <th className="px-6 py-3 text-left font-semibold">Payment Amount (LKR)</th>
            <th className="px-6 py-3 text-left font-semibold">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {quarterlyData.map((item, index) => (
            <tr key={index} className="border-t hover:bg-[#FDF0EF]">
              <td className="px-6 py-3 font-medium">{item.quarter}</td>
              <td className="px-6 py-3">
                {parseFloat(item.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="px-6 py-3">{item.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default QuarterlyPayment;
