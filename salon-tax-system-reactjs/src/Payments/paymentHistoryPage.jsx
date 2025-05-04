import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/navbar";

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [expandedTaxYear, setExpandedTaxYear] = useState(null); // ✅ To manage expand/collapse
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    if (username) {
      fetchPaymentHistory();
    }
  }, [username]);

  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/payment-history/${username}`);
      const data = await res.json();

      if (res.ok) {
        setPayments(data);
      } else {
        console.error("Failed to fetch payment history");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  // Full Payments
  const fullPayments = payments.filter((p) => p.paymentType === "full");

  // Quarterly Payments
  const groupedQuarterlyPayments = payments
    .filter((p) => p.paymentType === "quarterly")
    .map((p) => ({
      taxYear: p.taxYear,
      payHereOrderId: p.payHereOrderId,
      name: p.name,
      salonname: p.salonname,
      installments: p.installmentPaid,
    }));

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#41091B] mb-6">Payment History</h1>

        {/* Full Payments Table */}
        <div className="bg-white shadow-md rounded-xl overflow-x-auto mb-10">
          <h2 className="text-xl font-bold text-[#41091B]  py-4">Full Payments</h2>
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-[#41091B] text-white uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Paid Date</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Tax Year</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Salon Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fullPayments.length > 0 ? (
                fullPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{new Date(payment.paidAt[0]).toLocaleDateString("en-GB")}</td>
                    <td className="px-6 py-4">
                      LKR {Number(payment.amountPaid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">{payment.taxYear}</td>
                    <td className="px-6 py-4">{payment.payHereOrderId || "-"}</td>
                    <td className="px-6 py-4">{payment.name || "-"}</td>
                    <td className="px-6 py-4">{payment.salonname || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-400">
                    No full payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quarterly Payments Table */}
        <div className="bg-white shadow-md rounded-xl overflow-x-auto">
          <h2 className="text-xl font-bold text-[#41091B] py-4">Quarterly Payments</h2>
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-[#41091B] text-white uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Tax Year</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Salon Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groupedQuarterlyPayments.map((group, index) => (
                <React.Fragment key={index}>
                  <tr
                    onClick={() => setExpandedTaxYear(expandedTaxYear === index ? null : index)} // ✅ use index instead of taxYear
                    className="hover:bg-gray-100 cursor-pointer transition"
                  >
                    <td className="px-6 py-4">{group.taxYear}</td>
                    <td className="px-6 py-4">{group.payHereOrderId || "-"}</td>
                    <td className="px-6 py-4">{group.name || "-"}</td>
                    <td className="px-6 py-4">{group.salonname || "-"}</td>
                  </tr>

                  {/* Expandable Installments */}
                  {expandedTaxYear === index && (  // ✅ check with index instead of taxYear
                    <tr>
                      <td colSpan="4" className="p-4">
                        <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2">Paid Date</th>
                              <th className="px-4 py-2">Amount Paid</th>
                              <th className="px-4 py-2">Quarter</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.installments.map((inst, idx) => (
                              <tr key={idx} className="border-t border-gray-200">
                                <td className="px-4 py-2">{new Date(inst.paidAt).toLocaleDateString("en-GB")}</td>
                                <td className="px-4 py-2">
                                  LKR {Number(inst.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-2">Q{inst.quarter}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PaymentHistoryPage;
