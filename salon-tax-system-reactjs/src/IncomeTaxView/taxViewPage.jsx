import React, { useEffect, useState } from "react";
import TaxSubmissionTable from "./IncomeTaxViewTable";
import Navbar from "../components/navbar/navbar";
import handleDownloadPDF from "./IncomeTaxPDFDoc";
import CustomYearMonthPicker from "../components/yearAndMonthPicker";
import OngoingPaymentsTable from "../Payments/onGoingPaymentTable";

// Get current date as YYYY-MM
const getCurrentYearMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const TaxViewPage = () => {
  const [taxFormList, setTaxFormList] = useState([]);
  const [paymentStatusMap, setPaymentStatusMap] = useState({});

  const defaultDate = getCurrentYearMonth(); // default date
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const username = sessionStorage.getItem("username");

  const fetchTaxSubmissions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/taxview/${username}`
      );
      const data = await response.json();

      console.log("Retrieved data from taxform collection:", data);

      if (response.ok) {
        setTaxFormList(data);
        fetchPaymentStatuses(data); // Fetch payments immediately after submissions
      } else {
        console.error("Failed to fetch tax submissions:", data.message);
      }
    } catch (err) {
      console.error("Error fetching tax data:", err);
    }
  };

  const fetchPaymentStatuses = async (submissions) => {
    const statuses = {};

    for (const entry of submissions) {
      if (entry.paymentId) {
        try {
          const res = await fetch(`http://localhost:5000/api/users/payment/${entry.paymentId}`);
          const paymentData = await res.json();

          if (res.ok && paymentData) {
            const isFullyPaid = paymentData.amountPaid >= (entry.balancePayable || 0);
            statuses[entry._id] = {
              isFullyPaid,
              amountPaid: paymentData.amountPaid,
            };
          } else {
            statuses[entry._id] = {
              isFullyPaid: false,
              amountPaid: 0,
            };
          }
        } catch (error) {
          console.error("Error fetching payment info for:", entry.paymentId);
          statuses[entry._id] = {
            isFullyPaid: false,
            amountPaid: 0,
          };
        }
      } else {
        statuses[entry._id] = {
          isFullyPaid: false,
          amountPaid: 0,
        };
      }
    }

    setPaymentStatusMap(statuses);
  };

  useEffect(() => {
    if (username) {
      fetchTaxSubmissions();
    }
  }, [username]);

  // Filter tax forms by selected date
  const filteredList = taxFormList.filter((item) => {
    if (!selectedDate) return true;

    const submittedAt = item.submittedAt;
    if (!submittedAt) return false;

    const submittedDate = new Date(submittedAt);
    if (isNaN(submittedDate.getTime())) return false;

    const itemYearMonth =
      submittedDate.getFullYear() +
      "-" +
      String(submittedDate.getMonth() + 1).padStart(2, "0");

    return itemYearMonth === selectedDate;
  });

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Past Tax Submissions
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Filter by Month & Year
          </label>

          <CustomYearMonthPicker
            onSelect={setSelectedDate}
            defaultValue={defaultDate}
          />

          {selectedDate !== defaultDate && (
            <button
              onClick={() => setSelectedDate(defaultDate)}
              className="mt-3 px-4 py-2 bg-[#FFF3CF] text-[#986611] text-sm font-medium rounded-lg shadow-sm hover:bg-[#FFE8AA] transition duration-300 flex items-center gap-2"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* First Table - Past Submissions */}
        <TaxSubmissionTable
          submissions={filteredList}
          onDownload={handleDownloadPDF}
        />

        {/* Second Table - Ongoing Payments */}
        <OngoingPaymentsTable
          submissions={filteredList}
          paymentStatusMap={paymentStatusMap}
        />
      </div>
    </>
  );
};

export default TaxViewPage;
