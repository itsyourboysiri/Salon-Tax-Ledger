import React from 'react';
import { X } from 'lucide-react';

const formatCurrency = (val) => `LKR ${Number(val || 0).toLocaleString()}`;

export default function TaxDetailsModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const renderTable = (title, list, nameKey, valueKey) => {
    if (!Array.isArray(list) || list.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#41091B] text-white">
            <tr>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{item[nameKey]}</td>
                <td className="p-2 border">{formatCurrency(item[valueKey])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const donationLabels = {
    gov: "Donation to Government",
    approved: "Donation to Approved Charity",
    other: "Other Donations"
  };

  return (
    <div className="fixed inset-0 z-50  bg-opacity-40 backdrop-blur-sm flex justify-center items-center px-4 py-8">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-lg relative p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-500">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Income Tax Details</h2>

        {renderTable("Employment Income", data.employeeIncomeEntries, "empIncomeName", "empIncome")}
        {renderTable("Business Income", data.businessIncomeEntries, "businessIncomeName", "businessIncome")}
        {renderTable("Other Income", data.otherIncomeEntries, "otherIncomeName", "otherIncome")}
        {renderTable("Foreign Income", data.foreignIncomeEntries, "foriegnIncomeName", "foriegnIncome")}

        {data.investmentIncomeEntries && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Investment Income</h3>
            <table className="w-full text-sm border-collapse">
              <thead className="bg-[#41091B] text-white">
                <tr>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.investmentIncomeEntries).map(([key, val], idx) => (
                  <tr key={idx}>
                    <td className="p-2 border capitalize">{key}</td>
                    <td className="p-2 border">{formatCurrency(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {Array.isArray(data.qualifyingPaymentsEntries) && data.qualifyingPaymentsEntries.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Deductible on Qualifying Payments</h3>
            <table className="w-full text-sm border-collapse">
              <thead className="bg-[#41091B] text-white">
                <tr>
                  <th className="p-2 border">Donation Type</th>
                  <th className="p-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.qualifyingPaymentsEntries.map((payment, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{donationLabels[payment.donationType] || payment.donationType}</td>
                    <td className="p-2 border">{formatCurrency(payment.donationAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {Array.isArray(data.reliefEntries) && data.reliefEntries.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reliefs</h3>
            <table className="w-full text-sm border-collapse">
              <thead className="bg-[#41091B] text-white">
                <tr>
                  <th className="p-2 border">Relief Type</th>
                  <th className="p-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.reliefEntries.map((relief, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{relief.reliefName || 'Unnamed Relief'}</td>
                    <td className="p-2 border">{formatCurrency(relief.reliefAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-[#FFF8E1] border border-[#986611] rounded-md">
          <h4 className="text-lg font-semibold text-[#684E12] mb-3">Summary</h4>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-[#583617]">
            <div className="flex">
              <span className="w-44 font-semibold">Assessable Income:</span>
              <span>{formatCurrency(data.assessableIncome)}</span>
            </div>
            <div className="flex justify-end">
              <span className="w-44 text-right font-semibold">Total Tax Liability:</span>
              <span>{formatCurrency(data.totalTaxLiable)}</span>
            </div>
            <div className="flex">
              <span className="w-44 font-semibold">Total Deductions:</span>
              <span>{formatCurrency(data.totalDeductions)}</span>
            </div>
            <div className="flex justify-end">
              <span className="w-44 text-right font-semibold">WHT:</span>
              <span>{formatCurrency(data.withHoldingTax)}</span>
            </div>
            <div className="flex">
              <span className="w-44 font-semibold">Taxable Income:</span>
              <span>{formatCurrency(data.taxableIncome)}</span>
            </div>
            <div className="flex justify-end">
              <span className="w-44 text-right font-semibold">APIT:</span>
              <span>{formatCurrency(data.apit)}</span>
            </div>
          </div>

          <div className="mt-6 text-center text-[#620F28] text-base">
            <p className="font-semibold text-lg">
              <strong>Tax Payable:</strong> {formatCurrency(data.balancePayable)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
