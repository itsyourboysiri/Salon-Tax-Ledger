import React, { useEffect, useState } from 'react';
import EmployeeIncome from './TaxForm Components/employementIncome';
import ReliefPayments from './TaxForm Components/reliefPayments';
import InvestmentIncome from './TaxForm Components/investmentIncome';
import BusinessIncome from './TaxForm Components/businessIncome';
import OtherIncome from './TaxForm Components/otherIncome';
import ForeignIncome from './TaxForm Components/foriegnIncome';
import QualifyingPayments from './TaxForm Components/qaulifyingPayments';
import TaxLiability from './TaxForm Components/taxLiable';
import Navbar from '../navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const IncomeTaxForm = () => {
  const [totalBusinessIncome, setTotalBusinessIncome] = useState(0);
  const [totalEmployeeIncome, setTotalEmployeeIncome] = useState(0);
  const [totalOtherIncome, setTotalOtherIncome] = useState(0);
  const [totalForeignIncome, setTotalForeignIncome] = useState(0);
  const [totalInvestmentIncome, setTotalInvestmentIncome] = useState(0);
  const [totalRelief, setTotalRelief] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [withHoldingTax, setWithHoldingTax] = useState(0);

  const [finalPayment, setFinalPayment] = useState(0);
  const [totalTaxLiable, setTotalTaxLiable] = useState(0);

  const [capitalGainIncome, setCapitalGainIncome] = useState(0);

  const [employeeIncomeEntries, setEmployeeIncomeEntries] = useState([]);
  const [businessIncomeEntries, setBusinessIncomeEntries] = useState([]);
  const [investmentIncomeEntries, setInvestmentIncomeEntries] = useState({});
  const [otherIncomeEntries, setOtherIncomeEntries] = useState([]);
  const [foreignIncomeEntries, setForeignIncomeEntries] = useState([]);
  const [qualifyingPaymentsEntries, setQualifyingPaymentsEntries] = useState([]);
  const [reliefEntries, setReliefEntries] = useState([]);
  const [taxCreditsData, setTaxCreditsData] = useState({});
  
  //repopulating the fields after redirecting to the tax review page
  const location = useLocation();
const taxData = location?.state?.taxData;

  const username = sessionStorage.getItem('username');
  const name = sessionStorage.getItem('name');
  const salonName = sessionStorage.getItem('salonName');
  const tinNumber = sessionStorage.getItem('tinNumber');

  const navigate = useNavigate();


  const assessableIncome =
    totalBusinessIncome +
    totalEmployeeIncome +
    totalOtherIncome +
    totalForeignIncome +
    totalInvestmentIncome;


  const totalDeductions = totalRelief + totalDonations;

  const taxableIncome = Math.max(assessableIncome - totalDeductions, 0);

  // const installment = withHoldingTax / 4;

  const calculateMonthlyAPIT = (monthlyIncome) => {
    let tax = 0;

    const brackets = [
      { limit: 100000, rate: 0 },
      { limit: 141667, rate: 0.06 },
      { limit: 183333, rate: 0.12 },
      { limit: 225000, rate: 0.18 },
      { limit: 266667, rate: 0.24 },
      { limit: 308333, rate: 0.30 },
    ];

    let remaining = monthlyIncome;
    let previousLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
      const { limit, rate } = brackets[i];

      if (monthlyIncome <= limit) {
        tax += (remaining) * rate;
        return tax;
      }

      const taxableAmount = limit - previousLimit;
      tax += taxableAmount * rate;
      remaining -= taxableAmount;
      previousLimit = limit;
    }

    // Apply 36% for remaining income above the top slab
    tax += remaining * 0.36;
    return tax;
  };

  const monthlyEmployeeIncome = totalEmployeeIncome / 12;
  const apit = calculateMonthlyAPIT(monthlyEmployeeIncome) ;

  const totalTaxPaid = withHoldingTax  + apit;

  const balancePayable = totalTaxLiable - totalTaxPaid;

  const quarterlyInstallment = (balancePayable / 4).toFixed(2);

  const fullTaxFormData = {
    username,
    name,
    salonName,
    tinNumber,
    assessableIncome,
    totalDeductions,
    taxableIncome,
    totalTaxLiable,
    withHoldingTax,
    // installment,
    apit,
    totalTaxPaid,
    balancePayable,
    finalPayment,

    // Income details
    totalBusinessIncome,
    totalEmployeeIncome,
    totalOtherIncome,
    totalForeignIncome,
    totalInvestmentIncome,

    // Entries (for detailed view)
    employeeIncomeEntries,
    businessIncomeEntries,
    investmentIncomeEntries,
    otherIncomeEntries,
    foreignIncomeEntries,

    // Deductions
    qualifyingPaymentsEntries,
    reliefEntries,
    taxCreditsData,

    submittedAt: new Date().toISOString(), // optional for backend tracking
    quarterlyInstallment
  };

 
  

  useEffect(() => {
    if (taxData) {
      setTotalBusinessIncome(taxData.totalBusinessIncome);
      setTotalEmployeeIncome(taxData.totalEmployeeIncome);
      setTotalOtherIncome(taxData.totalOtherIncome);
      setTotalForeignIncome(taxData.totalForeignIncome);
      setTotalInvestmentIncome(taxData.totalInvestmentIncome);
      setTotalRelief(taxData.totalRelief);
      setTotalDonations(taxData.totalDonations);
      setWithHoldingTax(taxData.withHoldingTax);
      setTotalTaxLiable(taxData.totalTaxLiable);
      setFinalPayment(taxData.finalPayment);
      setCapitalGainIncome(taxData.capitalGainIncome);
  
      // Rehydrate entries
      setEmployeeIncomeEntries(taxData.employeeIncomeEntries || []);
      setBusinessIncomeEntries(taxData.businessIncomeEntries || []);
      setInvestmentIncomeEntries(taxData.investmentIncomeEntries || {});
      setOtherIncomeEntries(taxData.otherIncomeEntries || []);
      setForeignIncomeEntries(taxData.foreignIncomeEntries || []);
      setQualifyingPaymentsEntries(taxData.qualifyingPaymentsEntries || []);
      setReliefEntries(taxData.reliefEntries || []);
      setTaxCreditsData(taxData.taxCreditsData || {});
    }
  }, [taxData]);
  
 
  








  // console.log("Username:", username)
  // console.log("Name:", name)
  // console.log("Salon name:", salonName)
  // console.log("Tin number:", tinNumber)


  // console.log("Business income:", totalBusinessIncome);
  // console.log("Employee income:", totalEmployeeIncome);
  // console.log("Investment income:", totalInvestmentIncome);
  // console.log("Other income:", totalOtherIncome);
  // console.log("Foreign income:", totalForeignIncome);
  // console.log("Total Relief income:", totalRelief);
  // console.log("Qualifying payment income:", totalDonations);
  // console.log("assessable income:", assessableIncome);
  // console.log("Taxable income:", taxableIncome);
  // console.log("Taxable Payable:", balancePayable);

  const handleSubmitTaxForm = async () => {
    navigate("/taxreview", { state: { taxData: fullTaxFormData } });
  };


  return (
    <>
      <Navbar />
      <div className="bg-white px-4 py-6 md:p-8 rounded-lg shadow-md space-y-6 w-full min-h-screen bg-gray-100">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Income Tax Form</h2>
          <EmployeeIncome employeeIncomeSum={setTotalEmployeeIncome} setEmployeeIncomeEntries={setEmployeeIncomeEntries} />
        </div>

        <BusinessIncome businessIncomeSum={setTotalBusinessIncome} setBusinessIncomeEntries={setBusinessIncomeEntries} />
        <InvestmentIncome
          investmentIncomeSum={setTotalInvestmentIncome}
          whtCalculation={setWithHoldingTax}
          setInvestmentIncomeEntries={setInvestmentIncomeEntries}
          setCapitalGainincome={setCapitalGainIncome}
        />

        <OtherIncome otherIncomeSum={setTotalOtherIncome} setOtherIncomeEntries={setOtherIncomeEntries} />

        <ForeignIncome foriegnIncomeSum={setTotalForeignIncome} setForeignIncomeEntries={setForeignIncomeEntries} />



        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Assessable Income</label>
          <div className="flex items-center mt-1 border border-gray-300 rounded-md overflow-hidden">
            <label className="px-3 py-2 bg-gray-200 text-gray-700 font-medium">50</label>
            <div className="h-8 w-[1px] bg-gray-400"></div>
            <input
              type="text"
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 font-medium cursor-not-allowed focus:outline-none"
              readOnly
              value={`LKR ${assessableIncome.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
            />
          </div>
        </div>

        <QualifyingPayments totalDonationsSum={setTotalDonations} setQualifyingPaymentsEntries={setQualifyingPaymentsEntries} />

        <ReliefPayments reliefPaymentSum={setTotalRelief} setReliefEntries={setReliefEntries} />

        <TaxLiability taxableIncome={taxableIncome} setTaxLiable={setTotalTaxLiable} setTaxCreditsData={setTaxCreditsData} capitalGainincome={capitalGainIncome} />

        <div className="flex justify-center pt-4">
          <button
            type="button"
            className="bg-[#986611] text-white px-6 py-3 rounded-md hover:bg-[#684E12] transition text-lg font-semibold"
            onClick={handleSubmitTaxForm} // Make sure you define this function
          >
            Submit Tax Form
          </button>
        </div>
      </div>
    </>
  );
};

export default IncomeTaxForm;