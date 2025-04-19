import React, { useState, useEffect } from "react";

const InvestmentIncome = ({ investmentIncomeSum, whtCalculation,setInvestmentIncomeEntries,setCapitalGainincome }) => {
  const [rentIncome, setRentIncome] = useState("");
  const [interestIncome, setInterestIncome] = useState("");
  const [dividendsIncome, setDividendsIncome] = useState("");
  const [annuitiesIncome, setAnnuitiesIncome] = useState("");
  const [royaltiesIncome, setRoyaltiesIncome] = useState("");
  const [capitalGainIncome, setCapitalGainIncome] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [hydrated, setHydrated] = useState(false);


  const formatCurrency = (value) => {
    const num = parseFloat(value.toString().replace(/,/g, ""));
    if (isNaN(num)) return "";
    return `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("investmentIncomeData");
    // console.log("Investment session data:",stored)
    if (stored) {
      const parsed = JSON.parse(stored);
      setRentIncome(parsed?.Rent ?? "");
    setInterestIncome(parsed?.Interest ?? "");
    setDividendsIncome(parsed?.Dividends ?? "");
    setAnnuitiesIncome(parsed?.Annuities ?? "");
    setRoyaltiesIncome(parsed?.Royalties ?? "");
    setCapitalGainIncome(parsed?.CapitalGain ?? "");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const total =
      Number(rentIncome) +
      Number(interestIncome) +
      Number(dividendsIncome) +
      Number(annuitiesIncome) +
      Number(royaltiesIncome) +
      Number(capitalGainIncome);

    investmentIncomeSum(total); // Pass value to parent

    const whtCalc = (interestIncome * 5) / 100; // With holding tax calculation
    const whtRent = (Number(rentIncome) * 10) / 100; // Up to 14.07.2023
    const whtDividends = (Number(dividendsIncome) * 14) / 100;
    const totalWHT = whtCalc + whtRent + whtDividends;
    whtCalculation(totalWHT);

    setInvestmentIncomeEntries({
      Rent: Number(rentIncome),
      Interest: Number(interestIncome),
      Dividends: Number(dividendsIncome),
      Annuities: Number(annuitiesIncome),
      Royalties: Number(royaltiesIncome),
      CapitalGain: Number(capitalGainIncome),
    });
    if (setCapitalGainincome) {
      setCapitalGainincome(Number(capitalGainIncome));
    }
    const investmentData = {
      Rent: rentIncome || "",
      Interest: interestIncome || "",
      Dividends: dividendsIncome || "",
      Annuities: annuitiesIncome || "",
      Royalties: royaltiesIncome || "",
      CapitalGain: capitalGainIncome || "",
    };
    sessionStorage.setItem("investmentIncomeData", JSON.stringify(investmentData));
    

  }, [
    hydrated,
    rentIncome,
    interestIncome,
    dividendsIncome,
    annuitiesIncome,
    royaltiesIncome,
    capitalGainIncome,
    investmentIncomeSum,
    whtCalculation,
  ]);

  const renderField = (label, value, setter, fieldKey, placeholder) => (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium">{label}</label>
      <div className="flex items-center mt-1 border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-red-200 transition">
        <span className="px-3 py-2 bg-gray-100 text-gray-700 font-semibold w-14 text-center">30</span>
        <div className="h-8 w-[1px] bg-gray-400"></div>
        <input
          type="text"
          className="flex-1 px-3 py-2 text-gray-800 focus:outline-none"
          placeholder={placeholder}
          value={focusedField === fieldKey ? value : formatCurrency(value)}
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => handleInputChange(e, setter)}
        />
      </div>
    </div>
  );

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Income</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField("Rent", rentIncome, setRentIncome, "rent", "Enter your rent")}
        {renderField("Interest", interestIncome, setInterestIncome, "interest", "Enter your interests")}
        {renderField("Dividends", dividendsIncome, setDividendsIncome, "dividends", "Enter your dividends")}
        {renderField("Annuities", annuitiesIncome, setAnnuitiesIncome, "annuities", "Enter your annuities")}
        {renderField("Royalties", royaltiesIncome, setRoyaltiesIncome, "royalties", "Enter your royalties")}
        {renderField("Capital Gain", capitalGainIncome, setCapitalGainIncome, "capital", "Enter capital gain")}
      </div>
    </>
  );
};

export default InvestmentIncome;
