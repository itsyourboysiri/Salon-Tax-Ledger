import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const getStatusBadge = (status = "unknown") => {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize";
  switch (status.toLowerCase()) {
    case "confirmed":
      return <span className={`${base} bg-green-100 text-green-700`}>Confirmed</span>;
    case "declined":
      return <span className={`${base} bg-red-100 text-red-700`}>Declined</span>;
    case "pending":
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
    case "partial":
      return <span className={`${base} bg-orange-100 text-orange-700`}>Partial</span>;
    case "paid":
      return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
    default:
      return <span className={`${base} bg-gray-200 text-gray-700`}>{status}</span>;
  }
};

const TaxSubmissionTable = ({ submissions, onDownload }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatusMap, setPaymentStatusMap] = useState({});

  const fetchPaymentStatuses = async () => {
    const statuses = {};

    for (const entry of submissions) {
      if (entry.paymentId) {
        try {
          const res = await fetch(`http://localhost:5000/api/users/payment/${entry.paymentId}`);
          const paymentData = await res.json();

          if (res.ok && paymentData) {
            // ✅ TRUST backend isFullyPaid instead of re-calculating
            statuses[entry._id] = {
              isFullyPaid: paymentData.isFullyPaid || false,
              amountPaid: paymentData.amountPaid || 0,
            };
          } else {
            statuses[entry._id] = { isFullyPaid: false, amountPaid: 0 };
          }
        } catch (error) {
          console.error("Error fetching payment info:", error);
          statuses[entry._id] = { isFullyPaid: false, amountPaid: 0 };
        }
      } else {
        statuses[entry._id] = { isFullyPaid: false, amountPaid: 0 };
      }
    }

    setPaymentStatusMap(statuses);
  };

  useEffect(() => {
    if (submissions.length > 0) {
      fetchPaymentStatuses();
    }
  }, [submissions]);

  useEffect(() => {
    if (location.state?.reloadPayment) {
      window.location.reload(); // ✅ Full reload after payment success
    }
  }, [location]);

  const handleFullPayment = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/taxviewbyid/${id}`);
      const data = await res.json();

      if (!res.ok || !data) {
        console.error("Failed to retrieve document");
        return;
      }

      const paymentData = {
        name: data.name,
        tinNumber: data.tinNumber,
        salonName: data.salonName,
        totalTaxPayable: data.balancePayable,
        submissionId: id,
        paymentId: data.paymentId,
        paymentType: "full",
      };

      navigate("/taxpayment", { state: { paymentData } });
    } catch (err) {
      console.error("Error fetching tax form by ID:", err);
    }
  };

  const handleQuarterlyPayment = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/taxviewbyid/${id}`);
      const data = await res.json();

      if (!res.ok || !data) {
        console.error("Failed to retrieve document");
        return;
      }

      const paymentData = {
        name: data.name,
        tinNumber: data.tinNumber,
        salonName: data.salonName,
        totalTaxPayable: data.balancePayable,
        submissionId: id,
        paymentId: data.paymentId,
        paymentType: "quarterly",
      };

      navigate("/taxpayment", { state: { paymentData } });
    } catch (err) {
      console.error("Error fetching tax form by ID:", err);
    }
  };

  return (
    <div className="mt-8 overflow-x-auto bg-white shadow-md rounded-xl">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-[#41091B] text-white uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Submitted Date</th>
            <th className="px-6 py-4">Tax Payable</th>
            <th className="px-6 py-4">Submission Status</th>
            <th className="px-6 py-4">Payment Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {submissions.length > 0 ? (
            submissions.map((entry, index) => {
              const paymentInfo = paymentStatusMap[entry._id] || {};
              const isFullyPaid = paymentInfo.isFullyPaid;
              const amountPaid = paymentInfo.amountPaid || 0;

              return (
                <tr key={entry._id || index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{new Date(entry.submittedAt).toLocaleDateString("en-GB")}</td>
                  <td className="px-6 py-4">
                    {entry.balancePayable
                      ? `LKR ${Number(entry.balancePayable).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(entry.status)}</td>
                  <td className="px-6 py-4">
                    {isFullyPaid ? (
                      <span className="text-green-700 font-semibold">Paid</span>
                    ) : amountPaid > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-700 font-medium">Partial</span>
                        <button
                          onClick={() => handleQuarterlyPayment(entry._id)}
                          className="text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                        >
                          Pay Now
                        </button>
                      </div>
                    ) : entry.status?.toLowerCase() === "confirmed" ? (
                      <button
                        onClick={() => handleFullPayment(entry._id)}
                        className="text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Not available</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDownload(entry)}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Download size={16} /> PDF
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-6 text-center text-gray-400">
                No tax submissions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaxSubmissionTable;
