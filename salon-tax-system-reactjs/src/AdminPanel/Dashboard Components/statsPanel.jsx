import React from 'react';

export default function StatsPanel({ label, sublabel, value, change, positive, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <p className="text-sm text-gray-600">{label}</p>
      {sublabel && <p className="text-xs text-gray-400 mb-2">{sublabel}</p>}
      <p className="text-2xl font-semibold">{value}</p>
      <p className={`text-xs ${positive ? 'text-green-500' : 'text-red-500'}`}>
        {positive ? `+${change}` : `-${change}`} than last Week
      </p>
      {children && <div className="mt-2 text-sm text-gray-600">{children}</div>}
    </div>
  );
}
