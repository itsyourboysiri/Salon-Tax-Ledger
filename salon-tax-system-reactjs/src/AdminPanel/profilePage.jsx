import { useState } from 'react';
import { Pencil, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import TopAndSideBar from './Dashboard Components/sideBar';

export default function ProfileSection() {
  const [userInfo, setUserInfo] = useState({
    firstName: "Musharof",
    lastName: "Chowdhury",
    role: "Team Manager",
    location: "Arizona, United States",
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    bio: "Team Manager",
    country: "United States.",
    cityState: "Phoenix, Arizona, United States.",
    postalCode: "ERT 2489",
    taxId: "AS4568384"
  });

  return (
    <div className="bg-gray-50 min-h-screen">
        <TopAndSideBar>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
          <div className="flex items-center mt-1">
            <a href="#" className="text-gray-500 hover:text-blue-600">Home</a>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-800">Profile</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Profile</h2>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-4">
                  <img 
                    src="/api/placeholder/100/100" 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{userInfo.firstName} {userInfo.lastName}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center mt-1">
                    <span className="text-gray-600 mr-2">{userInfo.role}</span>
                    <span className="text-gray-500">{userInfo.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 hover:bg-gray-200">
                  <Facebook size={18} className="text-gray-700" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 hover:bg-gray-200">
                  <Twitter size={18} className="text-gray-700" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 hover:bg-gray-200">
                  <Linkedin size={18} className="text-gray-700" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-4 hover:bg-gray-200">
                  <Instagram size={18} className="text-gray-700" />
                </a>
                <button className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                  <Pencil size={16} className="mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <button className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                <Pencil size={16} className="mr-1" />
                Edit
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">First Name</p>
                  <p className="text-gray-800">{userInfo.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Name</p>
                  <p className="text-gray-800">{userInfo.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email address</p>
                  <p className="text-gray-800">{userInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-800">{userInfo.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Bio</p>
                  <p className="text-gray-800">{userInfo.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-lg font-medium">Address</h3>
              <button className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                <Pencil size={16} className="mr-1" />
                Edit
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Country</p>
                  <p className="text-gray-800">{userInfo.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">City/State</p>
                  <p className="text-gray-800">{userInfo.cityState}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Postal Code</p>
                  <p className="text-gray-800">{userInfo.postalCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">TAX ID</p>
                  <p className="text-gray-800">{userInfo.taxId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </TopAndSideBar>
    </div>
  );
}