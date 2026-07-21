'use client';

import React from "react";
import HeroSection from "../components/ui/HeroSection";
import { useWeb3 } from "../context/Web3Context";
import AboutUsSection from "../components/about/AboutUsSection";
import Footer from "../components/ui/Footer";
const HomePage = () => {
  const { isLoading } = useWeb3();

  return (
    <div className="min-h-[100dvh]">
      <main>
        <HeroSection />
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] animate-scale-in">
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 border-2 border-black/10 dark:border-white/10 rounded-full" />
                <div className="absolute inset-0 border-2 border-ink dark:border-white rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="text-[0.9375rem] font-semibold text-ink dark:text-white tracking-tight">Connecting Wallet</p>
            </div>
          </div>
        )}
        <AboutUsSection />
        <Footer />
      </main>
    </div>
  );
};

export default HomePage;