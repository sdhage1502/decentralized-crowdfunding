"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ethicon from '../../../public/ethereum-logo.svg';
import { Target, TrendingUp, Users, Heart, CheckCircle, Zap, Globe, Loader2, Search, ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { db } from '../../firebase/config'; // Adjust path if needed
import PromotionalCard from '../components/promotionalCard';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("urgency"); // "urgency", "date", "progress"
  const campaignsPerPage = 6;

  const router = useRouter();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        
        // Only fetch approved and active campaigns
        const q = query(
          collection(db, 'campaigns'),
          where('status', '==', 'approved'),
          where('isActive', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const campaignList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setCampaigns(campaignList);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Function to get urgency priority for sorting
  const getUrgencyPriority = (urgency) => {
    const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorities[urgency] || 1;
  };

  // Function to get days since creation
  const getDaysSinceCreation = (dateCreated, createdAt) => {
    let date;
    if (dateCreated) {
      date = new Date(dateCreated);
    } else if (createdAt && createdAt.seconds) {
      date = new Date(createdAt.seconds * 1000);
    } else {
      return 0;
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Function to format date for display
  const formatDate = (dateCreated, createdAt) => {
    let date;
    if (dateCreated) {
      date = new Date(dateCreated);
    } else if (createdAt && createdAt.seconds) {
      date = new Date(createdAt.seconds * 1000);
    } else {
      return "Unknown date";
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = campaigns
    .filter((campaign) => {
      return (
        campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "urgency":
          // Sort by urgency first, then by date (newer first for same urgency)
          const urgencyDiff = getUrgencyPriority(b.urgency) - getUrgencyPriority(a.urgency);
          if (urgencyDiff !== 0) return urgencyDiff;
          
          // If same urgency, sort by date (newer first)
          const dateA = a.dateCreated ? new Date(a.dateCreated) : (a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0));
          const dateB = b.dateCreated ? new Date(b.dateCreated) : (b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0));
          return dateB - dateA;
          
        case "date":
          // Sort by creation date (newest first)
          const dateASort = a.dateCreated ? new Date(a.dateCreated) : (a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0));
          const dateBSort = b.dateCreated ? new Date(b.dateCreated) : (b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0));
          return dateBSort - dateASort;
          
        case "progress":
          // Sort by progress percentage (closest to goal first)
          const progressA = ((a.collected || 0) / a.amount) * 100;
          const progressB = ((b.collected || 0) / b.amount) * 100;
          return progressB - progressA;
          
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedCampaigns.length / campaignsPerPage);
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredAndSortedCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

  const stats = {
    totalCampaigns: campaigns.length,
    totalRaised: campaigns.reduce((sum, campaign) => sum + (campaign.collected || 0), 0),
    activeCampaigns: campaigns.filter(c => ((c.collected || 0) / c.amount) * 100 < 100).length,
    completedCampaigns: campaigns.filter(c => ((c.collected || 0) / c.amount) * 100 >= 100).length,
    criticalCampaigns: campaigns.filter(c => c.urgency === 'critical').length,
    highUrgencyCampaigns: campaigns.filter(c => c.urgency === 'high').length
  };

  // Function to get urgency badge
  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      critical: { bg: "bg-red-100", text: "text-red-800", icon: AlertTriangle, label: "Critical" },
      high: { bg: "bg-orange-100", text: "text-orange-800", icon: AlertTriangle, label: "High" },
      medium: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock, label: "Medium" },
      low: { bg: "bg-green-100", text: "text-green-800", icon: Clock, label: "Low" }
    };

    const config = urgencyConfig[urgency] || urgencyConfig.medium;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  return (
    <section className="dark:bg-secondaryBlack inset-0 w-full min-h-screen bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] py-16 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header with Search and Sort */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-lg shadow-md">
              <Globe size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
                Explore Campaigns
              </h1>
              <div className="h-0.5 w-20 bg-blue-500 mt-1"></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="urgency">Sort by Urgency</option>
              <option value="date">Sort by Date</option>
              <option value="progress">Sort by Progress</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full sm:w-72 px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${isSearchFocused
                  ? 'border-blue-500 shadow-md bg-blue-50/50'
                  : 'border-blue-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <Search size={20} className={`transition-colors duration-300 ${isSearchFocused ? 'text-blue-500' : 'text-blue-400'}`} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-700 md:text-xl mb-12 text-center max-w-3xl mx-auto flex items-center justify-center gap-2">
          Discover verified and approved campaigns seeking support on our decentralized platform.
        </p>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {[
            { icon: Globe, label: "Total Campaigns", value: stats.totalCampaigns, color: "blue", bg: "from-blue-500 to-blue-600" },
            { icon: ethicon, label: "Total Raised", value: `${stats.totalRaised.toFixed(2)} ETH`, isImage: true, bg: "from-purple-500 to-purple-600" },
            { icon: Zap, label: "Active", value: stats.activeCampaigns, color: "yellow", bg: "from-yellow-500 to-yellow-600" },
            { icon: CheckCircle, label: "Completed", value: stats.completedCampaigns, color: "green", bg: "from-green-500 to-green-600" },
            { icon: AlertTriangle, label: "Critical", value: stats.criticalCampaigns, color: "red", bg: "from-red-500 to-red-600" },
            { icon: Clock, label: "High Priority", value: stats.highUrgencyCampaigns, color: "orange", bg: "from-orange-500 to-orange-600" }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className="relative bg-white p-4 rounded-xl shadow-lg border-2 border-gray-100 transform group-hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.bg} text-white shadow-lg`}>
                    {stat.isImage ? (
                      <Image src={stat.icon} alt="Stat Icon" width={20} height={20} />
                    ) : (
                      <stat.icon size={20} />)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
            <p className="text-xl text-gray-500 flex items-center justify-center gap-2">
              Loading approved campaigns...
            </p>
          </div>
        ) : filteredAndSortedCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 flex items-center justify-center gap-2">
              <Search size={20} />
              {campaigns.length === 0 ? "No approved campaigns available yet." : "No campaigns found matching your search."}
            </p>
            {campaigns.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Campaigns are currently being reviewed by our team.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCampaigns.map((campaign) => {
              const progressPercentage = Math.min(
                ((campaign.collected || 0) / campaign.amount) * 100,
                100
              );
              const isGoalReached = progressPercentage >= 100;
              const daysSinceCreation = getDaysSinceCreation(campaign.dateCreated, campaign.createdAt);

              return (
                <div
                  key={campaign.id}
                  className="bg-white border-3 border-[#3247C5] rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                  onClick={() => router.push(`/campaigns/${campaign.id}`)}
                >
                  <div className="relative h-48 w-full overflow-hidden border-b-3 border-[#3247C5]">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#FFC107] text-black text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Image src="/ethereum-logo.svg" alt="ETH" width={16} height={16} />
                      {campaign.amount} ETH
                    </div>
                    <div className="absolute top-3 left-3 bg-white text-black text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      {isGoalReached ? (
                        <CheckCircle size={14} className="text-green-600" />
                      ) : (
                        <Zap size={14} className="text-yellow-600" />
                      )}
                      {isGoalReached ? "Goal Reached" : "Active"}
                    </div>
                    
                    {/* Urgency Badge */}
                    <div className="absolute bottom-3 left-3">
                      {getUrgencyBadge(campaign.urgency)}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-bold text-gray-800 flex-1">
                        {campaign.title}
                      </h2>
                    </div>

                    {/* Campaign Info */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(campaign.dateCreated, campaign.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target size={14} />
                        {campaign.category}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {campaign.description}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${isGoalReached ? 'bg-green-500' : 'bg-[#28A745]'}`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Image src="/ethereum-logo.svg" alt="ETH" width={16} height={16} />
                        {campaign.collected || 0} ETH raised
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {campaign.contributors || 0} backers
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/campaigns/${campaign.id}`);
                      }}
                      className="mt-6 w-full h-[45px] bg-[#3247C5] text-white rounded-lg text-lg font-bold shadow-md hover:bg-[#2a3aa1] transition-colors flex items-center justify-center gap-2"
                    >
                      <Globe size={18} />
                      View Campaign
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredAndSortedCampaigns.length > campaignsPerPage && (
          <div className="flex justify-center mt-16 gap-2 flex-wrap items-center">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:shadow-md transition-all duration-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full border transition-all duration-300 font-semibold flex items-center justify-center shadow-sm
          ${currentPage === page
                    ? 'bg-gradient-to-tr from-[#3247C5] to-[#4158D0] text-white border-transparent scale-105 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:shadow-md hover:scale-105'}`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:shadow-md transition-all duration-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <PromotionalCard/>
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Dashboard;