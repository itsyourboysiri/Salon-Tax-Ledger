import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/navbar';
import QuarterlyPayment from '../Payments/quaterlyPayment';
import { alert } from '../components/AlertBoxes/alertBox';



const formatCurrency = (val) =>
    `LKR ${parseFloat(val || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
    })}`;

const renderTable = (title, data, keyName, valueName) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#41091B] text-white">
                <tr>
                    <th className="p-2 border border-gray-300">Name</th>
                    <th className="p-2 border border-gray-300">Amount</th>
                </tr>
            </thead>
            <tbody>
                {data?.length > 0 ? (
                    data.map((item, idx) => (
                        <tr key={idx}>
                            <td className="p-2 border border-gray-300">{item[keyName]}</td>
                            <td className="p-2 border border-gray-300">{formatCurrency(item[valueName])}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td className="p-2 border border-gray-300 italic text-gray-500" colSpan={2}>
                            No data available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);


const IncomeTaxReview = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const data = state?.taxData;
    const [submitting, setSubmitting] = useState(false);
    const quarterlyAmount = data.quarterlyInstallment;
    console.log("Quaterly payment:", quarterlyAmount)



    const donationLabels = {
        charity: "Donate to approved Charity (The lower of 1/3 of the taxable income or 75,000/=) (Entity 1/5 or 500,000/=)",
        government: "Donations to Government or other specified institutions",
        fund: "Any sum paid to the Consolidated Fund or President’s fund",
        expenditure: "Expenditure incurred by any person",
        film: "In the production of a film at a cost not less than five million rupees",
        newCinema: "Construction and equipping of a new cinema (up to Rs. 25 million)",
        upgradeCinema: "Upgrading of a cinema (up to Rs. 10 million)",
        shopContribution: "Contribution to establish a shop for a Samurdhi beneficiary",
        financialInstitution: "Expenditure by a financial institution (confirmed by CBSL)"
    };


    const handleFinalSubmit = async () => {
        const name = sessionStorage.getItem("name")
        const username = sessionStorage.getItem("username")
        const tinNumber = sessionStorage.getItem("tinNumber")
        const salonName = sessionStorage.getItem("salonName")
        const email = sessionStorage.getItem("email")

       
        try {
            setSubmitting(true);
            const response = await fetch("http://localhost:5000/api/users/insertTaxform", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert.success("Tax form submitted successfully!");

                console.log("Backend response:", result);

                
                navigate("/taxview");
            } else {
                alert.error("Submission failed. Try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert.error("Server error occurred while submitting the form.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!data) return <div className="p-6 text-center text-red-500">No tax data found</div>;

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto p-6 bg-white shadow-2xl rounded-md space-y-6 mt-4">
                <h2 className="text-2xl font-bold text-gray-800">Income Tax Review</h2>

                {/* Income Tables */}
                {renderTable("Employment Income", data.employeeIncomeEntries, "empIncomeName", "empIncome")}
                {renderTable("Business Income", data.businessIncomeEntries, "businessIncomeName", "businessIncome")}
                {renderTable("Other Income", data.otherIncomeEntries, "otherIncomeName", "otherIncome")}
                {renderTable("Foreign Income", data.foreignIncomeEntries, "foriegnIncomeName", "foriegnIncome")}

                {/* Investment Income */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Investment Income</h3>
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-[#41091B] text-white">
                            <tr>
                                <th className="p-2 border border-gray-300">Type</th>
                                <th className="p-2 border border-gray-300">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data.investmentIncomeEntries || {}).map(([key, val], idx) => (
                                <tr key={idx}>
                                    <td className="p-2 border border-gray-300 capitalize">{key}</td>
                                    <td className="p-2 border border-gray-300">{formatCurrency(val)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>


                {/* Qualifying Payments */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Deductible on Qualifying Payments</h3>
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-[#41091B] text-white">
                            <tr>
                                <th className="p-2 border border-gray-300">Donation Type</th>
                                <th className="p-2 border border-gray-300">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.qualifyingPaymentsEntries?.map((payment, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 border border-gray-300">{donationLabels[payment.donationType] || "Unnamed Donation"}</td>
                                    <td className="p-2 border border-gray-300">{formatCurrency(payment.donationAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>


                {/* Reliefs */}
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-[#41091B] text-white">
                        <tr>
                            <th className="p-2 border border-gray-300">Relief Type</th>
                            <th className="p-2 border border-gray-300">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.reliefEntries?.map((relief, idx) => (
                            <tr key={idx}>
                                <td className="p-2 border border-gray-300">{relief.reliefName || "Unnamed Relief"}</td>
                                <td className="p-2 border border-gray-300">{formatCurrency(relief.reliefAmount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                {quarterlyAmount && (
                    <QuarterlyPayment quarterlyAmount={quarterlyAmount} />
                )}


                {/* Summary */}
                <div className="mt-6 p-4 bg-[#FFF8E1] border border-[#986611] rounded-md shadow-sm">
                    <h4 className="text-lg font-semibold text-[#684E12] mb-3">Summary</h4>

                    <div className="grid grid-cols-2 gap-y-3 text-sm text-[#583617]">
                        <div className="flex">
                            <span className="w-44 font-semibold">Assessable Income:</span>
                            <span>{formatCurrency(data.assessableIncome)}</span>
                        </div>
                        <div className="flex gap-x-2 justify-end">
                            <span className="w-44 text-right font-semibold">Total Tax Liability:</span>
                            <span>{formatCurrency(data.totalTaxLiable)}</span>
                        </div>

                        <div className="flex">
                            <span className="w-44 font-semibold">Total Deductions:</span>
                            <span>{formatCurrency(data.totalDeductions)}</span>
                        </div>
                        <div className="flex gap-x-2 justify-end">
                            <span className="w-44 text-right font-semibold">WHT:</span>
                            <span>{formatCurrency(data.withHoldingTax)}</span>
                        </div>

                        <div className="flex">
                            <span className="w-44 font-semibold">Taxable Income:</span>
                            <span>{formatCurrency(data.taxableIncome)}</span>
                        </div>
                       
                    </div>

                    <div className="mt-6 text-center text-[#620F28] text-base">
                        <p className="font-semibold text-lg">
                            <strong>Tax Payable:</strong> {formatCurrency(data.balancePayable)}
                        </p>
                    </div>
                </div>



                {/* Buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/taxform", { state: { taxData: data } })}
                        className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition"
                    >
                        Edit Form
                    </button>

                    <button
                        onClick={handleFinalSubmit}
                        disabled={submitting}
                        className="bg-[#620F28] text-white px-6 py-2 rounded hover:bg-[#41091B] transition"
                    >
                        {submitting ? "Submitting..." : "Submit Tax Form"}
                    </button>
                </div>
            </div>
        </>

    );
};

export default IncomeTaxReview;
