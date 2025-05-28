import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, Bell, Menu, User,
  FileText, Grid, BarChart2, LogOut, DollarSign,
  CheckCircle, XCircle
} from 'lucide-react';
import taxlogo from '../../../public/logo.png';

const TopAndSideBar = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('adminSession'));
    if (session && session.isAuthenticated) {
      setAdminData(session.admin);
    }
    

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
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/notifications');
      const data = await response.json();
      if (response.ok) {
        console.log("Notifications:", data);
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  // Call fetchNotifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  
// Add these notification handling functions
const markAsRead = async (id) => {
  try {
    const session = JSON.parse(localStorage.getItem('adminSession'));
   
      await fetch(`http://localhost:5000/api/admin/notifications/${id}/read`, {
        method: 'PUT',
       
      });
      
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
  
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const markAllAsRead = async () => {
  try {
    const session = JSON.parse(localStorage.getItem('adminSession'));
   
      await fetch('http://localhost:5000/api/admin/notifications/mark-all-read', {
        method: 'PUT',
       
      });
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
 
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

const clearNotifications = async () => {
  try {
    const session = JSON.parse(localStorage.getItem('adminSession'));
  
      await fetch('http://localhost:5000/api/admin/notifications/clear', {
        method: 'DELETE',
       
      });
      
      setNotifications([]);
 
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};
  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    window.location.href = '/admin-login';
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 duration-300 group ${isCollapsed ? 'w-16 hover:w-64' : 'w-64'} hidden sm:block`}>
        <div className="flex items-center border-b border-gray-200 p-3">
          <img src={taxlogo} alt="Logo" className="w-10 h-10 object-contain" />
          {!isCollapsed && (
            <h1 className="text-lg font-semibold ml-3 text-[#986611]">Salon Tax Ledger</h1>
          )}
        </div>

        {!isCollapsed && (
          <div className="p-4 text-sm text-gray-500 font-bold">MENU</div>

        )}

        <div className="px-2 space-y-1 text-sm">
          <Link to="/admin-home">
            <div className={`flex items-center p-2 mb-1 rounded-md ${location.pathname === "/admin-home" ? 'bg-[#986611] text-white' : 'hover:bg-[#f8f0e7] text-gray-700'} ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center">
                <Grid size={18} />
                {!isCollapsed && <span className="ml-2">Dashboard</span>}
              </div>
             
            </div>
          </Link>

          <Link to="/admin-users">
            <div className={`p-2 rounded-md cursor-pointer flex items-center ${location.pathname === "/admin-users" ? 'bg-[#986611] text-white' : 'hover:bg-[#f8f0e7] text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}>
              <User size={18} />
              {!isCollapsed && <span className="ml-2">Users</span>}
            </div>
          </Link>

          <Link to="/admin-taxgraphs">
            <div className={`p-2 rounded-md cursor-pointer flex items-center ${location.pathname === "/admin-taxgraphs" ? 'bg-[#986611] text-white' : 'hover:bg-[#f8f0e7] text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}>
              <BarChart2 size={18} />
              {!isCollapsed && <span className="ml-2">Analytics</span>}
            </div>
          </Link>

          <Link to="/admin-taxinformation">
            <div className={`p-2 rounded-md cursor-pointer flex items-center ${location.pathname === "/admin-taxinformation" ? 'bg-[#986611] text-white' : 'hover:bg-[#f8f0e7] text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}>
              <FileText size={18} />
              {!isCollapsed && <span className="ml-2">Tax Information</span>}
            </div>
          </Link>

          <Link to="/admin-payments">
            <div className={`p-2 rounded-md cursor-pointer flex items-center ${location.pathname === "/admin-payments" ? 'bg-[#986611] text-white' : 'hover:bg-[#f8f0e7] text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}>
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
          </div>

          {/* Profile */}
          <div className="flex items-center">
        {/* Replace the existing notification icon code with this */}
<div className="relative mr-2" ref={notificationRef}>
<button 
  className="p-3 rounded-full hover:bg-[#f8f0e7] relative"
  onClick={() => {
    setShowNotifications(!showNotifications);
    fetchNotifications(); // Fetch when opening
  }}
>
    <Bell size={20} className="text-gray-500" />
    {notifications.filter(n => !n.read).length > 0 && (
      <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
        {notifications.filter(n => !n.read).length}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-20 max-h-96 overflow-y-auto">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">Notifications</h3>
        <div className="flex space-x-2">
          <button 
            onClick={markAllAsRead}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Mark all as read
          </button>
          <button 
            onClick={clearNotifications}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Clear all
          </button>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map(notification => (
            <div 
              key={notification._id}
              className={`p-3 hover:bg-[#f8f0e7] cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  {notification.type === 'confirmed' || notification.metadata?.action === 'confirmed' ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : (
                    <XCircle size={18} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  {notification.metadata?.confirmedBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Action by: {notification.metadata.confirmedBy}
                    </p>
                  )}
                  {notification.metadata?.declinedBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Action by: {notification.metadata.declinedBy}
                    </p>
                  )}
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

</div>

            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img
                  src={adminData?.profilePicture || taxlogo}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border border-yellow-400"
                />

                {adminData && (
                  <>
                    <span className="ml-2 font-medium text-gray-800 hidden sm:inline">{adminData.username}</span>
                    <ChevronDown size={16} className="ml-1 text-gray-500 hidden sm:inline" />
                  </>
                )}
              </div>

              {isDropdownOpen && adminData && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-20">

                  <div className="py-2">
                    <Link to="/admin-editprofile" className="flex items-center px-4 py-3 hover:bg-[#f8f0e7]">
                      <User size={18} className="text-gray-500" />
                      <span className="ml-3 text-gray-700">Edit profile</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-2">
                    <button className="w-full flex items-center px-4 py-3 hover:bg-[#f8f0e7] text-left" onClick={handleLogout}>
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
