import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function LatestTaxApprovals() {
  const [currentPage, setCurrentPage] = useState(1);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTaxSubmissions();
  }, []);

  useEffect(() => {
    // Filter submissions whenever searchTerm changes
    if (searchTerm.trim() === '') {
      setFilteredSubmissions(submissions);
    } else {
      const filtered = submissions.filter(submission => 
        submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.tinNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubmissions(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, submissions]);

  const fetchTaxSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/admin/tax-submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch tax submissions');
      }

      const data = await response.json();
      // Sort by most recent first and limit to 10
      const sortedSubmissions = data.sort((a, b) => 
        new Date(b.createdAt || b.submissionDate) - new Date(a.createdAt || a.submissionDate)
      ).slice(0, 10);
      
      setSubmissions(sortedSubmissions);
      setFilteredSubmissions(sortedSubmissions);
    } catch (err) {
      console.error('Error fetching tax submissions:', err);
      setError('Failed to load tax submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'unknown';
    const statusMap = {
      'confirmed': 'text-green-500 bg-green-50 border-green-100',
      'approved': 'text-green-500 bg-green-50 border-green-100',
      'pending': 'text-yellow-500 bg-yellow-50 border-yellow-100',
      'declined': 'text-red-500 bg-red-50 border-red-100',
      'submitted': 'text-blue-500 bg-blue-50 border-blue-100',
      'processing': 'text-purple-500 bg-purple-50 border-purple-100'
    };
    
    return statusMap[statusLower] || 'text-gray-500 bg-gray-50 border-gray-100';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'approved':
        return <CheckCircle size={16} className="text-green-600 mr-1" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600 mr-1" />;
      case 'declined':
        return <AlertCircle size={16} className="text-red-600 mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-6 w-1/3"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-xl shadow-md mb-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchTaxSubmissions}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mb-6"  >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-[#41091B]">Latest Tax Submissions</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, TIN..."
            className="px-4 py-2 pl-10 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full" >
          <thead>
            <tr className="text-left text-gray-600 text-sm bg-gray-50">
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Salon</th>
              <th className="py-3 px-4 font-medium">TIN Number</th>
              <th className="py-3 px-4 font-medium">Submitted At</th>
              <th className="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSubmissions.length > 0 ? (
              paginatedSubmissions.map((submission) => (
                <tr key={submission._id || submission.id} className="border-t border-gray-100 hover:bg-[#f8f0e7] transition">
                  <td className="py-3 px-4">{submission.name || 'N/A'}</td>
                  <td className="py-3 px-4">{submission.salonName || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-600">{submission.tinNumber || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(submission.createdAt || submission.submissionDate)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getStatusIcon(submission.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                        {submission.status || 'Unknown'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No matching submissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredSubmissions.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button 
            className="flex items-center text-sm text-gray-500 px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            <ArrowLeft size={16} className="mr-2" />
            Previous
          </button>
          <div className="flex">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm mx-1 ${
                  currentPage === page 
                    ? 'bg-yellow-500 text-white shadow' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            className="flex items-center text-sm text-gray-500 px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}