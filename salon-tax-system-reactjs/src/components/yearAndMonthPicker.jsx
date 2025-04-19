import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const CustomYearMonthPicker = ({ onSelect, defaultValue }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const ref = useRef();

  // Set default date from parent (e.g. current month)
  useEffect(() => {
    if (defaultValue) {
      const parts = defaultValue.split("-");
      const initial = new Date(parts[0], parts[1] - 1); // YYYY-MM
      setSelectedDate(initial);
      onSelect(defaultValue); // sync to parent
    }
  }, [defaultValue]);

  // Handle selection from calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    onSelect(formatted); // pass to parent for filtering
  };

  // Format display text inside box
  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="relative inline-block w-72">
      {/* Hidden actual datepicker input */}
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        ref={ref}
        customInput={<></>}
        popperPlacement="top-start"
        className="hidden"
      />

      {/* Custom styled box to trigger calendar */}
      <div
        onClick={() => ref.current.setOpen(true)}
        className="cursor-pointer bg-white border border-gray-300 hover:border-[#986611] px-4 py-3 rounded-lg text-sm shadow-md flex justify-between items-center transition duration-300 group"
      >
        <span className={`font-medium ${selectedDate ? "text-gray-800" : "text-gray-400"}`}>
          {selectedDate ? formatMonthYear(selectedDate) : "Select month and year"}
        </span>
        <CalendarDays
          size={20}
          className="text-[#986611] group-hover:scale-105 transition-transform duration-200"
        />
      </div>
    </div>
  );
};

export default CustomYearMonthPicker;
