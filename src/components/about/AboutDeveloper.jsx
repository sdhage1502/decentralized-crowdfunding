'use client';

import { ExternalLink } from 'lucide-react';

const AboutDeveloper = () => {
  return (
    <div className="bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-strong tracking-tight">
          Meet the Developer
        </h2>
        <div className="w-12 h-1 bg-accent mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Center Browser Mockup Container */}
      <div className="max-w-5xl mx-auto flex flex-col h-[min(72dvh,600px)] min-h-[360px] sm:min-h-[460px] w-full rounded-2xl border border-border bg-surface-alt overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        {/* Browser Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-surface border-b border-border select-none">
          {/* macOS Window Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block"></span>
          </div>
          
          {/* Address Bar */}
          <div className="flex min-w-0 flex-1 items-center justify-center bg-surface-alt px-3 py-1 rounded-lg border border-border text-[11px] text-text-muted font-medium max-w-md mx-2 sm:mx-4 select-all truncate">
            portfolio.shreyashdhage.in
          </div>

          {/* External Link Action */}
          <a 
            href="https://portfolio.shreyashdhage.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:text-primary hover:bg-surface-alt transition-colors shrink-0"
            aria-label="Open portfolio in new tab"
          >
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Iframe Live View Container */}
        <div className="flex-1 bg-surface relative overflow-hidden">
          <iframe 
            src="https://portfolio.shreyashdhage.in" 
            title="Shreyash Dhage Portfolio Live View"
            className="absolute inset-0 w-full h-full border-none bg-surface"
            sandbox="allow-scripts allow-same-origin allow-popups"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutDeveloper;