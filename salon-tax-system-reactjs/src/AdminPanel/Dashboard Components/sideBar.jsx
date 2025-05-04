import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, Search, Bell, Menu, User,
  FileText, Grid, BarChart2, LogOut, DollarSign
} from 'lucide-react';
import taxlogo from '../../../public/logo.png';

const TopAndSideBar = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 duration-300 group
        ${isCollapsed ? 'w-16 hover:w-64' : 'w-64'} hidden sm:block`}>
        <div className="flex items-center border-b border-gray-200 p-3">
          <img src={taxlogo} alt="Logo" className="w-10 h-10 object-contain" />
          {!isCollapsed && (
            <h1 className="text-lg font-semibold ml-3 text-rose-700">Salon Tax Ledger</h1>
          )}
        </div>

        {!isCollapsed && (
          <div className="p-4 text-sm text-gray-500">MENU</div>
        )}

        <div className="px-2 space-y-1 text-sm">
          <Link to="/admin-home">
            <div className={`flex items-center p-2 mb-1 bg-rose-100 text-rose-700 rounded-md ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center">
                <Grid size={18} />
                {!isCollapsed && <span className="ml-2">Dashboard</span>}
              </div>
              {!isCollapsed && <ChevronUp size={16} />}
            </div>
          </Link>

          <Link to="/admin-users">
            <div className={`p-2 hover:bg-rose-50 rounded-md cursor-pointer flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
              <User size={18} />
              {!isCollapsed && <span className="ml-2">Users</span>}
            </div>
          </Link>

          <div className={`p-2 hover:bg-rose-50 rounded-md cursor-pointer flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link to="/admin-taxgraphs">
            <div className="flex items-center">
              <BarChart2 size={18} />
              {!isCollapsed && <span className="ml-2">Analytics</span>}
            </div>
          </Link>
          </div>

          <Link to="/admin-taxinformation">
            <div className={`p-2 hover:bg-rose-50 rounded-md cursor-pointer flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
              <FileText size={18} />
              {!isCollapsed && <span className="ml-2">Tax Information</span>}
            </div>
          </Link>

          <Link to="/admin-payments">
            <div className={`p-2 hover:bg-rose-50 rounded-md cursor-pointer flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
              <DollarSign size={18} />
              {!isCollapsed && <span className="ml-2">Payments</span>}
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <Menu size={20} className="mr-4 cursor-pointer sm:hidden" onClick={() => setIsCollapsed(!isCollapsed)} />
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search or type command..."
                className="pl-10 pr-4 py-2 bg-rose-50 rounded-md w-60 focus:outline-none"
              />
              <div className="absolute right-3 top-2.5 px-1.5 py-0.5 bg-gray-200 rounded text-xs">
                ⌘K
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center">
            <button className="p-3 mr-2 rounded-full hover:bg-rose-50 relative">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-yellow-500 rounded-full"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img src={taxlogo} alt="User" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                <span className="ml-2 font-medium text-gray-800 hidden sm:inline">Musharof</span>
                <ChevronDown size={16} className="ml-1 text-gray-500 hidden sm:inline" />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800">Musharof Chowdhury</h3>
                    <p className="text-gray-500 text-sm">randomuser@pimjo.com</p>
                  </div>
                  <div className="py-2">
                    <Link to="/admin-editprofile" className="flex items-center px-4 py-3 hover:bg-rose-50">
                      <User size={18} className="text-gray-500" />
                      <span className="ml-3 text-gray-700">Edit profile</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-2">
                    <button className="w-full flex items-center px-4 py-3 hover:bg-rose-50 text-left">
                      <LogOut size={18} className="text-gray-500" />
                      <span className="ml-3 text-gray-700">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Routed Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default TopAndSideBar;
