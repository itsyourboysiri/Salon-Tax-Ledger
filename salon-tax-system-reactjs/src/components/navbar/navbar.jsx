import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="bg-[#1E040C] text-white px-6  flex items-center justify-between relative">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="w-21 h-21" />
          <span className="text-lg font-semibold">SALON LEDGER</span>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`flex-col md:flex-row md:flex space-y-4 md:space-y-0 md:space-x-6 text-base absolute md:static top-full left-0 w-full md:w-auto bg-[#1E040C] md:bg-transparent px-6 md:px-0 py-4 md:py-0 ${isOpen ? 'flex' : 'hidden md:flex'}`}>
          <Link to={"/homepage"} className="hover:text-[var(--color-hover)] font-semibold">Home</Link>
          <Link to={"/taxform"} className="hover:text-[var(--color-hover)] font-semibold">Income Tax Upload</Link>
          <Link to={"/taxview"} className="hover:text-[var(--color-hover)] font-semibold">View Tax Submissions</Link>
          <Link to={"/userprofile"} className="hover:text-[var(--color-hover)] font-semibold">My Profile</Link>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
