'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    const currentRef = footerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

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

  const linkClass = "text-muted hover:text-ink transition-colors duration-200 dark:hover:text-white";

  return (
    <footer
      ref={footerRef}
      className={`relative bg-surface border-t border-rule py-12 lg:py-16 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Soft gradient transition from page background into footer surface */}
      <div className="absolute inset-x-0 -top-16 h-16 bg-gradient-to-b from-transparent to-surface pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link href="/" className="flex items-center group transition-transform duration-200 ease-out active:scale-95 w-max">
              <Image 
                src="/logo.svg" 
                alt="DFund Logo" 
                width={120}
                height={40}
                className="h-9 md:h-10 w-auto object-contain origin-left dark:invert-0"
                priority
              />
            </Link>
            <p className="text-[0.9375rem] text-muted max-w-sm font-medium leading-relaxed">
              Empowering creators and backers through decentralized, trustless crowdfunding on the Ethereum blockchain.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://github.com/sdhage1502" target="_blank" rel="noopener noreferrer" className="p-2 -ml-2 text-muted hover:text-ink dark:hover:text-white transition-colors" aria-label="GitHub">
                <Github size={20} strokeWidth={2} />
              </a>
              <a href="https://www.linkedin.com/in/shreyashdhage" target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-ink dark:hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} strokeWidth={2} />
              </a>
              <a href="mailto:sdhage1502@gmail.com" className="p-2 text-muted hover:text-ink dark:hover:text-white transition-colors" aria-label="Email">
                <Mail size={20} strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Links Group 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-ink dark:text-white tracking-tight">Platform</h3>
            <nav className="flex flex-col gap-3 text-[0.9375rem] font-medium">
              <Link href="/" className={linkClass}>Home</Link>
              <Link href="/dashboard" className={linkClass}>Dashboard</Link>
              <a 
                href={pathname === "/" ? "#about" : "/about-us"} 
                onClick={handleAboutClick}
                className={`cursor-pointer ${linkClass}`}
              >
                About Us
              </a>
              <Link href="/campaigns/create" className={linkClass}>Start a Campaign</Link>
            </nav>
          </div>

          {/* Links Group 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-ink dark:text-white tracking-tight">Resources</h3>
            <nav className="flex flex-col gap-3 text-[0.9375rem] font-medium">
              <a 
                href="https://portfolio.shreyashdhage.in/" 
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 ${linkClass}`}
              >
                Developer Portfolio
                <ExternalLink size={14} className="opacity-50" aria-hidden="true" />
              </a>
              <a href="#" className={linkClass}>Documentation</a>
              <a href="#" className={linkClass}>Terms of Service</a>
              <a href="#" className={linkClass}>Privacy Policy</a>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            <span className="text-[0.8125rem] font-semibold text-muted">All systems operational</span>
          </div>
          <p className="text-[0.8125rem] font-medium text-muted">
            &copy; {new Date().getFullYear()} Decentralized Crowdfunding. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
