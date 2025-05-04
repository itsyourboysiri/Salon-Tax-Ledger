import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Bell, Menu, Calendar, User, FileText, Grid, ShoppingBag, BarChart2, Mail, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';
import taxlogo from '../../public/logo.png'
import ProjectBanner from './Dashboard Components/mainBanner';
import TopAndSideBar from './Dashboard Components/sideBar';
import LatestTaxApprovals from './Dashboard Components/recentTaxApprovals';
export default function AdminHome() {
    const [activeTab, setActiveTab] = useState('daily');

    return (
        <div className=" h-screen bg-gray-100">
            {/* Sidebar */}
            <TopAndSideBar>
                {/* Main Content */}
                <div className="flex-1 relative overflow-hidden">


                    {/* Dashboard Content */}
                    <div className="">


                        {/* Stats Cards */}
                        <ProjectBanner />

                       

                      <LatestTaxApprovals/>
                       
                    </div>
                </div>
            </TopAndSideBar>



        </div>
    );
}