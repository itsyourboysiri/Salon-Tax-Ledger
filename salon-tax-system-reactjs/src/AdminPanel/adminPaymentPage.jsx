import React, { useEffect, useState } from "react";
import TopAndSideBar from "./Dashboard Components/sideBar";
import { alert } from '../../src/components/AlertBoxes/alertBox';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("full");
  const [notifyingUsers, setNotifyingUsers] = useState(new Set()); // Track which users are being notified

  useEffect(() => {
    fetchPayments();
    fetchPendingPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/all-payments');
      const data = await res.json();
      if (res.ok) {
        setPayments(data);
      } else {
        console.error("Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/pending-payments');
      const data = await res.json();
      if (res.ok) {
        console.log("Pending Payments Data:", data);
        setPendingPayments(data);
      } else {
        console.error("Failed to fetch pending payments");
      }
    } catch (error) {
      console.error("Error fetching pending payments:", error);
    }
  };

  const handleNotifyUser = async (username, pendingId) => {
    // Add user to notifying set to show loading state
    setNotifyingUsers(prev => new Set([...prev, pendingId]));

    try {
      const res = await fetch('http://localhost:5000/api/admin/notify-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.ok) {
        alert.success(`Email notification sent successfully to ${username}!`);
      } else {
        alert.error(`Failed to send notification: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert.error("Error sending notification. Please try again.");
    } finally {
      // Remove user from notifying set
      setNotifyingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(pendingId);
        return newSet;
      });
    }
  };

  const filteredPayments = payments.filter(payment => payment.paymentType === paymentTypeFilter);

  return (
    <TopAndSideBar>
      <div className="p-6 space-y-12">

        {/* ======== All Payments Section ======== */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-[#41091B]">All Payments</h1>

          {/* Payment Type Toggle */}
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 text-[#41091B] font-medium">
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={paymentTypeFilter === "full"}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="accent-[#41091B]"
              />
              Full Payments
            </label>
            <label className="flex items-center gap-2 text-[#41091B] font-medium">
              <input
                type="radio"
                name="paymentType"
                value="quarterly"
                checked={paymentTypeFilter === "quarterly"}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="accent-[#41091B]"
              />
              Quarterly Payments
            </label>
          </div>

          {/* First Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 uppercase text-xs">
                  <th className="px-6 py-3 text-left font-semibold">Username</th>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Salon Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Payment Type</th>
                  <th className="px-6 py-3 text-left font-semibold">Tax Year</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount Paid</th>
                  <th className="px-6 py-3 text-left font-semibold">Paid Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <React.Fragment key={payment._id}>
                      <tr
                        onClick={() => setExpandedPaymentId(expandedPaymentId === payment._id ? null : payment._id)}
                        className="hover:bg-[#f8f0e7] cursor-pointer transition"
                      >
                        <td className="px-6 py-4">{payment.username}</td>
                        <td className="px-6 py-4">{payment.name}</td>
                        <td className="px-6 py-4">{payment.salonname}</td>
                        <td className="px-6 py-4 capitalize">{payment.paymentType}</td>
                        <td className="px-6 py-4">{payment.taxYear}</td>
                        <td className="px-6 py-4">
                          LKR {Number(payment.amountPaid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          {payment.paymentType === "full"
                            ? new Date(payment.paidAt[0]).toLocaleDateString("en-GB")
                            : "Multiple Installments"}
                        </td>
                        <td className="px-6 py-4">{payment.payHereOrderId || "-"}</td>
                      </tr>

                      {/* ======= Improved Expandable Table ======= */}
                      {expandedPaymentId === payment._id && payment.paymentType === "quarterly" && (
                        <tr>
                          <td colSpan="8" className="bg-gray-50">
                            <div className="p-6 rounded-lg border border-dashed border-gray-300 bg-white">
                              <h3 className="text-lg font-semibold text-[#41091B] mb-4">Installment Details</h3>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-xs text-gray-700">
                                  <thead className="bg-gray-100 text-gray-600 uppercase">
                                    <tr>
                                      <th className="px-4 py-3 text-left">Quarter</th>
                                      <th className="px-4 py-3 text-left">Amount</th>
                                      <th className="px-4 py-3 text-left">Paid Date</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {payment.installmentPaid.map((inst, index) => (
                                      <tr key={index} className="hover:bg-[#f8f0e7]">
                                        <td className="px-4 py-2 font-medium">Q{inst.quarter}</td>
                                        <td className="px-4 py-2">
                                          LKR {Number(inst.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-2">
                                          {new Date(inst.paidAt).toLocaleDateString('en-GB')}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-6 text-center text-gray-400">
                      No {paymentTypeFilter} payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======== Pending Payments Section ======== */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-[#41091B]">Pending Payments</h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 uppercase text-xs">
                  <th className="px-6 py-3 text-left font-semibold">Username</th>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Salon Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Tax Year</th>
                  <th className="px-6 py-3 text-left font-semibold">Balance Payable</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingPayments.length > 0 ? (
                  pendingPayments.map((pending) => (
                    <tr key={pending._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{pending.username}</td>
                      <td className="px-6 py-4">{pending.name}</td>
                      <td className="px-6 py-4">{pending.salonName}</td>
                      <td className="px-6 py-4">2025/2026</td>
                      <td className="px-6 py-4">
                        LKR {Number(pending.balancePayable).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleNotifyUser(pending.username, pending._id)}
                          disabled={notifyingUsers.has(pending._id)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            notifyingUsers.has(pending._id)
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-[#986611] text-white hover:bg-[#684E12]'
                          }`}
                        >
                          {notifyingUsers.has(pending._id) ? 'Sending...' : 'Notify User'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-400">
                      No pending payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </TopAndSideBar>
  );
};

export default AdminPaymentsPage;