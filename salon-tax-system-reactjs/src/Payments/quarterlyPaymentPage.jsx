import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { alert } from "../components/AlertBoxes/alertBox";

const QuarterlyPaymentsPage = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);



  const email = sessionStorage.getItem('email');
  const paymentId = submission.paymentId
  // Load PayHere script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Set up PayHere onCompleted event listener
    if (window.payhere) {
      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID: " + orderId);
        updatePaymentStatus(paymentId);
      };
      
      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
      };
      
      window.payhere.onError = function onError(error) {
        console.log("Payment error: " + error);
      };
    }
    
    return () => {
      // Clean up the event listener when component unmounts
      if (window.payhere) {
        window.payhere.onCompleted = null;
        window.payhere.onDismissed = null;
        window.payhere.onError = null;
      }
    };
  }, []);

  // Fetch tax submission
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/fetch-taxsubmission/${submissionId}`);
        const data = await res.json();
        setSubmission(data);
      } catch (err) {
        console.error("Failed to load tax submission:", err);
      }
    };
    fetchSubmission();
  }, [submissionId, paymentSuccess]);

  const calculatePaidAmount = () => {
    return submission?.paymentDetails?.installmentPaid?.reduce(
      (sum, q) => sum + (parseFloat(q.amount) || 0),
      0
    ) || 0;
  };

  const calculateRemainingAmount = () => {
    return (parseFloat(submission?.balancePayable) || 0) - calculatePaidAmount();
  };

  const generateHash = async (orderId, amount) => {
    const response = await fetch("http://localhost:5000/api/users/generate-hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: "1230124",
        order_id: orderId,
        amount: amount.toFixed(2),
        currency: "LKR"
      }),
    });

    const { hash } = await response.json();
    console.log("hash:", hash);
    return hash;
  };

  const updatePaymentStatus = async (orderId) => {
    setLoading(true);
    try {
      const amount = calculateRemainingAmount();
      
      // Determine which quarter this payment is for
      const paidQuarters = submission?.paymentDetails?.installmentPaid || [];
      const nextQuarter = paidQuarters.length + 1;
      
      // Update both the submission and create/update payment record
      const response = await fetch(`http://localhost:5000/api/users/update-payment/${paymentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          submissionId: submissionId,
          payHereOrderId: orderId,
          username: submission.username || email,
          name: submission.name,
          salonname: submission.salonname || "N/A",
          tinNumber: submission.tinNumber,
          taxYear: submission.taxYear || new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
          paymentType: "quarterly",
          quarter: nextQuarter,
          amount: amount,
          isFullyPaid: (calculateRemainingAmount() - amount) <= 0
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPaymentSuccess(true);
        alert.success("Payment successful! Your payment record has been updated.");
      } else {
        console.error("Failed to update payment record:", result.message);
        alert.error("Payment was successful, but we couldn't update your records. Please contact support.");
      }
    } catch (err) {
      console.error("Error updating payment record:", err);
      alert.error("An error occurred while updating your payment record. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    const amount = calculateRemainingAmount();
    const orderId = `TAX-${Date.now()}`; // Create a unique order ID
    const hash = await generateHash(orderId, amount);
  
    const paymentData = {
      sandbox: true,
      merchant_id: "1230124",
      return_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
      notify_url: "http://localhost:5000/api/payments/notify",
      order_id: orderId,
      items: "Quarterly Tax Payment",
      amount: amount.toFixed(2),
      currency: "LKR",
      first_name: submission.name,
      email: email,
      phone: '0718444203',
      address: submission.address || "Colombo",
      city: "Colombo",
      country: "Sri Lanka",
      hash,
      // Add these additional fields that are sometimes required:
      last_name: "",
      delivery_address: submission.address || "Colombo",
      delivery_city: "Colombo",
      delivery_country: "Sri Lanka",
      custom_1: submissionId,
      custom_2: "Quarterly Tax Payment"
    };
    
    console.log("Payment data:", paymentData);
    
    // If you want to debug, log the data before sending
    window.payhere.startPayment(paymentData);
  };

  if (!submission) return <div className="p-6">Loading...</div>;
  if (loading) return <div className="p-6">Processing payment, please wait...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-[#380817]">Quarterly Payments</h1>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Submission ID: {submission._id}</h2>
        <p className="text-sm">Total Tax (Balance Payable): <strong>LKR {submission.balancePayable.toLocaleString()}</strong></p>
        <p className="text-sm">Paid So Far: <strong>LKR {calculatePaidAmount().toLocaleString()}</strong></p>
        <p className="text-sm text-[#380817]">Remaining Amount: <strong>LKR {calculateRemainingAmount().toLocaleString()}</strong></p>
      </div>

      {submission?.paymentDetails?.installmentPaid?.length > 0 ? (
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-[#986611]">Payments Made:</h3>
          <ul className="list-disc ml-6 text-sm">
            {submission.paymentDetails.installmentPaid.map((q, index) => (
              <li key={index}>
                Quarter {q.quarter} – LKR {q.amount.toLocaleString()} – Paid on {new Date(q.paidAt).toLocaleDateString("en-GB")}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">No payments have been made yet.</p>
      )}

      <button
        onClick={handlePayNow}
        disabled={calculateRemainingAmount() <= 0 || loading}
        className={`${
          calculateRemainingAmount() <= 0 || loading
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-[#986611] hover:bg-[#7b4e0f]'
        } text-white py-2 px-6 rounded-lg transition`}
      >
        {loading ? 'Processing...' : calculateRemainingAmount() <= 0 ? 'Payment Complete' : 'Pay Now'}
      </button>
    </div>
  );
};

export default QuarterlyPaymentsPage;