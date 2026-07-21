"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ethicon from '../../../public/ethereum-logo.svg';
import { Target, TrendingUp, Users, CheckCircle, Zap, Globe, Loader2, Search, ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { db } from '../../firebase/config';
import PromotionalCard from '../../components/ui/PromotionalCard';
import AnimatedLoader from '../../components/ui/AnimatedLoader';

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

  const getUrgencyPriority = (urgency) => {
    const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorities[urgency] || 1;
  };

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
          const urgencyDiff = getUrgencyPriority(b.urgency) - getUrgencyPriority(a.urgency);
          if (urgencyDiff !== 0) return urgencyDiff;
          
          const dateA = a.dateCreated ? new Date(a.dateCreated) : (a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0));
          const dateB = b.dateCreated ? new Date(b.dateCreated) : (b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0));
          return dateB - dateA;
          
        case "date":
          const dateASort = a.dateCreated ? new Date(a.dateCreated) : (a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0));
          const dateBSort = b.dateCreated ? new Date(b.dateCreated) : (b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0));
          return dateBSort - dateASort;
          
        case "progress":
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

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      critical: { bg: "bg-error-bg border-error-border", text: "text-error", icon: AlertTriangle, label: "Critical" },
      high: { bg: "bg-warning-bg border-warning-border", text: "text-warning", icon: AlertTriangle, label: "High" },
      medium: { bg: "bg-paper-3 border-rule-strong", text: "text-ink-2", icon: Clock, label: "Medium" },
      low: { bg: "bg-success-bg border-success-border", text: "text-success", icon: Clock, label: "Low" }
    };

    const config = urgencyConfig[urgency] || urgencyConfig.medium;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}>
        <IconComponent size={10} />
        {config.label}
      </span>
    );
  };

  return (
    <section className="bg-transparent min-h-[100dvh] py-10 sm:py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header with Search and Sort */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-rule">
          <div className="flex min-w-0 items-start sm:items-center gap-3 sm:gap-4">
            <div className="bg-accent-bg border border-rule-strong p-3 rounded-xl shrink-0">
              <Globe size={28} className="text-accent" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight break-words">
                Discover Campaigns
              </h1>
              <p className="text-xs text-ink-2 font-medium mt-1">
                Browse approved campaigns - every one verified on Ethereum
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full lg:w-auto">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort campaigns"
              className="min-h-11 w-full sm:w-auto px-3.5 py-2 border border-rule-strong rounded-lg text-xs font-semibold text-ink bg-paper-2-glass backdrop-blur hover:bg-paper-3 focus:outline-none transition-colors"
            >
              <option value="urgency">Sort by Urgency</option>
              <option value="date">Sort by Date</option>
              <option value="progress">Sort by Progress</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none">
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
                aria-label="Search campaigns"
                className={`w-full sm:w-64 min-h-11 pl-3.5 pr-9 py-2 border rounded-lg text-xs transition-all duration-200 focus:outline-none ${
                  isSearchFocused
                    ? 'border-accent bg-paper-glass backdrop-blur-md ring-1 ring-accent'
                    : 'border-rule-strong bg-paper-2-glass backdrop-blur hover:bg-paper-3'
                } text-ink placeholder-ink-2/60`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search size={14} className={isSearchFocused ? 'text-accent' : 'text-ink-2'} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { icon: Globe, label: "Total Pools", value: stats.totalCampaigns, bg: "bg-paper-2-glass backdrop-blur" },
            { icon: ethicon, label: "Total Raised", value: `${stats.totalRaised.toFixed(3)} ETH`, isImage: true, bg: "bg-paper-2-glass backdrop-blur" },
            { icon: Zap, label: "Active", value: stats.activeCampaigns, bg: "bg-paper-2-glass backdrop-blur" },
            { icon: CheckCircle, label: "Completed", value: stats.completedCampaigns, bg: "bg-paper-2-glass backdrop-blur" },
            { icon: AlertTriangle, label: "Critical", value: stats.criticalCampaigns, bg: "bg-paper-2-glass backdrop-blur" },
            { icon: Clock, label: "High Urgency", value: stats.highUrgencyCampaigns, bg: "bg-paper-2-glass backdrop-blur" }
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bg} min-w-0 p-3.5 rounded-xl border border-rule flex flex-col items-center justify-center text-center gap-1 shadow-sm hover-lift animate-fade-slide-in`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="p-2 rounded-lg bg-paper-3-glass backdrop-blur-sm flex items-center justify-center">
                {stat.isImage ? (
                  <Image src={stat.icon} alt="" width={14} height={14} aria-hidden="true" />
                ) : (
                  <stat.icon size={14} className="text-accent" aria-hidden="true" />
                )}
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-bold text-ink-2 block uppercase tracking-wider leading-tight break-words">{stat.label}</span>
                <span className="text-md font-extrabold text-ink mt-0.5 block leading-tight break-words">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <AnimatedLoader message="Fetching campaigns..." />
          </div>
        ) : filteredAndSortedCampaigns.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-rule-strong rounded-2xl bg-paper-2-glass backdrop-blur animate-scale-in">
            <Search size={32} className="mx-auto mb-3 text-ink-2 opacity-40" />
            <p className="text-sm font-bold text-ink">
              {campaigns.length === 0 ? "No campaigns live yet" : "No results match your criteria"}
            </p>
            <p className="text-xs text-ink-2 mt-1 max-w-sm mx-auto">
              {campaigns.length === 0 
                ? "No campaigns live yet - check back soon or be the first to launch one."
                : "Try adjusting your search keywords or sorting criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentCampaigns.map((campaign, index) => {
              const progressPercentage = Math.min(
                ((campaign.collected || 0) / campaign.amount) * 100,
                100
              );
              const isGoalReached = progressPercentage >= 100;

              return (
                <div
                  key={campaign.id}
                  className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-rule-strong hover-lift transition-all duration-300 flex flex-col h-full animate-fade-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Photo container */}
                  <div className="relative h-40 w-full overflow-hidden bg-paper-3 border-b border-rule">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      unoptimized
                    />
                    
                    {/* Goal badge */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 font-mono max-w-[calc(100%-1.5rem)] truncate">
                      {campaign.amount} ETH
                    </div>

                    <div className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] bg-white/90 text-black text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      {isGoalReached ? (
                        <CheckCircle size={10} className="text-success" aria-hidden="true" />
                      ) : (
                        <Zap size={10} className="text-warning" aria-hidden="true" />
                      )}
                      {isGoalReached ? "Funded" : "Active"}
                    </div>
                    
                    {/* Urgency Badge */}
                    <div className="absolute bottom-3 left-3 animate-scale-in" style={{ animationDelay: `${index * 50 + 100}ms` }}>
                      {getUrgencyBadge(campaign.urgency)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-2 font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Clock size={12} aria-hidden="true" />
                          {formatDate(campaign.dateCreated, campaign.createdAt)}
                        </span>
                        <span className="hidden sm:inline text-ink-2/60">/</span>\r\n                        <span className="flex min-w-0 items-center gap-1">
                          <Target size={12} aria-hidden="true" />
                          {campaign.category}
                        </span>
                      </div>

                      <h2 className="text-md font-bold text-ink leading-snug line-clamp-2 break-words hover:text-accent transition-colors">
                        <Link href={`/campaigns/${campaign.id}`}>
                          {campaign.title}
                        </Link>
                      </h2>

                      <p className="text-xs text-ink-2 leading-relaxed line-clamp-3">
                        {campaign.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-paper-3-glass backdrop-blur-sm rounded-full h-1.5 overflow-hidden border border-rule">
                          <div
                            className={`h-full rounded-full transition-[width] duration-500 [transition-timing-function:var(--ease-out)] ${
                              isGoalReached ? 'bg-success' : 'bg-accent'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap justify-between items-center gap-2 text-[11px] font-semibold text-ink-2">
                          <span className="flex items-center gap-0.5">
                            <Image src="/ethereum-logo.svg" alt="Eth" width={10} height={10} className="inline mr-0.5" />
                            {campaign.collected || 0} ETH
                          </span>
                          <span className="flex items-center gap-0.5 font-mono">
                            <Users size={10} className="inline" aria-hidden="true" />
                            {campaign.contributors || 0} backers
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="w-full py-2 bg-accent-bg hover:bg-accent hover:text-white border border-rule-strong text-accent rounded-lg text-xs font-bold transition-all btn-active-feedback shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Users size={14} aria-hidden="true" />
                        Back this campaign
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredAndSortedCampaigns.length > campaignsPerPage && (
          <div className="flex flex-wrap justify-center items-center gap-2 pt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="w-8 h-8 rounded-lg border bg-paper-2-glass backdrop-blur border-rule text-ink hover:bg-paper-3-glass hover:shadow-sm btn-active-feedback transition-all flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={`w-8 h-8 rounded-lg border font-semibold text-xs transition-all btn-active-feedback flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-accent text-white border-transparent'
                    : 'bg-paper-2-glass backdrop-blur text-ink border-rule hover:bg-paper-3-glass'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="w-8 h-8 rounded-lg border bg-paper-2-glass backdrop-blur border-rule text-ink hover:bg-paper-3-glass hover:shadow-sm btn-active-feedback transition-all flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        <PromotionalCard />
      </div>


    </section>
  );
};

export default Dashboard;
