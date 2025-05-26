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
import Dashboard from "./AdminPanel/adminHome";
import ProfileSection from "./AdminPanel/profilePage";
import TaxInformation from "./AdminPanel/taxInformationPage";
import AdminHome from "./AdminPanel/adminHome";
import UsersPage from "./AdminPanel/usersPage";
import PaymentHistoryPage from "./Payments/paymentHistoryPage";
import AdminPaymentsPage from "./AdminPanel/adminPaymentPage";
import TaxChartPage from "./reports/reportPage";
import ReportPage from "./AdminPanel/adminReportPage";
import AdminLogin from "./AdminPanel/AdminSignupAndLogin/adminLogin";
import AdminSignup from "./AdminPanel/AdminSignupAndLogin/adminSignUp";


function App() {
 

  return (
    <BrowserRouter>
     
     <Routes>
        <Route path="/" element={<UserLogin />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/signup" element={<UserRegistrationForm />} />
          <Route path="/taxform" element={<IncomeTaxForm />} />
          <Route path="/taxview" element={<TaxViewPage />} />
          <Route path="/taxreview" element={<IncomeTaxReview />} />
          <Route path="/taxpayment" element={<PayNowPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/userprofile" element={<UserProfilePage />} />
          <Route path="/quarterly-payments/:submissionId" element={<QuarterlyPaymentsPage />} />
          <Route path="/admin-editprofile" element={<ProfileSection />} />
          <Route path="/admin-taxinformation" element={<TaxInformation />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-users" element={<UsersPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/admin-payments" element={<AdminPaymentsPage/>} />
          <Route path="/taxgraphs" element={<TaxChartPage/>} />
          <Route path="/admin-taxgraphs" element={<ReportPage/>} />
          <Route path="/admin-login" element={<AdminLogin/>} />
          <Route path="/admin-signup" element={<AdminSignup/>} />

          
      </Routes>
    </BrowserRouter>
  )
}

export default App
