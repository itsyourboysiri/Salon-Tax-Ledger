import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import payHereLogo from '../../public/payHere-Logo.png'

const PayNowPage = () => {
  const [paymentType, setPaymentType] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location?.state?.paymentData || {};
  const name = sessionStorage.getItem('name') || 'Test';
  const email = sessionStorage.getItem('email');
  const phone = '0712345678';
  const salonName = sessionStorage.getItem('salonName')
  const tinNumber = sessionStorage.getItem('tinNumber')
  console.log("Email in frontend:",email)

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
    const merchantId = '1230124'; // Your sandbox merchant ID
    const currency = 'LKR';
   const  submissionId=paymentData.submissionId

   console.log("submission id:",submissionId)

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

    // Attach event handlers
    window.payhere.onCompleted = async function (orderId) {
      console.log("Payment completed. OrderID:", orderId);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // getMonth() is zero-based

      const taxYear = currentMonth >= 4
        ? `${currentYear}/${currentYear + 1}`
        : `${currentYear - 1}/${currentYear}`;

      const isFull = paymentType === 'full';

      const paymentRecord = {
        username: sessionStorage.getItem("username"),
        name: name,
        tinNumber: tinNumber,
        salonName: salonName,
        taxYear,
        paymentType,
        installmentPaid: isFull ? [] : [{
          quarter: Math.floor(new Date().getMonth() / 3) + 1, // Proper quarter (1 to 4)
          amount: parseFloat(amount.toFixed(2)),
          paidAt: new Date()
        }],
         // simulate current quarter
        isFullyPaid: isFull,
        amountPaid: parseFloat(amount.toFixed(2)),
        
        payHereOrderId: orderId,
        paidAt: [new Date()],
      };

      try {
        const res = await fetch('http://localhost:5000/api/users/save-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentRecord),
        });

        if (res.ok) {
          const { paymentId } = await res.json();
          console.log("Payment saved to DB.");

          if ( submissionId) {
            try {
              await fetch(`http://localhost:5000/api/users/update-taxsubmission/${ submissionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId }),
              });
              console.log("Tax submission updated with paymentId");
            } catch (updateError) {
              console.error("Failed to update tax submission with paymentId:", updateError);
            }
          }

           // ✅ SEND RECEIPT EMAIL
      await fetch('http://localhost:5000/api/users/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email:email,
          amountPaid: parseFloat(amount.toFixed(2)),
          taxYear,
          paymentType,
          salonName,
          tinNumber,
          payHereOrderId: orderId,
          paymentDate: now.toLocaleDateString("en-GB"),
        }),
      });
          // Save values to be preserved
          const preservedUsername = sessionStorage.getItem('username');
          const preservedName = sessionStorage.getItem('name');
          const preservedSalonName = sessionStorage.getItem('salonName');
          const preservedTinNumber = sessionStorage.getItem('tinNumber');
          const preservedemail = sessionStorage.getItem('email');

          sessionStorage.clear();
          navigate("/payment-success",{state:{paymentRecord}});

          // Restore only the allowed keys
          sessionStorage.setItem('username', preservedUsername);
          sessionStorage.setItem('name', preservedName);
          sessionStorage.setItem('salonName', preservedSalonName);
          sessionStorage.setItem('tinNumber', preservedTinNumber);
          sessionStorage.setItem('email', preservedemail);

        } else {
          console.error("Failed to store payment.");
        }
      } catch (err) {
        console.error("Error while saving payment:", err);
      }
    };


    window.payhere.onDismissed = function () {
      console.log("Payment dismissed");
    };

    window.payhere.onError = function (error) {
      console.log("Error:", error);
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

    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40 z-50">
      <div className="max-w-md w-full p-6 bg-[#FFF8E1] shadow-2xl rounded-2xl border border-[#986611]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#380817]">Payment Options</h2>
          <img src={payHereLogo} alt="PayHere" className="h-8" />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="full"
              onChange={(e) => setPaymentType(e.target.value)}
              className="accent-[#380817]"
            />
            <span className="text-[#684E12] font-medium">Full Payment</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="quarterly"
              onChange={(e) => setPaymentType(e.target.value)}
              className="accent-[#986611]"
            />
            <span className="text-[#684E12] font-medium">Quarterly Payment</span>
          </label>
        </div>

        {paymentType && (
          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-[#684E12] text-left space-y-1">
              <p><strong>Name:</strong> {paymentData.name}</p>
              <p><strong>TIN:</strong> {paymentData.tin || 'N/A'}</p>
              <p><strong>Salon Name:</strong> {paymentData.salonName || 'N/A'}</p>
              <p><strong>Payment Date:</strong> {paymentData.paymentDate || new Date().toLocaleDateString("en-GB")}</p>
            </div>

            <p className="text-sm text-[#684E12] mt-3">You are about to pay:</p>
            <p className="text-2xl font-bold text-[#380817]">
              LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>

            <button
              onClick={handlePayNow}
              className="mt-4 w-full bg-[#380817] hover:bg-[#684E12] text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Pay Now with PayHere
            </button>
          </div>
        )}

      </div>
    </div>


  );
};

export default PayNowPage;
