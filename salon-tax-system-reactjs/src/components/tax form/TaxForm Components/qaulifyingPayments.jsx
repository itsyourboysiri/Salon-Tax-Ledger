import React, { useState,useEffect } from "react";

const QualifyingPayments = ({totalDonationsSum,setQualifyingPaymentsEntries}) => {
  const [donations, setDonations] = useState({
    charity: "",
    government: "",
    fund: "",
    expenditure: "",
    film: "",
    newCinema: "",
    upgradeCinema: "",
    shopContribution: "",
    financialInstitution: ""
  });
  const [focusedField, setFocusedField] = useState(null);
  const [hydrated, setHydrated] = useState(false);


  const formatCurrency = (value) => {
    const num = parseFloat(value.toString().replace(/,/g, ""));
    if (isNaN(num)) return "";
    return `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const renderInput = (fieldKey, placeholder) => (
    <input
      type="text"
      className="flex-1 px-3 py-2 focus:outline-none"
      placeholder={placeholder}
      value={
        focusedField === fieldKey ? donations[fieldKey] : formatCurrency(donations[fieldKey])
      }
      onFocus={() => setFocusedField(fieldKey)}
      onBlur={() => setFocusedField(null)}
      onChange={(e) => handleInputChange(e, fieldKey)}
    />
  );



  const handleInputChange = (e, key) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      if (donations.hasOwnProperty(key)) {
        setDonations((prev) => ({
          ...prev,
          [key]: value
        }));
      } else if (reliefs.hasOwnProperty(key)) {
        setReliefs((prev) => ({
          ...prev,
          [key]: value
        }));
      }
    }
  };
  useEffect(() => {
    const stored = sessionStorage.getItem("qualifyingPaymentsData");
    console.log("qualifying payment session data:",stored)
    if (stored) {
      const parsed = JSON.parse(stored);
      setDonations(parsed);
    }
    setHydrated(true); // Mark as loaded
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem("qualifyingPaymentsData", JSON.stringify(donations));
  }, [donations,hydrated]);
 
  useEffect(() => {
    const total = Object.values(donations).reduce((sum, val) => sum + Number(val || 0), 0);
    totalDonationsSum(total); // send the total up to the parent

    const filteredEntries = Object.entries(donations)
    .filter(([_, val]) => val) // only send non-empty entries
    .map(([key, val]) => ({
      donationType: key,
      donationAmount: parseFloat(val),
    }));

  setQualifyingPaymentsEntries(filteredEntries);
  }, [donations]);

  return (
    <div >
    <h1 className="text-gray-700 text-xl font-semibold mb-2 mt-6">Deductible on Qualifying Payments and Reliefs</h1>
    <h2 className="text-gray-700 font-bold mb-4">Qualifying payments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: "charity",
            label:
              "Donate to approved Charity (The lower of 1/3 of the taxable income or 75000/=) (Entity 1/5 or 500,000/=)",
            placeholder: "Enter your donations to charity",
          },
          {
            key: "government",
            label: "Donations to Government or other specified institutions",
            placeholder: "Enter your government donations",
          },
          {
            key: "fund",
            label: "Any sum paid to the Consolidated Fund or President’s fund",
            placeholder: "Enter your payment to fund",
          },
          {
            key: "expenditure",
            label: "Expenditure incurred by any person",
            placeholder: "Enter your expenditure",
          },
          {
            key: "film",
            label:
              "In the production of a film at a cost not less than five million rupees",
            placeholder: "Enter your film budget",
          },
          {
            key: "newCinema",
            label:
              "In the construction and equipping of a new cinema at a cost of not exceeding twenty-five million rupees",
            placeholder: "Enter your budget",
          },
          {
            key: "upgradeCinema",
            label:
              "In the upgrading of a cinema at a cost of not exceeding ten million Rupees",
            placeholder: "Enter your reinforcement budget",
          },
          {
            key: "shopContribution",
            label:
              "Contribution made by a resident individual to establish a shop for a female individual who is from Samurdhi beneficiary family",
            placeholder: "Enter your contributions",
          },
          {
            key: "financialInstitution",
            label:
              "Expenditure incurred by any financial institution... (as confirmed by the Central Bank of Sri Lanka)",
            placeholder: "Enter your amount",
          },
        ].map((item) => (
          <div className="flex flex-col" key={item.key}>
            <label className="text-gray-700 text-sm sm:text-base md:text-[15px] font-medium leading-snug text-justify">
              {item.label}
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-red-200">
              <label className="px-3 py-2 bg-gray-200 text-gray-700 font-medium">60</label>
              <div className="h-8 w-[1px] bg-gray-400"></div>
              {renderInput(item.key, item.placeholder)}
            </div>
          </div>
        ))}

       
      </div>
    </div>
  );
};

export default QualifyingPayments;
