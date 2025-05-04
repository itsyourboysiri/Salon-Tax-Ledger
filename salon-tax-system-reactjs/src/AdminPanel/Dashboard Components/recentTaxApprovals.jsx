import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function LatestTaxApprovals() {
  const [currentPage, setCurrentPage] = useState(1);

  const submissions = [
    {
      id: 1,
      tin: 'TIN123456',
      name: 'Hansaja Pathan',
      salon: 'Rawula',
      submittedAt: '2025-03-10',
      taxYear: '2024/2025',
      status: 'Pending'
    },
    {
      id: 2,
      tin: 'TIN987654',
      name: 'Nisansala Madushani',
      salon: 'Golden Touch',
      submittedAt: '2025-03-05',
      taxYear: '2024/2025',
      status: 'Confirmed'
    },
    {
      id: 3,
      tin: 'TIN456789',
      name: 'Dulakshi Kumari',
      salon: 'Beauty Bliss',
      submittedAt: '2025-02-28',
      taxYear: '2024/2025',
      status: 'Declined'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-green-500 bg-green-50 border-green-100';
      case 'Pending': return 'text-yellow-500 bg-yellow-50 border-yellow-100';
      case 'Declined': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="p-6 bg-red-50 border border-red-100 rounded-xl shadow-md mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-red-700">Latest Tax Submissions</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, TIN..."
            className="px-4 py-2 pl-10 border border-yellow-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-600 text-sm bg-yellow-50">
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Salon</th>
              <th className="py-3 px-4 font-medium">TIN</th>
              <th className="py-3 px-4 font-medium">Tax Year</th>
              <th className="py-3 px-4 font-medium">Submitted At</th>
              <th className="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((file) => (
              <tr key={file.id} className="border-t border-red-100 hover:bg-red-50 transition">
                <td className="py-3 px-4">{file.name}</td>
                <td className="py-3 px-4">{file.salon}</td>
                <td className="py-3 px-4 text-gray-600">{file.tin}</td>
                <td className="py-3 px-4">{file.taxYear}</td>
                <td className="py-3 px-4 text-gray-500">{file.submittedAt}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                    {file.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button className="flex items-center text-sm text-gray-500 px-4 py-2 border rounded-lg hover:bg-red-100">
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </button>
        <div className="flex">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-sm mx-1 shadow">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-red-600 hover:bg-red-100 text-sm mx-1">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-red-600 hover:bg-red-100 text-sm mx-1">3</button>
        </div>
        <button className="flex items-center text-sm text-gray-500 px-4 py-2 border rounded-lg hover:bg-red-100">
          Next
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
