import { Link } from 'react-router-dom';
import payHereLogo from '../../public/payHere-Logo.png'
const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1] p-4">
      <div className="max-w-md w-full bg-white border border-[#986611] rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <img
            src={payHereLogo}
            alt="PayHere"
            className="h-8"
          />
        </div>

        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#380817] mt-4">Payment Successful!</h2>
        <p className="text-[#684E12] mt-2">
          Thank you for your payment. Your transaction was completed successfully.
        </p>

        <div className="mt-6">
          <Link
            to="/homepage"
            className="inline-block bg-[#380817] hover:bg-[#684E12] text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
