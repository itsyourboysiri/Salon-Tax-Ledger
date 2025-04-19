import { useState } from "react";

const TaxForm = () => {
  const [formData, setFormData] = useState({
    tinNumber: "",
    nic: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className=" max-w-md mx-auto  bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-center text-xl font-semibold mb-4">Calculate Your Tax</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TIN Number Input */}
        <div>
          <label className="block font-medium mb-1">TIN Number</label>
          <input
            type="text"
            name="tinNumber"
            placeholder="Enter TIN Number"
            value={formData.tinNumber}
            onChange={handleChange}
            className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* NIC Input */}
        <div>
          <label className="block font-medium mb-1">NIC</label>
          <input
            type="text"
            name="nic"
            placeholder="Enter NIC"
            value={formData.nic}
            onChange={handleChange}
            className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#620F28] text-white py-2 rounded-full font-semibold hover:opacity-90"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TaxForm;
