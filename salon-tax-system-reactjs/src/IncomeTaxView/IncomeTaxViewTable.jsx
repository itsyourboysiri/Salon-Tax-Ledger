import React from "react";
import { Download } from "lucide-react";

const TaxSubmissionTable = ({ submissions, onDownload }) => {
  return (
    <div className="mt-6 overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-[#620F28] text-white">
          <tr>
            <th className="px-4 py-3 text-left border-r">Submitted Date</th>
            <th className="px-4 py-3 text-left border-r">Tax Payable (LKR)</th>
            <th className="px-4 py-3 text-left border-r">Payment Status</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-base">
          {submissions.length > 0 ? (
            submissions.map((entry, index) => (
              <tr key={index} className="transition bg-gray-100 border-t hover:bg-red-50">
                <td className="px-4 py-2 border-r">
                  {new Date(entry.submittedAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-2 border-r">
                  {entry.balancePayable
                    ? `LKR ${entry.balancePayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    : "N/A"}
                </td>
                <td className="px-4 py-2 border-r">
                  {entry.paymentStatus === "Partial" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-700 font-medium">Partial</span>
                      <button
                        onClick={() => window.open(`/quarterly-payments/${entry._id}`, '_blank')}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Pay Now
                      </button>
                    </div>
                  ) : (
                    entry.paymentStatus || 'Unknown'
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onDownload(entry)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download PDF
                  </button>
                </td>
              </tr>

            ))
          ) : (
            <tr className="text-center text-gray-500">
              <td colSpan="3" className="py-4">
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
