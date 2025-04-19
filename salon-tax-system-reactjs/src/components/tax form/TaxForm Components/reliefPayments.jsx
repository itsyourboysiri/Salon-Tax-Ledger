import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const ReliefPayments = ({ reliefPaymentSum,setReliefEntries }) => {
  const [reliefs, setReliefs] = useState({
    personalRelief: 1800000, // static, readonly
    solarPanel: "",
    rentalIncome: "",
  });

  const [otherReliefIncomeData, setOtherReliefIncomeData] = useState([]);
  const [modalOpen, setModalOpen] = useState(null);
  const [otherReliefIncomeName, setOtherReliefIncomeName] = useState("");
  const [otherReliefIncome, setOtherReliefIncome] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [totalRelief, setTotalRelief] = useState(0);

  const [focusedField, setFocusedField] = useState(null);

  const formatCurrency = (value) => {
    const num = parseFloat(value.toString().replace(/,/g, ""));
    if (isNaN(num)) return "";
    return `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const handleInputChange = (e, field) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setReliefs((prev) => ({ ...prev, [field]: val }));
    }
  };


  const handleAddData = () => {
    if (!otherReliefIncomeName || !otherReliefIncome) return;

    const newEntry = {
      orid: editingId || Date.now(),
      otherReliefIncomeName,
      otherReliefIncome: parseFloat(otherReliefIncome),
    };

    setOtherReliefIncomeData((prev) => {
      const filtered = prev.filter((e) => e.orid !== newEntry.orid);
      return [...filtered, newEntry];
    });

    resetModal();
  };

  const handleEdit = (entry) => {
    setOtherReliefIncomeName(entry.otherReliefIncomeName);
    setOtherReliefIncome(entry.otherReliefIncome);
    setEditingId(entry.orid);
    setModalOpen("otherReliefModal");
  };

  const handleDelete = (id) => {
    setOtherReliefIncomeData((prev) => prev.filter((e) => e.orid !== id));
  };

  const resetModal = () => {
    setOtherReliefIncomeName("");
    setOtherReliefIncome("");
    setEditingId(null);
    setModalOpen(null);
  };
  // Load from sessionStorage on mount
useEffect(() => {
  const storedReliefs = sessionStorage.getItem("reliefFormFields");
  const storedOtherReliefs = sessionStorage.getItem("otherReliefTable");

  if (storedReliefs) {
    setReliefs(JSON.parse(storedReliefs));
  }

  if (storedOtherReliefs) {
    setOtherReliefIncomeData(JSON.parse(storedOtherReliefs));
  }
}, []);

// Save relief form fields when changed
useEffect(() => {
  sessionStorage.setItem("reliefFormFields", JSON.stringify(reliefs));
}, [reliefs]);

// Save other relief entries when changed
useEffect(() => {
  sessionStorage.setItem("otherReliefTable", JSON.stringify(otherReliefIncomeData));
}, [otherReliefIncomeData]);


  useEffect(() => {
    const fixedReliefsTotal =
      Number(reliefs.personalRelief) +
      Number(reliefs.solarPanel) +
      Number(reliefs.rentalIncome);

    const otherReliefsTotal = otherReliefIncomeData.reduce(
      (acc, curr) => acc + Number(curr.otherReliefIncome || 0),
      0
    );

    setTotalRelief(fixedReliefsTotal + otherReliefsTotal);
    reliefPaymentSum(fixedReliefsTotal + otherReliefsTotal)

    const compiledReliefs = [
      {
        reliefName: "Personal Relief",
        reliefAmount: Number(reliefs.personalRelief),
      },
      {
        reliefName: "Solar Panel Relief",
        reliefAmount: Number(reliefs.solarPanel || 0),
      },
      {
        reliefName: "Rental Income Relief",
        reliefAmount: Number(reliefs.rentalIncome || 0),
      },
      ...otherReliefIncomeData.map((entry) => ({
        reliefName: entry.otherReliefIncomeName,
        reliefAmount: entry.otherReliefIncome,
      })),
    ];
  
    setReliefEntries(compiledReliefs);
  }, [reliefs, otherReliefIncomeData]);

  return (
    <>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Reliefs</h2>

      {/* Fixed Reliefs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Relief */}
        <div className="flex flex-col mt-2">
          <label className="text-gray-700 font-medium">Personal Relief</label>
          <div className="flex items-center mt-1 border border-gray-300 rounded-md overflow-hidden bg-gray-200">
            <label className="px-3 py-2 bg-gray-300 text-gray-700 font-medium">70</label>
            <div className="h-8 w-[1px] bg-gray-400"></div>
            <input
              type="text"
              className="flex-1 px-3 py-2 text-gray-700 bg-gray-200 focus:outline-none"
              value={new Intl.NumberFormat("en-LK", {
                style: "currency",
                currency: "LKR",
                minimumFractionDigits: 2,
              }).format(reliefs.personalRelief)}
              
              readOnly
            />
          </div>
        </div>

        {/* Solar Panel Relief */}
        <div className="flex flex-col mt-2">
          <label className="text-gray-700 font-medium">Solar Panel Relief</label>
          <div className="flex items-center mt-1 border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-red-200">
            <label className="px-3 py-2 bg-gray-200 text-gray-700 font-medium">70</label>
            <div className="h-8 w-[1px] bg-gray-400"></div>
            <input
              type="text"
              className="flex-1 px-3 py-2 focus:outline-none"
              placeholder="Enter amount"
              value={focusedField === "solarPanel" ? reliefs.solarPanel : formatCurrency(reliefs.solarPanel)}
              onFocus={() => setFocusedField("solarPanel")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => handleInputChange(e, "solarPanel")}
            />
          </div>
        </div>

        {/* Rental Income Relief */}
        <div className="flex flex-col mt-4">
          <label className="text-gray-700 font-medium">Rental Income Relief</label>
          <div className="flex items-center mt-1 border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-red-200">
            <label className="px-3 py-2 bg-gray-200 text-gray-700 font-medium">70</label>
            <div className="h-8 w-[1px] bg-gray-400"></div>
            <input
              type="text"
              className="flex-1 px-3 py-2 focus:outline-none"
              placeholder="Enter amount"
              value={focusedField === "rentalIncome" ? reliefs.rentalIncome : formatCurrency(reliefs.rentalIncome)}
              onFocus={() => setFocusedField("rentalIncome")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => handleInputChange(e, "rentalIncome")}
            />
          </div>
        </div>
      </div>


      {/* Other Reliefs Table */}
      <div className="mt-6 max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className=" font-semibold text-gray-800">Other Reliefs</h2>
          <button
            className="px-4 py-2 bg-[#986611] hover:bg-[#684E12] text-white rounded-md shadow-sm transition"
            onClick={() => setModalOpen("otherReliefModal")}
          >
            + Add Entry
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm text-sm text-left text-gray-700">
            <thead className="bg-[#620F28] text-white text-base">
              <tr>
                <th className="p-3 border-r">ID</th>
                <th className="p-3 border-r">Name</th>
                <th className="p-3 border-r">Income</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {otherReliefIncomeData.length > 0 ? (
                otherReliefIncomeData.map((entry, index) => (
                  <tr
                    key={entry.orid}
                    className={"transition bg-gray-100 hover:bg-red-50 hover:bg-red-50"}
                  >
                    <td className="p-3 text-center border-r">{entry.orid}</td>
                    <td className="p-3 border-r">{entry.otherReliefIncomeName}</td>
                    <td className="p-3 border-r">
                      {new Intl.NumberFormat("en-LK", {
                        style: "currency",
                        currency: "LKR",
                      }).format(entry.otherReliefIncome)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.orid)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-12 bg-gray-100 text-center text-gray-400">
                  <td colSpan="4">No other reliefs added</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen === "otherReliefModal" && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-40 flex items-center justify-center z-50 transition duration-300 ease-in-out px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Other Relief Entry
            </h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none"
              value={otherReliefIncomeName}
              onChange={(e) => setOtherReliefIncomeName(e.target.value)}
            />

            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-4">
              <label className="px-3 py-2 bg-gray-200 text-gray-700 font-medium">
                70
              </label>
              <div className="h-8 w-[1px] bg-gray-400"></div>
              <input
                type="text"
                className="flex-1 px-3 py-2 focus:outline-none"
                placeholder="Income"
                value={otherReliefIncome}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) setOtherReliefIncome(val);
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={resetModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddData}
                className="px-4 py-2 bg-[#986611] text-white rounded  hover:bg-[#684E12] transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Total Relief */}
      <div className="mt-6">
        <label className="text-gray-700 font-semibold block mb-1">Total Relief</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
          value={new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
          }).format(totalRelief)}
          readOnly
        />
      </div>
    </>
  );
};

export default ReliefPayments;
