import React, { useEffect, useState } from "react";
import { FaBars, FaTimes, FaChevronDown, FaUserEdit, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Notifications from "../../Notifications/userNotificiations";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const location = useLocation();

  // Get user data from sessionStorage
  const username = sessionStorage.getItem('username');
  const name = sessionStorage.getItem('name') || username;


  useEffect(() => {
    // Load profile image from sessionStorage when component mounts
    const photoPath = sessionStorage.getItem('photo');
    if (photoPath) {
      let fullUrl;
      
      // Check if it's already a full URL
      if (photoPath.startsWith('http')) {
        fullUrl = photoPath;
      } 
      // Check if it's just a path starting with /useruploads
      else if (photoPath.startsWith('/useruploads')) {
        fullUrl = `http://localhost:5000/api/users${photoPath}`;
      }
      // Handle case where it might have /api/users prefix
      else if (photoPath.startsWith('/api/users')) {
        fullUrl = `http://localhost:5000${photoPath}`;
      }
      // Default case (shouldn't normally happen)
      else {
        fullUrl = `http://localhost:5000/api/users${photoPath}`;
      }
  
      console.log("Profile Image URL:", fullUrl); // Debugging log
      setProfileImageUrl(fullUrl);
    }
  }, []);


  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      <nav className="w-full bg-[#1E040C] shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo + Name */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-15 h-15" />
            <span className="text-lg font-semibold text-white">SALON LEDGER</span>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Center: Navigation */}
          <div
            className={`flex-col md:flex-row md:flex space-y-4 md:space-y-0 md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#1E040C] z-50 px-6 md:px-0 py-4 md:py-0 transition-all duration-200 ${isOpen ? "flex" : "hidden md:flex"
              }`}
          >
            <Link
              to="/homepage"
              className={`font-medium transition border-b-2 ${location.pathname === "/homepage"
                  ? "text-[#986611] border-[#986611]"
                  : "text-white border-transparent hover:text-[#986611] hover:border-[#986611]"
                }`}
            >
              Home
            </Link>

            <Link
              to="/taxform"
              className={`font-medium transition border-b-2 ${location.pathname === "/taxform"
                  ? "text-[#986611] border-[#986611]"
                  : "text-white border-transparent hover:text-[#986611] hover:border-[#986611]"
                }`}
            >
              Income Tax Upload
            </Link>

            <Link
              to="/taxview"
              className={`font-medium transition border-b-2 ${location.pathname === "/taxview"
                  ? "text-[#986611] border-[#986611]"
                  : "text-white border-transparent hover:text-[#986611] hover:border-[#986611]"
                }`}
            >
              View Tax Submissions
            </Link>

            <Link
              to="/payment-history"
              className={`font-medium transition border-b-2 ${location.pathname === "/payment-history"
                  ? "text-[#986611] border-[#986611]"
                  : "text-white border-transparent hover:text-[#986611] hover:border-[#986611]"
                }`}
            >
              Payment History
            </Link>

            <Link
              to="/taxgraphs"
              className={`font-medium transition border-b-2 ${location.pathname === "/taxgraphs"
                  ? "text-[#986611] border-[#986611]"
                  : "text-white border-transparent hover:text-[#986611] hover:border-[#986611]"
                }`}
            >
              Tax Data Visualizer
            </Link>
          </div>

          {/* Right: Notifications and User Profile */}
          <div className="hidden md:flex items-center gap-4">
            <Notifications />
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={toggleProfile}
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-[#FFF3CF] object-cover"
                    onError={() => setProfileImageUrl(null)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-[#FFF3CF] flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                )}
                <span className="text-white font-medium">{name}</span>
                <FaChevronDown 
                  className={`text-[#FFF3CF] text-xs transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`} 
                />
              </div>
              
              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 divide-y divide-gray-100">
                  <Link
                    to="/userprofile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaUserEdit className="mr-2 text-[#986611]" size={24}/>
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2 text-[#986611]" size={24} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;