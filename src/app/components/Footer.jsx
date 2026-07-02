'use client';
import React from 'react';
import logo from "../../../public/crowdfunding.svg";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleAboutClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/about-us");
    }
  };

  return (
    <footer className="bg-paper-2-glass backdrop-blur border-t border-rule-strong py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src={logo} 
                alt="Crowdfunding Logo" 
                width={20} 
                height={20}
                className="h-5 w-auto"
              />
              <span className="font-bold text-sm text-ink">
                Crowd<span className="text-accent">Fund</span>
              </span>
            </Link>
            
            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center gap-5 text-xs font-semibold text-ink-2">
              <Link href="/" className="hover:text-accent transition-colors duration-250">
                Home
              </Link>
              <a 
                href={pathname === "/" ? "#about" : "/about-us"} 
                onClick={handleAboutClick}
                className="hover:text-accent transition-colors duration-250 cursor-pointer"
              >
                About
              </a>
              <Link href="/dashboard" className="hover:text-accent transition-colors duration-250">
                Dashboard
              </Link>
              <a 
                href="https://github.com/sdhage1502" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors duration-250 inline-flex items-center gap-1"
                aria-label="GitHub (opens in a new tab)"
              >
                GitHub
                <ExternalLink size={10} className="opacity-60" aria-hidden="true" />
              </a>
              <a 
                href="https://shreyash-portfoilo-website.vercel.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors duration-250 inline-flex items-center gap-1"
                aria-label="Portfolio (opens in a new tab)"
              >
                Portfolio
                <ExternalLink size={10} className="opacity-60" aria-hidden="true" />
              </a>
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs font-semibold text-ink-2 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-4">
              <a href="mailto:sdhage1502@gmail.com" className="hover:text-accent transition-colors duration-250">
                Contact
              </a>
              <a 
                href="https://www.linkedin.com/in/shreyashdhage" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors duration-250 inline-flex items-center gap-1"
                aria-label="LinkedIn (opens in a new tab)"
              >
                LinkedIn
                <ExternalLink size={10} className="opacity-60" aria-hidden="true" />
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-ink-2 opacity-85 text-[11px] sm:text-xs">
              © {new Date().getFullYear()} Decentralized Crowdfunding DApp — All rights reserved.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;