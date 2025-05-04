import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Bell } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

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
            className={`flex-col md:flex-row md:flex space-y-4 md:space-y-0 md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#1E040C] z-50 px-6 md:px-0 py-4 md:py-0 transition-all duration-200 ${
              isOpen ? "flex" : "hidden md:flex"
            }`}
          >
            <Link
              to="/homepage"
              className="text-white hover:text-[#986611] font-medium transition border-b-2 border-transparent hover:border-[#986611]"
            >
              Home
            </Link>
            <Link
              to="/taxform"
              className="text-white hover:text-[#986611] font-medium transition border-b-2 border-transparent hover:border-[#986611]"
            >
              Income Tax Upload
            </Link>
            <Link
              to="/taxview"
              className="text-white hover:text-[#986611] font-medium transition border-b-2 border-transparent hover:border-[#986611]"
            >
              View Tax Submissions
            </Link>
            {/* NEW: Payment History link */}
            <Link
              to="/payment-history"
              className="text-white hover:text-[#986611] font-medium transition border-b-2 border-transparent hover:border-[#986611]"
            >
              Payment History
            </Link>
            <Link
              to="/userprofile"
              className="text-white hover:text-[#986611] font-medium transition border-b-2 border-transparent hover:border-[#986611]"
            >
              My Profile
            </Link>
          </div>

          {/* Right: Bell and Avatar */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-[#FFF3CF] hover:text-[#986611]">
              <Bell size={18} />
            </button>
            <img
              src="https://i.pravatar.cc/100"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-[#FFF3CF]"
            />
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
