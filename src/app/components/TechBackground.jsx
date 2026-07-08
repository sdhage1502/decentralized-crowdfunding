'use client';

import React from 'react';

const TechBackground = ({ animated = false, showCircuitry = true }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Grid Pattern & Radial Glows Wrapper */}
      <div 
        className="absolute inset-0 w-full h-full transition-all duration-300
                   bg-[#f6f8fa] dark:bg-[#090d16]"
        style={{
          backgroundImage: `
            linear-gradient(var(--tech-grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--tech-grid-color) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, var(--tech-glow-center) 0%, var(--tech-glow-center-fade) 25%, transparent 65%),
            radial-gradient(circle at 10% 90%, var(--tech-glow-corner) 0%, var(--tech-glow-corner-fade) 35%, transparent 60%),
            radial-gradient(circle at 90% 10%, var(--tech-glow-corner) 0%, var(--tech-glow-corner-fade) 35%, transparent 60%)
          `,
          backgroundSize: '32px 32px, 32px 32px, 100% 100%, 100% 100%, 100% 100%',
          backgroundPosition: 'center center',
        }}
      />

      {showCircuitry && (
        <>
          {/* Left Circuitry */}
          <div className="absolute left-0 top-[20%] w-[200px] sm:w-[320px] md:w-[420px] h-[60%] opacity-40 dark:opacity-25 transition-opacity duration-300">
            <svg width="100%" height="100%" viewBox="0 0 380 500" preserveAspectRatio="xMinYMid meet">
              {/* Static base circuit tracks */}
              <g className="stroke-slate-300 dark:stroke-slate-700/80" strokeWidth="1.5" fill="none">
                <path d="M 0 100 L 140 100 L 190 150 L 280 150" />
                <path d="M 0 180 L 100 180 L 150 230 L 220 230" />
                <path d="M 0 250 L 120 250 L 170 300 L 320 300" />
                <path d="M 0 330 L 80 330 L 130 380 L 250 380" />
                <path d="M 0 410 L 160 410 L 210 460 L 300 460" />
              </g>

              {/* Active illuminated glowing paths */}
              {animated && (
                <g className="stroke-cyan-500/85 dark:stroke-cyan-400/90" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 5px rgba(6, 182, 212, 0.7))' }}>
                  <path className="animated-pulse-path" d="M 0 100 L 140 100 L 190 150 L 280 150" />
                  <path className="animated-pulse-path" style={{ animationDelay: '2s' }} d="M 0 180 L 100 180 L 150 230 L 220 230" />
                  <path className="animated-pulse-path" style={{ animationDelay: '4.5s' }} d="M 0 250 L 120 250 L 170 300 L 320 300" />
                  <path className="animated-pulse-path" style={{ animationDelay: '1s' }} d="M 0 330 L 80 330 L 130 380 L 250 380" />
                  <path className="animated-pulse-path" style={{ animationDelay: '3.2s' }} d="M 0 410 L 160 410 L 210 460 L 300 460" />
                </g>
              )}

              {/* Terminal Nodes */}
              <g className="fill-slate-400 dark:fill-slate-600">
                <circle cx="280" cy="150" r="3.5" />
                <circle cx="220" cy="230" r="3.5" />
                <circle cx="320" cy="300" r="3.5" />
                <circle cx="250" cy="380" r="3.5" />
                <circle cx="300" cy="460" r="3.5" />
              </g>

              {/* Terminal Node Pulsing Halos */}
              {animated && (
                <g className="fill-cyan-400/25 dark:fill-cyan-400/20">
                  <circle cx="280" cy="150" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '280px 150px', animationDuration: '3s' }} />
                  <circle cx="320" cy="300" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '320px 300px', animationDuration: '3.5s' }} />
                  <circle cx="300" cy="460" r="7.5" className="animate-ping origin-center" style={{ transformOrigin: '300px 460px', animationDuration: '4s' }} />
                </g>
              )}
            </svg>
          </div>

          {/* Right Circuitry */}
          <div className="absolute right-0 top-[20%] w-[200px] sm:w-[320px] md:w-[420px] h-[60%] opacity-40 dark:opacity-25 transition-opacity duration-300">
            <svg width="100%" height="100%" viewBox="0 0 380 500" preserveAspectRatio="xMinYMid meet">
              {/* Static base circuit tracks */}
              <g className="stroke-slate-300 dark:stroke-slate-700/80" strokeWidth="1.5" fill="none">
                <path d="M 380 80 L 260 80 L 210 130 L 150 130" />
                <path d="M 380 160 L 280 160 L 230 210 L 180 210" />
                <path d="M 380 240 L 240 240 L 190 290 L 120 290" />
                <path d="M 380 320 L 290 320 L 240 270 L 200 270" />
                <path d="M 380 400 L 250 400 L 200 450 L 130 450" />
              </g>

              {/* Active illuminated glowing paths */}
              {animated && (
                <g className="stroke-cyan-500/85 dark:stroke-cyan-400/90" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 5px rgba(6, 182, 212, 0.7))' }}>
                  <path className="animated-pulse-path" style={{ animationDelay: '1.5s' }} d="M 380 80 L 260 80 L 210 130 L 150 130" />
                  <path className="animated-pulse-path" style={{ animationDelay: '3s' }} d="M 380 160 L 280 160 L 230 210 L 180 210" />
                  <path className="animated-pulse-path" style={{ animationDelay: '0.5s' }} d="M 380 240 L 240 240 L 190 290 L 120 290" />
                  <path className="animated-pulse-path" style={{ animationDelay: '4.8s' }} d="M 380 320 L 290 320 L 240 270 L 200 270" />
                  <path className="animated-pulse-path" style={{ animationDelay: '2.2s' }} d="M 380 400 L 250 400 L 200 450 L 130 450" />
                </g>
              )}

              {/* Terminal Nodes */}
              <g className="fill-slate-400 dark:fill-slate-600">
                <circle cx="150" cy="130" r="3.5" />
                <circle cx="180" cy="210" r="3.5" />
                <circle cx="120" cy="290" r="3.5" />
                <circle cx="200" cy="270" r="3.5" />
                <circle cx="130" cy="450" r="3.5" />
              </g>

              {/* Terminal Node Pulsing Halos */}
              {animated && (
                <g className="fill-cyan-400/25 dark:fill-cyan-400/20">
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
