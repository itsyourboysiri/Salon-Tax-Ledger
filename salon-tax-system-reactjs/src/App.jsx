import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserLogin from './pages/userlogin'
import UserRegistrationForm from './components/user/user_registration'
import UserLoginForm from './components/user/user_login_form'
import HomePage from './pages/homepage'
import Navbar from './components/navbar/navbar'
import IncomeTaxForm from "./components/tax form/incometaxform";

import TaxViewPage from "./IncomeTaxView/taxViewPage";
import IncomeTaxReview from "./IncomeTaxView/incomeTaxReview";
import PayNowPage from "./Payments/paymentPage";
import PaymentSuccess from "./Payments/paymentSuccess";
import UserProfilePage from "./components/userprofile/userprofile";
import QuarterlyPaymentsPage from "./Payments/quarterlyPaymentPage";


function App() {
 

  return (
    <BrowserRouter>
     
     <Routes>
        <Route path="/" element={<UserLogin  />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/signup" element={<UserRegistrationForm />} />
          <Route path="/taxform" element={<IncomeTaxForm />} />
          <Route path="/taxview" element={<TaxViewPage />} />
          <Route path="/taxreview" element={<IncomeTaxReview />} />
          <Route path="/taxpayment" element={<PayNowPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/userprofile" element={<UserProfilePage />} />
          <Route path="/quarterly-payments/:submissionId" element={<QuarterlyPaymentsPage />} />
          
      </Routes>
    </BrowserRouter>
  )
}

export default App
