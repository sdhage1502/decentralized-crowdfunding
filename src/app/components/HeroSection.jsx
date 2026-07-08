'use client';

import React from "react";
import { useWeb3 } from '../../context/Web3Context';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, BarChart3, Megaphone, Link, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import Image from "next/image";

const HeroSection = () => {
  const { account, connectWallet } = useWeb3();
  const router = useRouter();

  const handleCreateCampaign = () => {
    if (!account) {
      connectWallet();
    } else {
      router.push('/campaigns/create');
    }
  };

  const stats = [
    {
      icon: Link,
      label: "Decentralized & Trustless",
      value: "Ethereum Smart Contracts",
      desc: "All campaigns are registered and audited on the blockchain ledger."
    },
    {
      icon: HeartHandshake,
      label: "Direct Funding Channels",
      value: "ETH & UPI Contributions",
      desc: "Support creators with direct Ethereum transfers or fast UPI payments."
    },
    {
      icon: Megaphone,
      label: "Campaign Transparency",
      value: "Real-Time Tracking",
      desc: "Instant status updates on-chain with zero intermediary overhead."
    },
  ];

  return (
    <section className="relative w-full bg-transparent border-b border-rule overflow-hidden min-h-[85vh] flex items-center py-16 sm:py-20 lg:py-24">
      {/* Decorative ambient blur blooms to complement the global background */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-accent-bg rounded-full filter blur-3xl opacity-30 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-success-bg rounded-full filter blur-3xl opacity-20 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Editorial narrative stack */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-accent-bg border border-rule-strong rounded-full">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></div>
              <span className="text-accent font-semibold text-xs uppercase tracking-wider">Blockchain Crowd DApp</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink leading-none tracking-tight">
              Decentralized Crowdfunding for <span className="text-accent">Real Change</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-xl">
              Empower community projects and trigger direct backing. Launch campaigns with Ethereum smart contract escrow safety, or back approved initiatives using secure Web3 transactions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-4">
              {!account && (
                <button
                  onClick={connectWallet}
                  className="inline-flex items-center gap-2 px-6 h-11 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold text-sm shadow-sm transition-all duration-200"
                >
                  <Wallet size={16} aria-hidden="true" />
                  Connect Wallet
                </button>
              )}

              <button
                onClick={handleCreateCampaign}
                className="inline-flex items-center gap-2 px-6 h-11 bg-success hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all duration-200"
              >
                <Plus size={16} aria-hidden="true" />
                Start a Campaign
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 px-6 h-11 bg-paper-2 border border-rule-strong text-ink hover:bg-paper-3 rounded-lg font-bold text-sm transition-all duration-200"
              >
                <BarChart3 size={16} aria-hidden="true" />
                Explore Campaigns
              </button>
            </div>

            {/* Wallet Status */}
            {account && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-success-bg border border-success-border rounded-full text-xs font-semibold text-success">
                <ShieldCheck size={14} aria-hidden="true" />
                <span>Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
            )}
          </div>

          {/* Right Side: Visual stats card stack */}
          <div className="lg:col-span-5 space-y-4">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl p-5 shadow-sm hover:border-rule-strong transition-all duration-350 flex gap-4 items-start"
              >
                <div className="p-2.5 bg-paper-3 border border-rule rounded-lg text-accent shrink-0 flex items-center justify-center">
                  {idx === 1 ? (
                    <Image src="/ethereum-logo.svg" alt="ETH" width={16} height={16} aria-hidden="true" />
                  ) : (
                    <item.icon size={16} aria-hidden="true" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-ink-2 uppercase tracking-wider block">{item.label}</span>
                  <h3 className="text-sm font-bold text-ink">{item.value}</h3>
                  <p className="text-xs text-ink-2 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;