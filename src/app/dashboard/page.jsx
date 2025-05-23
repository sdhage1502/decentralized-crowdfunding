//dashboard/page.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Target,
  TrendingUp,
  Users,
  Heart,
  CheckCircle,
  Zap,
  Globe,
  Loader2
} from "lucide-react";
import { db } from '../../firebase/config'; // Adjust path if needed

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'campaigns'));
        const campaignList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaigns(campaignList);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <section className="dark:bg-secondaryBlack inset-0 w-full min-h-screen bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-heading text-blue-700 md:text-5xl mb-8 text-center flex items-center justify-center gap-2">
          <Globe size={40} />
          Explore Campaigns
        </h1>
        <p className="text-lg text-gray-700 md:text-xl mb-12 text-center max-w-3xl mx-auto flex items-center justify-center gap-2">
           Discover innovative projects and meaningful causes seeking support on our decentralized platform.
        </p>

        {campaigns.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              Loading campaigns...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => {
              const progressPercentage = Math.min(
                ((campaign.collected || 0) / campaign.amount) * 100,
                100
              );
              const isGoalReached = progressPercentage >= 100;

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
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    
                      {campaign.title}
                    </h2>
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
      </div>
    </section>
  );
};

export default Dashboard;
