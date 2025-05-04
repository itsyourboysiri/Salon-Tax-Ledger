import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaFileAlt, FaUserCircle } from 'react-icons/fa';
import Navbar from '../components/navbar/navbar';

const HomePage = () => {
    return (
        <div className="bg-[#F9F6EE] min-h-screen">

            <div className="flex flex-col items-center justify-center px-6 py-12">
                <h1 className="text-3xl font-bold text-[#380817] ">Welcome to Salon Ledger Dashboard</h1>
                <img
                    src="/logo.png" // Update path if needed
                    alt="Salon Ledger Logo"
                    className="w-100 h-auto"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">

                    {/* Income Tax Upload */}
                    <Link to="/taxform" className="bg-white border border-[#986611] rounded-2xl shadow-md hover:shadow-lg hover:bg-[#fff3db] transition-all duration-300 p-8 flex flex-col items-center text-center">
                        <FaUpload className="text-4xl text-[#380817] mb-4" />
                        <h2 className="text-xl font-semibold text-[#380817]">Income Tax Upload</h2>
                        <p className="text-[#380817] mt-2 text-sm">Submit your income tax information easily</p>
                    </Link>

                    {/* View Tax Submissions */}
                    <Link to="/taxview" className="bg-white border border-[#986611] rounded-2xl shadow-md hover:shadow-lg hover:bg-[#fff3db] transition-all duration-300 p-8 flex flex-col items-center text-center">
                        <FaFileAlt className="text-4xl text-[#380817] mb-4" />
                        <h2 className="text-xl font-semibold text-[#380817]">View Tax Submissions</h2>
                        <p className="text-[#380817] mt-2 text-sm">See all your previously submitted tax records</p>
                    </Link>

                    {/* My Profile */}
                    <Link to="/userprofile" className="bg-white border border-[#986611] rounded-2xl shadow-md hover:shadow-lg hover:bg-[#fff3db] transition-all duration-300 p-8 flex flex-col items-center text-center">
                        <FaUserCircle className="text-4xl text-[#380817] mb-4" />
                        <h2 className="text-xl font-semibold text-[#380817]">My Profile</h2>
                        <p className="text-[#380817] mt-2 text-sm">Manage your personal and business details</p>
                    </Link>
                    {/* View Graphs */}
                    <Link to="/taxgraphs" className="bg-white border border-[#986611] rounded-2xl shadow-md hover:shadow-lg hover:bg-[#fff3db] transition-all duration-300 p-8 flex flex-col items-center text-center">
                        <FaFileAlt className="text-4xl text-[#380817] mb-4" />
                        <h2 className="text-xl font-semibold text-[#380817]">Tax Data Visualizer</h2>
                        <p className="text-[#380817] mt-2 text-sm">View charts based on previous tax submissions</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
