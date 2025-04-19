import React, { useEffect, useState } from 'react';

const TaxLiability = ({ taxableIncome, setTaxLiable,setTaxCreditsData,capitalGainincome }) => {
  const [foreignTaxCredits, setForeignTaxCredits] = useState('');
  const [totalTaxLiable, setTotalTaxLiable] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  const calculateSlabTax = (taxableIncome) => {
    const slabs = [
      { limit: 999996, rate: 0.06 },
      { limit: 499992, rate: 0.18 },
      { limit: 499992, rate: 0.24 },
      { limit: 499992, rate: 0.30 },
      { limit: 799992, rate: 0.36 },
      { limit: Infinity, rate: 0.36 }
    ];

    let remainingIncome = taxableIncome;
    let totalTax = 0;

    for (let slab of slabs) {
      const incomeInThisSlab = Math.min(remainingIncome, slab.limit);
      const taxForSlab = incomeInThisSlab * slab.rate;
      totalTax += taxForSlab;
      remainingIncome -= incomeInThisSlab;
      if (remainingIncome <= 0) break;
    }

    return totalTax;
  };

  useEffect(() => {
    const parsedForeign = parseFloat(foreignTaxCredits) || 0;
    const parsedCGT = capitalGainincome * 0.10;
    const slabTax = calculateSlabTax(taxableIncome);
    console.log("Slab Tax:",slabTax)
    const finalTax = Math.max(slabTax - parsedForeign, 0) + parsedCGT;
    console.log("Final Tax:",finalTax)

    setTotalTaxLiable(finalTax);
    setTaxLiable(finalTax);

    setTaxCreditsData({
      foreignTaxCredits: parsedForeign,
      capitalGainsTax: parsedCGT
    });
  }, [taxableIncome, foreignTaxCredits, capitalGainincome, setTaxLiable]);

  const formatCurrency = (value) => {
    const num = parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';
    return `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const handleNumericInput = (e, setter) => {
    const input = e.target.value;
    const numericOnly = input.replace(/[^0-9.]/g, '');
    setter(numericOnly);
  };

  return (
    <>
      {/* Foreign Tax Credits */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Foreign Tax Credits</label>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-red-200">
          <span className="px-3 py-2 bg-gray-100 text-gray-700 font-semibold w-14 text-center">61</span>
          <div className="h-8 w-[1px] bg-gray-400"></div>
          <input
            type="text"
            className="flex-1 px-3 py-2 text-gray-800 focus:outline-none"
            placeholder="Enter foreign tax credits"
            value={focusedField === 'foreignTaxCredits' ? foreignTaxCredits : formatCurrency(foreignTaxCredits)}
            onFocus={() => setFocusedField('foreignTaxCredits')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => handleNumericInput(e, setForeignTaxCredits)}
          />
        </div>
      </div>

     <div className="bg-white   ">
      <h2 className="text-xl font-semibold text-gray-800">Tax Summary</h2>

     

      {/* Final Tax Payable */}
      <div className="mt-6 bg-red-100  rounded-lg p-4 text-center">
        <p className="text-xl font-semibold text-gray-700">
           Total Tax Payable:
        </p>
        <p className="text-2xl font-bold text-red-600 mt-1">
          {totalTaxLiable.toLocaleString(undefined, { minimumFractionDigits: 2 })} LKR
        </p>
      </div>
    </div>
    </>
   
   
  );
};

export default TaxLiability;