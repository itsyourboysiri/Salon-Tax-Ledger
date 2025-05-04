import React from "react";

const OngoingPaymentsTable = ({ submissions, paymentStatusMap }) => {
  // Filter only partial payments
  const ongoingPayments = submissions.filter((entry) => {
    const paymentInfo = paymentStatusMap[entry._id];
    return paymentInfo && !paymentInfo.isFullyPaid && paymentInfo.amountPaid > 0;
  });

  return (
    <div className="mt-12 overflow-x-auto bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold text-[#41091B] px-6 py-4">Ongoing (Quarterly) Payments</h2>
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-[#41091B] text-white uppercase text-xs">
          <tr>
            <th scope="col" className="px-6 py-4">Submitted Date</th>
            <th scope="col" className="px-6 py-4">Tax Payable</th>
            <th scope="col" className="px-6 py-4">Paid Amount</th>
            <th scope="col" className="px-6 py-4">Remaining Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ongoingPayments.length > 0 ? (
            ongoingPayments.map((entry, index) => {
              const paymentInfo = paymentStatusMap[entry._id];
              const paidAmount = paymentInfo.amountPaid || 0;
              const remainingAmount = (entry.balancePayable || 0) - paidAmount;

              return (
                <tr key={entry._id || index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {new Date(entry.submittedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-4">
                    {entry.balancePayable
                      ? `LKR ${Number(entry.balancePayable).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {`LKR ${Number(paidAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </td>
                  <td className="px-6 py-4">
                    {`LKR ${Number(remainingAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-6 text-center text-gray-400">
                No ongoing quarterly payments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OngoingPaymentsTable;
