'use client';

import React from 'react';

export default function AnimatedGridLines() {
  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden opacity-60 dark:opacity-40"
      aria-hidden="true"
    >
      {/* Left side animated grid circuit streams */}
      <div className="absolute left-0 top-[25%] w-[220px] sm:w-[360px] md:w-[480px] h-[70%] transition-opacity duration-300">
        <svg width="100%" height="100%" viewBox="0 0 480 600" preserveAspectRatio="xMinYMid meet">
          {/* Static base grid connection tracks */}
          <g className="stroke-slate-400/40 dark:stroke-slate-700/60" strokeWidth="1" fill="none" strokeDasharray="4 4">
            <path d="M 0 112 L 168 112 L 224 168 L 336 168" />
            <path d="M 0 224 L 112 224 L 168 280 L 280 280" />
            <path d="M 0 336 L 224 336 L 280 392 L 392 392" />
            <path d="M 0 448 L 112 448 L 168 504 L 336 504" />
          </g>

          {/* Dynamic illuminated glowing energy pulses flowing along grid paths */}
          <g className="stroke-cyan-500/90 dark:stroke-cyan-400" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))' }}>
            <path className="animated-pulse-path" d="M 0 112 L 168 112 L 224 168 L 336 168" />
            <path className="animated-pulse-path" style={{ animationDelay: '2s' }} d="M 0 224 L 112 224 L 168 280 L 280 280" />
            <path className="animated-pulse-path" style={{ animationDelay: '4.5s' }} d="M 0 336 L 224 336 L 280 392 L 392 392" />
            <path className="animated-pulse-path" style={{ animationDelay: '1.2s' }} d="M 0 448 L 112 448 L 168 504 L 336 504" />
          </g>

          {/* Grid intersection glowing terminal nodes */}
          <g className="fill-cyan-500 dark:fill-cyan-400">
            <circle cx="336" cy="168" r="3.5" />
            <circle cx="280" cy="280" r="3.5" />
            <circle cx="392" cy="392" r="3.5" />
            <circle cx="336" cy="504" r="3.5" />
          </g>

          {/* Terminal node pulsing halos */}
          <g className="fill-cyan-400/30 dark:fill-cyan-400/25">
            <circle cx="336" cy="168" r="8" className="animate-ping origin-center" style={{ transformOrigin: '336px 168px', animationDuration: '3.2s' }} />
            <circle cx="392" cy="392" r="8" className="animate-ping origin-center" style={{ transformOrigin: '392px 392px', animationDuration: '4s' }} />
          </g>
        </svg>
      </div>

      {/* Right side animated grid circuit streams */}
      <div className="absolute right-0 top-[25%] w-[220px] sm:w-[360px] md:w-[480px] h-[70%] transition-opacity duration-300">
        <svg width="100%" height="100%" viewBox="0 0 480 600" preserveAspectRatio="xMinYMid meet">
          {/* Static base grid connection tracks */}
          <g className="stroke-slate-400/40 dark:stroke-slate-700/60" strokeWidth="1" fill="none" strokeDasharray="4 4">
            <path d="M 480 112 L 312 112 L 256 168 L 144 168" />
            <path d="M 480 224 L 368 224 L 312 280 L 200 280" />
            <path d="M 480 336 L 256 336 L 200 392 L 88 392" />
            <path d="M 480 448 L 336 448 L 280 504 L 168 504" />
          </g>

          {/* Dynamic illuminated glowing energy pulses flowing along grid paths */}
          <g className="stroke-cyan-500/90 dark:stroke-cyan-400" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))' }}>
            <path className="animated-pulse-path" style={{ animationDelay: '1.8s' }} d="M 480 112 L 312 112 L 256 168 L 144 168" />
            <path className="animated-pulse-path" style={{ animationDelay: '3.5s' }} d="M 480 224 L 368 224 L 312 280 L 200 280" />
            <path className="animated-pulse-path" style={{ animationDelay: '0.6s' }} d="M 480 336 L 256 336 L 200 392 L 88 392" />
            <path className="animated-pulse-path" style={{ animationDelay: '2.7s' }} d="M 480 448 L 336 448 L 280 504 L 168 504" />
          </g>

          {/* Grid intersection glowing terminal nodes */}
          <g className="fill-cyan-500 dark:fill-cyan-400">
            <circle cx="144" cy="168" r="3.5" />
            <circle cx="200" cy="280" r="3.5" />
            <circle cx="88" cy="392" r="3.5" />
            <circle cx="168" cy="504" r="3.5" />
          </g>

          {/* Terminal node pulsing halos */}
          <g className="fill-cyan-400/30 dark:fill-cyan-400/25">
            <circle cx="200" cy="280" r="8" className="animate-ping origin-center" style={{ transformOrigin: '200px 280px', animationDuration: '3.6s' }} />
            <circle cx="168" cy="504" r="8" className="animate-ping origin-center" style={{ transformOrigin: '168px 504px', animationDuration: '4.2s' }} />
          </g>
        </svg>
      </div>
    </div>
  );
}
