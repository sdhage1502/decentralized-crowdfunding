'use client';

import React from 'react';
import ShapeGrid from './ShapeGrid';

const TechBackground = ({ animated = true, showCircuitry = true }) => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
      {/* Grid Pattern & Radial Glows Wrapper */}
      <div 
        className="absolute inset-0 w-full h-full transition-all duration-300 bg-transparent"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 10%, var(--ambient-primary) 0%, var(--ambient-primary-fade) 45%, transparent 80%),
            radial-gradient(circle at 5% 0%, var(--ambient-secondary) 0%, var(--ambient-secondary-fade) 50%, transparent 75%),
            radial-gradient(circle at 95% 0%, var(--ambient-secondary) 0%, var(--ambient-secondary-fade) 50%, transparent 75%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%',
          backgroundPosition: 'center center',
        }}
      />

      {/* Interactive, Animated Shape Grid Background */}
      <div className="absolute inset-0 w-full h-full opacity-100 transition-opacity duration-300">
        <ShapeGrid
          borderColor="var(--color-grid-line)"
          hoverFillColor="rgba(var(--raw-primary), 0.25)"
          fadeColor="transparent"
          speed={0.4}
          squareSize={40}
          shape="square"
          hoverTrailAmount={5}
          direction="diagonal"
        />
      </div>

      {showCircuitry && (
        <>
          {/* Left Circuitry */}
          <div className="absolute left-0 top-[25%] w-[220px] sm:w-[340px] md:w-[440px] h-[65%] opacity-70 dark:opacity-50 transition-opacity duration-300">
            <svg width="100%" height="100%" viewBox="0 0 380 500" preserveAspectRatio="xMinYMid meet">
              {/* Static base circuit tracks */}
              <g className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" fill="none">
                <path d="M 0 100 L 140 100 L 190 150 L 280 150" />
                <path d="M 0 180 L 100 180 L 150 230 L 220 230" />
                <path d="M 0 250 L 120 250 L 170 300 L 320 300" />
                <path d="M 0 330 L 80 330 L 130 380 L 250 380" />
                <path d="M 0 410 L 160 410 L 210 460 L 300 460" />
              </g>

              {/* Active illuminated glowing paths */}
              {animated && (
                <g className="stroke-cyan-500/90 dark:stroke-cyan-400" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))' }}>
                  <path className="animated-pulse-path" d="M 0 100 L 140 100 L 190 150 L 280 150" />
                  <path className="animated-pulse-path" style={{ animationDelay: '2s' }} d="M 0 180 L 100 180 L 150 230 L 220 230" />
                  <path className="animated-pulse-path" style={{ animationDelay: '4.5s' }} d="M 0 250 L 120 250 L 170 300 L 320 300" />
                  <path className="animated-pulse-path" style={{ animationDelay: '1s' }} d="M 0 330 L 80 330 L 130 380 L 250 380" />
                  <path className="animated-pulse-path" style={{ animationDelay: '3.2s' }} d="M 0 410 L 160 410 L 210 460 L 300 460" />
                </g>
              )}

              {/* Terminal Nodes */}
              <g className="fill-slate-500 dark:fill-slate-400">
                <circle cx="280" cy="150" r="3.5" />
                <circle cx="220" cy="230" r="3.5" />
                <circle cx="320" cy="300" r="3.5" />
                <circle cx="250" cy="380" r="3.5" />
                <circle cx="300" cy="460" r="3.5" />
              </g>

              {/* Terminal Node Pulsing Halos */}
              {animated && (
                <g className="fill-cyan-400/35 dark:fill-cyan-400/30">
                  <circle cx="280" cy="150" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '280px 150px', animationDuration: '3s' }} />
                  <circle cx="320" cy="300" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '320px 300px', animationDuration: '3.5s' }} />
                  <circle cx="300" cy="460" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '300px 460px', animationDuration: '4s' }} />
                </g>
              )}
            </svg>
          </div>

          {/* Right Circuitry */}
          <div className="absolute right-0 top-[25%] w-[220px] sm:w-[340px] md:w-[440px] h-[65%] opacity-70 dark:opacity-50 transition-opacity duration-300">
            <svg width="100%" height="100%" viewBox="0 0 380 500" preserveAspectRatio="xMinYMid meet">
              {/* Static base circuit tracks */}
              <g className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" fill="none">
                <path d="M 380 80 L 260 80 L 210 130 L 150 130" />
                <path d="M 380 160 L 280 160 L 230 210 L 180 210" />
                <path d="M 380 240 L 240 240 L 190 290 L 120 290" />
                <path d="M 380 320 L 290 320 L 240 270 L 200 270" />
                <path d="M 380 400 L 250 400 L 200 450 L 130 450" />
              </g>

              {/* Active illuminated glowing paths */}
              {animated && (
                <g className="stroke-cyan-500/90 dark:stroke-cyan-400" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))' }}>
                  <path className="animated-pulse-path" style={{ animationDelay: '1.5s' }} d="M 380 80 L 260 80 L 210 130 L 150 130" />
                  <path className="animated-pulse-path" style={{ animationDelay: '3s' }} d="M 380 160 L 280 160 L 230 210 L 180 210" />
                  <path className="animated-pulse-path" style={{ animationDelay: '0.5s' }} d="M 380 240 L 240 240 L 190 290 L 120 290" />
                  <path className="animated-pulse-path" style={{ animationDelay: '4.8s' }} d="M 380 320 L 290 320 L 240 270 L 200 270" />
                  <path className="animated-pulse-path" style={{ animationDelay: '2.2s' }} d="M 380 400 L 250 400 L 200 450 L 130 450" />
                </g>
              )}

              {/* Terminal Nodes */}
              <g className="fill-slate-500 dark:fill-slate-400">
                <circle cx="150" cy="130" r="3.5" />
                <circle cx="180" cy="210" r="3.5" />
                <circle cx="120" cy="290" r="3.5" />
                <circle cx="200" cy="270" r="3.5" />
                <circle cx="130" cy="450" r="3.5" />
              </g>

              {/* Terminal Node Pulsing Halos */}
              {animated && (
                <g className="fill-cyan-400/35 dark:fill-cyan-400/30">
                  <circle cx="180" cy="210" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '180px 210px', animationDuration: '3.2s' }} />
                  <circle cx="120" cy="290" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '120px 290px', animationDuration: '4.2s' }} />
                  <circle cx="130" cy="450" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '130px 450px', animationDuration: '3.8s' }} />
                </g>
              )}
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default TechBackground;
