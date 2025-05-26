import React, { useState, useEffect } from 'react';
import { Users, Briefcase, List, Target } from 'lucide-react';

const DashboardCards = () => {
  const [data, setData] = useState({
    users: 0,
    newUsersThisMonth: 0,
    revenue: 0,
    completedPayments: 0,
    taxFilesSubmitted: 0,
    approvedTaxFiles: 0,
    currentTaxYearProgress: '0%',
    completedYears: '0%',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersResponse, paymentsResponse, taxSubmissionsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/admin/all-users'),
        fetch('http://localhost:5000/api/admin/all-payments'), 
        fetch('http://localhost:5000/api/admin/tax-submissions')
      ]);

      if (!usersResponse.ok || !paymentsResponse.ok || !taxSubmissionsResponse.ok) {
        throw new Error('Failed to fetch data from one or more endpoints');
      }

      const [users, payments, taxSubmissions] = await Promise.all([
        usersResponse.json(),
        paymentsResponse.json(),
        taxSubmissionsResponse.json()
      ]);

      // Process users data
      const totalUsers = users.length;
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const newUsersThisMonth = users.filter(user => {
        const userCreatedAt = new Date(user.createdAt);
        return userCreatedAt >= startOfMonth;
      }).length;

      // Process payments data
      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
      const completedPayments = payments.filter(payment => payment.isFullyPaid === true).length;

      // Process tax submissions data
      const totalTaxSubmissions = taxSubmissions.length;
      const approvedTaxSubmissions = taxSubmissions.filter(submission => 
        submission.status === 'confirmed'
      ).length;

      // Calculate tax year progress
      const extractStartYearFromTaxYear = (taxYearStr) => {
        if (!taxYearStr || typeof taxYearStr !== 'string') return null;
        const match = taxYearStr.match(/^(\d{4})/);
        return match ? parseInt(match[1]) : null;
      };
      
      const getYearFromDate = (dateStr) => {
        return new Date(dateStr).getFullYear();
      };
      
      const targetYear = 2025;
      const targetTaxYear = '2025/2026';
      
      const currentYearSubmissions = taxSubmissions.filter(sub => {
        const yearFromSubmittedAt = getYearFromDate(sub.submittedAt);
        const matchingPayment = payments.find(p => p._id === sub.paymentId);
      
        const isForTargetYear = yearFromSubmittedAt === targetYear;
        const isForTargetTaxYear = matchingPayment?.taxYear === targetTaxYear;
      
        return isForTargetYear && isForTargetTaxYear;
      });
      
      const fullyPaidForCurrentYear = currentYearSubmissions.filter(sub => {
        const matchingPayment = payments.find(p => p._id === sub.paymentId);
        return matchingPayment?.isFullyPaid;
      }).length;
      
      const progressPercentage = currentYearSubmissions.length > 0
        ? Math.round((fullyPaidForCurrentYear / currentYearSubmissions.length) * 100)
        : 0;
      

      // Get unique tax years
      const uniqueYears = [...new Set(taxSubmissions.map(sub => getYearFromDate(sub.submittedAt)))];
      const completedYearsPercentage = Math.round((uniqueYears.length / 10) * 100);
      

      setData({
        users: totalUsers,
        newUsersThisMonth,
        revenue: totalRevenue,
        completedPayments,
        taxFilesSubmitted: totalTaxSubmissions,
        approvedTaxFiles: approvedTaxSubmissions,
        currentTaxYearProgress: `${progressPercentage}%`,
        completedYears: `${completedYearsPercentage}%`
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative">
        <div 
          className="rounded-lg" 
          style={{ 
            height: "200px",
            background: "linear-gradient(to right, #380817, #986611)"
          }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-white text-2xl font-semibold">Home</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 absolute left-0 right-0 px-6" style={{ top: "80px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl shadow-md bg-white p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-40"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div 
          className="rounded-lg" 
          style={{ 
            height: "200px",
            background: "linear-gradient(to right, #380817, #986611)"
          }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-white text-2xl font-semibold">Home</h1>
            </div>

            <div className="absolute left-0 right-0 px-6" style={{ top: "80px" }}>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button 
                  onClick={fetchDashboardData}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-40"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className="rounded-lg" 
        style={{ 
          height: "200px",
          background: "linear-gradient(to right, #380817, #986611)"
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">Home</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 absolute left-0 right-0 px-6" style={{ top: "80px" }}>
            {/* Users Card */}
            <div 
              className="rounded-xl shadow-md overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "linear-gradient(to bottom right, #ffffff, #fff4d6)"
              }}
            >
              <div className="flex justify-between items-center p-5">
                <h3 className="text-gray-800 font-medium">Registered Users</h3>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Users size={20} className="text-yellow-600" />
                </div>
              </div>
              <div className="p-5">
                <div className="text-5xl font-bold text-gray-900 mb-1">{data.users}</div>
                <div className="text-gray-600">
                  <span className="font-medium">{data.newUsersThisMonth}</span> joined this month
                </div>
              </div>
            </div>

            {/* Revenue Card */}
            <div 
              className="rounded-xl shadow-md overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "linear-gradient(to bottom right, #ffffff, #fff4d6)"
              }}
            >
              <div className="flex justify-between items-center p-5">
                <h3 className="text-gray-800 font-medium">Total Revenue</h3>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Briefcase size={20} className="text-yellow-600" />
                </div>
              </div>
              <div className="p-5">
                <div className="text-3xl font-bold text-gray-900 mb-1">LKR {data.revenue.toLocaleString()}</div>
                <div className="text-gray-600">
                  <span className="font-medium">{data.completedPayments}</span> payments completed
                </div>
              </div>
            </div>

            {/* Tax File Submissions Card */}
            <div 
              className="rounded-xl shadow-md overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "linear-gradient(to bottom right, #ffffff, #fff4d6)"
              }}
            >
              <div className="flex justify-between items-center p-5">
                <h3 className="text-gray-800 font-medium">Tax File Submissions</h3>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <List size={20} className="text-yellow-600" />
                </div>
              </div>
              <div className="p-5">
                <div className="text-5xl font-bold text-gray-900 mb-1">{data.taxFilesSubmitted}</div>
                <div className="text-gray-600">
                  <span className="font-medium">{data.approvedTaxFiles}</span> approved
                </div>
              </div>
            </div>

            {/* Tax Year Progress Card */}
            <div 
              className="rounded-xl shadow-md overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "linear-gradient(to bottom right, #ffffff, #fff4d6)"
              }}
            >
              <div className="flex justify-between items-center p-5">
                <h3 className="text-gray-800 font-medium">Tax Year Progress</h3>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Target size={20} className="text-yellow-600" />
                </div>
              </div>
              <div className="p-5">
                <div className="text-5xl font-bold text-gray-900 mb-1">{data.currentTaxYearProgress}</div>
                <div className="text-gray-600">
       <span className="font-medium">Current year: 2025/2026</span>
    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-40"></div>
    </div>
  );
};

export default DashboardCards;