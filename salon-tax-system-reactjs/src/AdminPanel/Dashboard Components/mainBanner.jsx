import React from 'react';
import { List, Users, Briefcase, Target } from 'lucide-react';

const ProjectBanner = () => {
  // Matching mock data
  const data = {
    users: 18,
    newUsersThisMonth: 2,

    revenue: 132000, // in thousands LKR
    completedPayments: 28,

    taxFilesSubmitted: 12,
    approvedTaxFiles: 1,

    currentTaxYearProgress: '76%',
    completedYears: '5%',
  };

  return (
    <div className="relative">
      <div className="bg-rose-700 rounded-lg" style={{ height: "200px" }}>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">Home</h1>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 absolute left-0 right-0 px-6" style={{ top: "80px" }}>
            
            {/* Users Card */}
            <div className="bg-white border border-rose-100 rounded-xl shadow-md overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between items-center bg-rose-50 p-5">
                <h3 className="text-rose-700 font-medium">Registered Users</h3>
                <div className="bg-rose-100 p-2 rounded-lg">
                  <Users size={20} className="text-rose-600" />
                </div>
              </div>
              <div className="bg-neutral-50 p-5">
                <div className="text-5xl font-bold text-gray-900 mb-1">{data.users}</div>
                <div className="text-gray-600">
                  <span className="font-medium">{data.newUsersThisMonth}</span> joined this month
                </div>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-white border border-rose-100 rounded-xl shadow-md overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between items-center bg-rose-50 p-5">
                <h3 className="text-rose-700 font-medium">Total Revenue</h3>
                <div className="bg-rose-100 p-2 rounded-lg">
                  <Briefcase size={20} className="text-rose-600" />
                </div>
              </div>
              <div className="bg-neutral-50 p-5">
                <div className="text-3xl font-bold text-gray-900 mb-1">LKR {data.revenue.toLocaleString()}</div>
                <div className="text-gray-600">
                  <span className="font-medium">{data.completedPayments}</span> payments completed
                </div>
              </div>
            </div>

            {/* Tax File Submissions Card */}
            <div className="bg-white border border-rose-100 rounded-xl shadow-md overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between items-center bg-rose-50 p-5">
                <h3 className="text-rose-700 font-medium">Tax File Submissions</h3>
                <div className="bg-rose-100 p-2 rounded-lg">
                  <List size={20} className="text-rose-600" />
                </div>
              </div>
              <div className="bg-neutral-50 p-5">
                <div className="text-5xl font-bold text-gray-900 mb-1">{data.taxFilesSubmitted}</div>
                <div className="text-gray-600">
                  <span className="font-medium">{data.approvedTaxFiles}</span> approved
                </div>
              </div>
            </div>

            {/* Tax Year Progress Card */}
            <div className="bg-white border border-rose-100 rounded-xl shadow-md overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between items-center bg-rose-50 p-5">
                <h3 className="text-rose-700 font-medium">Tax Year Progress</h3>
                <div className="bg-rose-100 p-2 rounded-lg">
                  <Target size={20} className="text-rose-600" />
                </div>
              </div>
              <div className="bg-neutral-50 p-5">
                <div className="text-5xl font-bold text-gray-900 mb-1">{data.currentTaxYearProgress}</div>
                <div className="text-gray-600">
                  <span className="font-medium">{data.completedYears}</span> completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer below cards */}
      <div className="h-40"></div>
      <div className="bg-gray-100"></div>
    </div>
  );
};

export default ProjectBanner;
