import { useEffect, useState } from 'react';
import { Search, Eye, CheckCircle2, XCircle } from 'lucide-react';
import TopAndSideBar from './Dashboard Components/sideBar';
import TaxDetailsModal from './Dashboard Components/taxDetailsModel';
import { alert } from '../components/AlertBoxes/alertBox';

export default function TaxInformation() {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaxData, setSelectedTaxData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const[adminUsername,setUsername] = useState('')



  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession') ;
    const adminUsernameData = JSON.parse(adminSession);
    const adminUsername = adminUsernameData?.admin?.username || '';
    setUsername(adminUsername);
    setIsLoading(true);
    fetch('http://localhost:5000/api/admin/tax-submissions')
      .then((res) => res.json())
      .then((data) => {
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          : [];
        setEntries(sortedData);
      })
      .catch((err) => {
        console.error('Error fetching tax submissions:', err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleViewClick = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/fetch-taxsubmission/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to fetch tax data');
      setSelectedTaxData(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to load tax submission:', err);
    }
  };

  const handleConfirmClick = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/confirm-taxsubmission/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Add headers
        },
        body: JSON.stringify({
          sendNotification: true,
          notificationMessage: 'Your tax submission has been approved. You can now proceed with payment.',
          adminUsername
        })
      });
  
      if (!res.ok) throw new Error('Failed to confirm submission');
  
      const updatedEntries = entries.map((entry) =>
        entry._id === id ? { ...entry, status: 'confirmed' } : entry
      );
      setEntries(updatedEntries);
  
      alert.success('Submission confirmed. User has been notified.');
    } catch (err) {
      console.error('Error confirming submission:', err);
      alert.error('Failed to confirm submission.');
    }
  };
  
  const handleDeclineClick = async (id) => {
    try {
      const declineReason = prompt('Please enter the reason for declining this submission:');
      if (!declineReason) return; // Exit if no reason provided
  
      const res = await fetch(`http://localhost:5000/api/admin/decline-taxsubmission/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sendNotification: true,
          notificationMessage: `Your tax submission has been declined. Reason: ${declineReason}`,
          declineReason,
          adminUsername
        })
      });
  
      if (!res.ok) throw new Error('Failed to decline submission');
  
      const updatedEntries = entries.map((entry) =>
        entry._id === id ? { ...entry, status: 'declined' } : entry
      );
      setEntries(updatedEntries);
  
      alert.success('Submission declined. User has been notified.');
    } catch (err) {
      alert.error('Failed to decline submission.');
    }
  };

  const getStatus = (entry) => {
    const paid = Number(entry.totalTaxPaid || 0);
    const due = Number(entry.totalTaxLiable || entry.balancePayable || 0);
    if (paid >= due) return 'Paid';
    if (paid > 0 && paid < due) return 'Pending';
    return 'Overdue';
  };

  const renderStatusBadge = (entry) => {
    const status = entry.status || getStatus(entry); // Prefer backend status
    let colorClasses = '';

    switch (status.toLowerCase()) {
      case 'confirmed':
        colorClasses = 'bg-green-100 text-green-700';
        break;
      case 'paid':
        colorClasses = 'bg-green-100 text-green-700';
        break;
      case 'pending':
        colorClasses = 'bg-yellow-100 text-yellow-700';
        break;
      case 'declined':
      case 'overdue':
        colorClasses = 'bg-red-100 text-red-700';
        break;
      default:
        colorClasses = 'bg-gray-100 text-gray-700';
    }
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${colorClasses}`}>
        {formattedStatus}
      </span>
    );
  };

  const filteredEntries = entries.filter((entry) =>
    entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.salonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopAndSideBar>
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold text-[#41091B] mb-6">Tax Information</h1>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, salon or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase">
                      <th className="py-3 px-4 text-left">User Name</th>
                      <th className="py-3 px-4 text-left">Salon Name</th>
                      <th className="py-3 px-4 text-left">Tax Payable</th>
                      <th className="py-3 px-4 text-left">Submitted Date</th>
                      <th className="py-3 px-4 text-left">Submission Year</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-[#f8f0e7]">
                        <td className="py-3 px-4">{entry.name}</td>
                        <td className="py-3 px-4">{entry.salonName}</td>
                        <td className="py-3 px-4">LKR {Number(entry.balancePayable).toLocaleString()}</td>
                        <td className="py-3 px-4">{new Date(entry.submittedAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{new Date(entry.submittedAt).getFullYear()}</td>
                        <td className="py-3 px-4">{renderStatusBadge(entry)}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleViewClick(entry._id)}><Eye size={16} /></button>
                            {(entry.status !== 'confirmed' && entry.status !== 'declined') && (
                              <>
                                <button
                                  className="text-green-500 hover:text-green-700"
                                  onClick={() => handleConfirmClick(entry._id)}
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeclineClick(entry._id)}
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {isModalOpen && selectedTaxData && (
            <TaxDetailsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              data={selectedTaxData}
            />
          )}
        </div>
      </TopAndSideBar>
    </div>
  );
}
