'use client';
import React from 'react';
import { Rocket, BarChart3 } from 'lucide-react';

const PromotionalCard = () => (
  <section className="w-full px-6 py-16 sm:py-20 lg:py-24 bg-transparent">
    <div className="max-w-4xl mx-auto rounded-2xl border border-rule-strong bg-paper-2-glass backdrop-blur p-8 sm:p-12 text-center relative overflow-hidden">
      {/* Subtle decoration blur */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent-bg rounded-full filter blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-success-bg rounded-full filter blur-3xl opacity-35 pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="DApp Logo" className="h-10 w-auto opacity-95" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
          Fueling Ideas. <span className="text-accent block sm:inline">Transforming Lives.</span>
        </h2>
        
        <p className="text-sm sm:text-base text-ink-2 max-w-xl mx-auto leading-relaxed">
          Empower innovation and create social impact directly on the blockchain. Launch your campaign or become a vital backer today with decentralized safety.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <a
            href="/campaigns/create"
            className="inline-flex items-center gap-2 px-6 h-11 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold text-sm shadow-sm transition-all duration-200"
          >
            <Rocket size={16} aria-hidden="true" />
            Start a Campaign
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 h-11 bg-success hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all duration-200"
          >
            <BarChart3 size={16} aria-hidden="true" />
            Back a Campaign
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default PromotionalCard;
