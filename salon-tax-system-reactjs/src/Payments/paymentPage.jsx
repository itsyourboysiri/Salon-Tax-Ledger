import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import payHereLogo from '../../public/payHere-Logo.png';

const PayNowPage = () => {
  const [paymentType, setPaymentType] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location?.state?.paymentData || {};

  const name = sessionStorage.getItem('name') || 'Test';
  const email = sessionStorage.getItem('email');
  const phone = '0712345678';
  const salonName = sessionStorage.getItem('salonName');
  const tinNumber = sessionStorage.getItem('tinNumber');

  const amount = paymentType === 'full'
    ? Number(paymentData.totalTaxPayable)
    : Number(paymentData.totalTaxPayable) / 4;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayNow = async () => {
    const orderId = `TAX-${Date.now()}`;
    const merchantId = '1230124'; // your sandbox ID
    const currency = 'LKR';

    // ✅ Important fix here
    const paymentId = paymentData.paymentId || paymentData.submissionId;
    const submissionId = paymentData.submissionId;

    const res = await fetch('http://localhost:5000/api/users/generate-hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        order_id: orderId,
        amount: amount.toFixed(2),
        currency,
      }),
    });

    const { hash } = await res.json();

    window.payhere.onCompleted = async function () {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const taxYear = currentMonth >= 4
        ? `${currentYear}/${currentYear + 1}`
        : `${currentYear - 1}/${currentYear}`;

      const paidAt = now.toISOString();

      try {
        if (paymentType === "quarterly") {
          // ✅ Quarterly: insert installment
          await fetch(`http://localhost:5000/api/users/quaterly-update-payment/${paymentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: parseFloat(amount.toFixed(2)),
              quarter: Math.floor((now.getMonth() + 3) / 3),
              paidAt,
              payHereOrderId: orderId, // 🛠 send orderId for quarterly
            }),
          });

        } else if (paymentType === "full") {
          // ✅ Full: create full payment document
          await fetch('http://localhost:5000/api/users/save-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: sessionStorage.getItem("username"),
              name,
              tinNumber,
              salonName,
              taxYear,
              paymentType: "full",
              installmentPaid: [],
              isFullyPaid: true,
              amountPaid: parseFloat(amount.toFixed(2)),
              payHereOrderId: orderId,
              paidAt: [now],
              submissionId: submissionId // ✅ passed properly
            }),
          });
        }

        await fetch('http://localhost:5000/api/users/send-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            tinNumber,
            salonName,
            paymentType,
            taxYear,
            amountPaid: parseFloat(amount.toFixed(2)),
            payHereOrderId: orderId,
            paymentDate: now.toLocaleDateString('en-GB')
          }),
        });

        navigate("/payment-success", { state: { reloadPayment: true } });

      } catch (err) {
        console.error("Error after payment:", err);
      }
    };

    window.payhere.onDismissed = function () {
      console.log("Payment dismissed");
    };

    window.payhere.onError = function (error) {
      console.log("Payment error:", error);
    };

    const payment = {
      sandbox: true,
      merchant_id: merchantId,
      return_url: 'http://localhost:5173/payment-success',
      cancel_url: 'http://localhost:5173/payment-cancel',
      notify_url: 'https://localhost:5000/api/users/payhere-notify',
      order_id: orderId,
      items: 'Income Tax Payment',
      amount: amount.toFixed(2),
      currency,
      hash,
      first_name: name,
      last_name: 'User',
      email,
      phone,
      address: 'Colombo',
      city: 'Colombo',
      country: 'Sri Lanka',
    };

    window.payhere.startPayment(payment);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
      <div className="max-w-md w-full p-6 bg-[#FFF8E1] shadow-2xl rounded-2xl border border-[#986611]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#380817]">Payment Options</h2>
          <img src={payHereLogo} alt="PayHere" className="h-8" />
        </div>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="full"
              onChange={(e) => setPaymentType(e.target.value)}
              className="accent-[#380817]"
              checked={paymentType === "full"}
            />
            <span className="text-[#684E12] font-medium">Full Payment</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="quarterly"
              onChange={(e) => setPaymentType(e.target.value)}
              className="accent-[#986611]"
              checked={paymentType === "quarterly"}
            />
            <span className="text-[#684E12] font-medium">Quarterly Payment</span>
          </label>
        </div>

        {paymentType && (
          <div className="mt-6 text-center space-y-2">
            <p className="text-[#684E12] text-left text-sm">
              <strong>Name:</strong> {paymentData.name}
            </p>
            <p className="text-[#684E12] text-left text-sm">
              <strong>Salon Name:</strong> {paymentData.salonName}
            </p>
            <p className="text-2xl font-bold text-[#380817]">
              LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <button
              onClick={handlePayNow}
              className="mt-4 w-full bg-[#380817] hover:bg-[#684E12] text-white font-semibold py-2 px-4 rounded-lg transition"
              disabled={!paymentType}
            >
              Pay Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayNowPage;
