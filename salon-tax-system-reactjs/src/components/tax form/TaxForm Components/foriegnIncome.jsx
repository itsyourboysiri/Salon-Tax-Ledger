import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const ForeignIncome = ({ foriegnIncomeSum, setForeignIncomeEntries }) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [totalForeignIncome, setTotalForeignIncome] = useState(0);

  // ✅ Load session data once on mount
  useEffect(() => {
    const storedData = sessionStorage.getItem("foreignIncomeData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (parsed.length > 0) {
        setData(parsed);
      }
    }
  }, []);

  // ✅ Calculate total and sync session on changes
  useEffect(() => {
    const total = data.reduce((acc, curr) => acc + (parseFloat(curr.foriegnIncome) || 0), 0);
    setTotalForeignIncome(total);
    foriegnIncomeSum(total);

    const filtered = data.map(({ foriegnIncomeName, foriegnIncome }) => ({
      foriegnIncomeName,
      foriegnIncome,
    }));
    setForeignIncomeEntries(filtered);

    sessionStorage.setItem("foreignIncomeData", JSON.stringify(data));
  }, [data]);

  const resetForm = () => {
    setName("");
    setIncome("");
    setEditingId(null);
    setModalOpen(false);
  };

  const handleSubmit = () => {
    if (!name || !income) return;
    const entry = {
      fid: editingId || Date.now(),
      foriegnIncomeName: name,
      foriegnIncome: parseFloat(income),
    };

    setData((prev) => {
      const filtered = prev.filter((e) => e.fid !== entry.fid);
      return [...filtered, entry];
    });

    resetForm();
  };

  const handleEdit = (entry) => {
    setName(entry.foriegnIncomeName);
    setIncome(entry.foriegnIncome);
    setEditingId(entry.fid);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((e) => e.fid !== id));
  };

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 text-xl font-semibold">Foreign Income</h2>
        <button
          type="button"
          className="px-4 py-2 bg-[#986611] hover:bg-[#684E12] transition text-white rounded-md shadow-sm"
          onClick={() => setModalOpen(true)}
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
            {data.length > 0 ? (
              data.map((entry) => (
                <tr
                  key={entry.fid}
                  className="transition bg-gray-100 hover:bg-red-50"
                >
                  <td className="p-3 text-center border-r">{entry.fid}</td>
                  <td className="p-3 border-r">{entry.foriegnIncomeName}</td>
                  <td className="p-3 border-r">
                    {new Intl.NumberFormat("en-LK", {
                      style: "currency",
                      currency: "LKR",
                    }).format(entry.foriegnIncome)}
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
                        onClick={() => handleDelete(entry.fid)}
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
                <td colSpan="4">No foreign income added</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 transition duration-300 ease-in-out px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Foreign Income Entry
            </h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-4">
              <label className="px-3 py-2 bg-gray-200 text-gray-700 font-medium">40A</label>
              <div className="h-8 w-[1px] bg-gray-400"></div>
              <input
                type="text"
                className="flex-1 px-3 py-2 focus:outline-none"
                placeholder="Income"
                value={income}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) setIncome(val);
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#986611] text-white rounded hover:bg-[#684E12] transition"
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

export default ForeignIncome;
