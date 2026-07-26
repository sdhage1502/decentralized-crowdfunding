'use client';

import React from "react";
import { useWeb3 } from '../../context/Web3Context';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, BarChart3, Megaphone, Link, Users, ShieldCheck, HeartHandshake, ArrowUpRight } from 'lucide-react';
import Image from "next/image";
import useENS from '../../hooks/useENS';

const HeroSection = () => {
  const { account, connectWallet } = useWeb3();
  const { ensName } = useENS(account);
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
      label: "Zero Intermediaries",
      value: "Ethereum Smart Contracts",
      desc: "All campaigns are registered and audited on the blockchain ledger."
    },
    {
      icon: HeartHandshake,
      label: "Pay with ETH or UPI",
      value: "ETH & UPI Contributions",
      desc: "Support creators with direct Ethereum transfers or fast UPI payments."
    },
    {
      icon: Megaphone,
      label: "Live Progress Tracking",
      value: "Real-Time Tracking",
      desc: "Instant status updates on-chain with zero intermediary overhead."
    },
  ];

  return (
    <section className="relative w-full bg-transparent overflow-hidden min-h-[calc(100dvh-5rem)] flex items-center py-14 sm:py-16 lg:py-20 -mt-20 sm:-mt-24 pt-28 sm:pt-36">
      
      {/* Hero ambient lighting — spreads to the very top edge behind the glass header */}
      <div className="absolute inset-x-0 -top-24 sm:-top-36 bottom-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-[15%] -left-[10%] w-[65%] h-[65%] rounded-full bg-blue-500/[0.14] dark:bg-blue-400/[0.16] blur-[130px]" />
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/[0.12] dark:bg-indigo-400/[0.14] blur-[130px]" />
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] rounded-full bg-teal-400/[0.08] dark:bg-teal-500/[0.08] blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8 pt-14 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-ink leading-[1.1] tracking-tight animate-fade-slide-in">
              Fund what matters, <br className="hidden sm:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-ink to-ink-3 dark:from-white dark:to-white/60">secured by Ethereum</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl animate-fade-slide-in stagger-delay-1 font-medium">
              Back real causes. Every contribution goes directly to creators—no middlemen, no hidden fees, no trust required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-slide-in stagger-delay-2">
              {!account && (
                <button
                  onClick={connectWallet}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-8 h-14 whitespace-nowrap bg-ink hover:bg-ink-2 text-white rounded-full font-bold text-[0.9375rem] tracking-tight shadow-md transition-all duration-300 hover-lift-glow active:scale-95 dark:bg-white dark:text-[#090d16] dark:hover:bg-slate-200"
                >
                  <Wallet size={18} aria-hidden="true" />
                  Connect Wallet
                </button>
              )}

              <button
                onClick={handleCreateCampaign}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-8 h-14 whitespace-nowrap bg-white text-ink border border-black/10 rounded-full font-bold text-[0.9375rem] tracking-tight shadow-sm transition-all duration-300 hover:border-black/20 hover:bg-black/[0.02] active:scale-95 dark:bg-white/10 dark:border-white/15 dark:text-white dark:hover:bg-white/20"
              >
                Start a Campaign
                <ArrowUpRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {account && (
              <div className="inline-flex max-w-full items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-blue-400/10 border border-primary/30 dark:border-blue-400/20 rounded-full text-xs font-bold text-primary-hover dark:text-blue-400 animate-scale-in">
                <ShieldCheck size={14} aria-hidden="true" />
                <span className="truncate">Connected: {ensName || `${account.slice(0, 6)}...${account.slice(-4)}`}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4 pt-14">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-white/60 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-black/10 dark:hover:border-white/20 transition-all duration-300 flex gap-5 items-start animate-fade-slide-in"
                style={{ animationDelay: `${(idx + 3) * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                <div className="p-3.5 bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 rounded-xl text-ink dark:text-white shrink-0 flex items-center justify-center shadow-sm">
                  {idx === 1 ? (
                    <Image src="/ethereum-logo.svg" alt="ETH" width={22} height={22} aria-hidden="true" className="dark:invert" />
                  ) : (
                    <item.icon size={22} aria-hidden="true" />
                  )}
                </div>
                <div className="space-y-1.5 min-w-0 pt-0.5">
                  <h3 className="text-base font-bold text-ink dark:text-white leading-snug break-words tracking-tight">{item.value}</h3>
                  <p className="text-[0.9375rem] text-muted leading-relaxed break-words font-medium">{item.desc}</p>
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
