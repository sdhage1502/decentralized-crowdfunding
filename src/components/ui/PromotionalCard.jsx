'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Rocket, BarChart3 } from 'lucide-react';

const PromotionalCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 py-10 sm:py-12 bg-transparent">
      <div
        ref={cardRef}
        className={`max-w-4xl mx-auto rounded-2xl border border-rule-strong bg-paper-2-glass backdrop-blur p-5 sm:p-8 text-center relative overflow-hidden transition-all duration-700 [transition-timing-function:var(--ease-out)] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Subtle decoration blur */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent-bg rounded-full filter blur-3xl opacity-40 pointer-events-none animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-success-bg rounded-full filter blur-3xl opacity-35 pointer-events-none animate-float" style={{ animationDelay: '3s' }}></div>

        <div className="relative z-10 space-y-6">
          <div className="mb-6 flex justify-center">
            <Image src="/logo.svg" alt="DFund Logo" width={160} height={80} className="h-16 sm:h-20 w-auto object-contain opacity-95 dark:brightness-0 dark:invert" priority />
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
            Your support goes <span className="text-accent block sm:inline">further here.</span>
          </h2>
          
          <p className="text-sm sm:text-base text-ink-2 max-w-xl mx-auto leading-relaxed">
            Launch a campaign in minutes or back one that matters to you. Every transaction is on-chain - transparent, verifiable, direct.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <a
              href="/campaigns/create"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 h-11 whitespace-nowrap bg-accent hover:bg-accent-hover text-white rounded-lg font-bold text-sm shadow-sm transition-all duration-200 btn-active-feedback"
            >
              <Rocket size={16} aria-hidden="true" />
              Start a Campaign
            </a>
            <a
              href="/dashboard"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 h-11 whitespace-nowrap bg-success hover:bg-success/90 text-white rounded-lg font-bold text-sm shadow-sm transition-all duration-200 btn-active-feedback"
            >
              <BarChart3 size={16} aria-hidden="true" />
              Back a Campaign
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalCard;

