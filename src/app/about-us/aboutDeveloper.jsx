'use client';

import { Briefcase, Code, Download, Github, Linkedin, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

const AboutDeveloper = () => {
  return (
    <div className="bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Meet the Developer
        </h2>
        <div className="w-12 h-1 bg-accent mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-paper-2-glass backdrop-blur border border-rule rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:shadow-md">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-6 border-b border-rule">
          <div className="relative">
            <div className="bg-accent-bg border border-rule-strong p-4 rounded-2xl shadow-sm text-accent">
              <Code size={32} aria-hidden="true" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h3 className="text-2xl font-extrabold text-ink leading-none">Shreyash Dhage</h3>
            <p className="text-sm text-accent font-semibold uppercase tracking-wider">Full Stack Developer</p>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed max-w-2xl">
              Full-stack developer with expertise in web and blockchain technologies. Led innovative projects at Hexadecimal Software, delivering scalable, high-performance solutions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg transition-all duration-200 font-bold text-xs shadow-sm"
            href="/Shreyash_Dhage_Resume.pdf"
            download
            aria-label="Download Resume"
          >
            <Download size={14} aria-hidden="true" />
            Download Resume
          </a>
          <a
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-paper-3 border border-rule-strong hover:bg-paper-2 text-ink rounded-lg transition-all duration-200 font-bold text-xs"
            href="https://shreyash-portfoilo-website.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Portfolio (opens in a new tab)"
          >
            <Code size={14} aria-hidden="true" />
            Visit Portfolio
            <ExternalLink size={10} className="opacity-60" aria-hidden="true" />
          </a>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-paper-3-glass backdrop-blur-sm border border-rule rounded-xl p-5 mb-8 text-xs font-semibold text-ink">
          <div className="flex items-center gap-2.5">
            <MapPin size={16} className="text-accent" aria-hidden="true" />
            <span>Pune, India</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone size={16} className="text-accent" aria-hidden="true" />
            <span>+91 8999760729</span>
          </div>
          <div className="flex items-center gap-2.5 sm:col-span-2 lg:col-span-1">
            <Mail size={16} className="text-accent" aria-hidden="true" />
            <span className="break-all">sdhage1502@gmail.com</span>
          </div>
          <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-1 pt-2 sm:pt-0">
            <a
              href="https://www.linkedin.com/in/shreyashdhage"
              className="flex items-center gap-1.5 text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
            >
              <Linkedin size={16} aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/sdhage1502"
              className="flex items-center gap-1.5 text-ink-2 hover:text-ink transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
            >
              <Github size={16} aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-accent" aria-hidden="true" />
            <h3 className="text-sm font-extrabold text-ink tracking-tight">Recent Experience</h3>
          </div>
          <div className="bg-paper-3-glass backdrop-blur-sm border border-rule rounded-xl p-5">
            <h4 className="font-bold text-xs text-ink">Software Developer Intern</h4>
            <p className="text-[10px] text-accent font-semibold mt-0.5">Hexadecimal Software Pvt. Ltd.</p>
            <p className="text-[10px] text-ink-2 mt-1.5">Oct 2024 – Apr 2025 | Remote</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutDeveloper;