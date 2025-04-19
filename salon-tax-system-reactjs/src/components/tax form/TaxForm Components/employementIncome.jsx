import { useState,useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const EmployeeIncome = ({employeeIncomeSum,setEmployeeIncomeEntries}) => {
  const [empIncomeData, setEmpIncomeData] = useState([]);
  const [empIncomeName, setEmpIncomeName] = useState("");
  const [empIncome, setEmpIncome] = useState("");
  const [modalOpen, setModalOpen] = useState(null);

  const [editingEid, setEditingEid] = useState(null);


  useEffect(() => {
    const storedData = sessionStorage.getItem("employeeIncomeData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      // Only update state if there's a difference
      if (parsed.length > 0) {
        setEmpIncomeData(parsed);
      }
    }
  }, []);
  
  // Update parent and sessionStorage on data change
  useEffect(() => {
    const total = empIncomeData.reduce(
      (acc, curr) => acc + (parseFloat(curr.empIncome) || 0),
      0
    );
  
    employeeIncomeSum(total); // Update total in parent
  
    const empIncomedata = empIncomeData.map(({ empIncomeName, empIncome }) => ({
      empIncomeName,
      empIncome,
    }));
    setEmployeeIncomeEntries(empIncomedata); // Pass entries to parent
  
    sessionStorage.setItem("employeeIncomeData", JSON.stringify(empIncomeData)); // Save to session
  }, [empIncomeData]);
  

  const handleAddData = () => {
    if (!empIncomeName || !empIncome) return;
  
    if (editingEid) {
      setEmpIncomeData((prev) =>
        prev.map((e) =>
          e.eid === editingEid ? { ...e, empIncomeName, empIncome: parseFloat(empIncome) } : e
        )
      );
    } else {
      setEmpIncomeData((prev) => [
        ...prev,
        {
          eid: Date.now(),
          empIncomeName,
          empIncome: parseFloat(empIncome),
        },
      ]);
    }
  
    setEmpIncomeName("");
    setEmpIncome("");
    setEditingEid(null);
    setModalOpen(null);
  };

  const handleEdit = (type, entry) => {
    setEmpIncomeName(entry.empIncomeName);
    setEmpIncome(entry.empIncome);
    setEditingEid(entry.eid); // Store the eid of the record being edited
    setModalOpen("employmentIncomeModal");
  };

  const handleDelete = (type, id) => {
    setEmpIncomeData((prev) => prev.filter((e) => e.eid !== id));
  };

  return (
    <div className="max-w-5xl ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 text-xl font-semibold">
          Employment Income (Primary + Secondary)
        </h2>
        <button
          type="button"
          className="px-4 py-2 bg-[#986611] hover:bg-[#684E12] transition text-white rounded-md shadow-sm"
          onClick={() => setModalOpen("employmentIncomeModal")}
        >
          + Add Entry
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-[#620F28] text-white text-base">
            <tr>
              <th className="p-3 border-r">ID</th>
              <th className="p-3 border-r">Name</th>
              <th className="p-3 border-r">Income</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-base text-gray-700">
            {empIncomeData.length > 0 ? (
              empIncomeData.map((entry, index) => (
                <tr
                  key={entry.eid}
                  className={"transition bg-gray-100 hover:bg-red-50 hover:bg-red-50"}
                >
                  <td className="p-3 text-center border-r">{entry.eid}</td>
                  <td className="p-3 border-r">{entry.empIncomeName}</td>
                  <td className="p-3 border-r">
                    {entry.empIncome
                      ? new Intl.NumberFormat("en-LK", {
                          style: "currency",
                          currency: "LKR",
                        }).format(entry.empIncome)
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => handleEdit("employmentIncome", entry)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete("employmentIncome", entry.eid)
                        }
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
                <td colSpan="4">No employment income added</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen === "employmentIncomeModal" && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-40 flex items-center justify-center z-50 transition duration-300 ease-in-out">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Employment Income Entry
            </h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md  focus:outline-none"
              value={empIncomeName}
              onChange={(e) => setEmpIncomeName(e.target.value)}
            />

            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-4">
              <label className="px-3 py-2 bg-gray-200 text-gray-700 font-medium">
                10
              </label>
              <div className="h-8 w-[1px] bg-gray-400"></div>
              <input
                type="text"
                className="flex-1 px-3 py-2 focus:outline-none"
                placeholder="Income"
                value={empIncome}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) {
                    setEmpIncome(val);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                onClick={() => {
                  setEmpIncomeName("");
                  setEmpIncome("");
                  setModalOpen(null);
                  setEditingEid(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#986611] text-white rounded  hover:bg-[#684E12] transition"
                onClick={handleAddData}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeIncome;
