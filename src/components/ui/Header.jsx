"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code,
  ExternalLink,
  GitFork,
  Home,
  Info,
  Menu,
  Wallet,
  X,
  ArrowUpRight,
  Github,
  User,
} from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import useENS from "../../hooks/useENS";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { account, connectWallet, isLoading } = useWeb3();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveLink = (href) => pathname === href;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleAboutClick = (event) => {
    if (pathname === "/") {
      event.preventDefault();
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/about-us");
    }
  };

  const navItems = [
    {
      label: "Home",
      href: "/",
      Icon: Home,
      active: isActiveLink("/"),
      type: "link",
    },
    {
      label: "About",
      href: pathname === "/" ? "#about" : "/about-us",
      Icon: Info,
      active: isActiveLink("/about-us"),
      onClick: handleAboutClick,
      type: "anchor",
    },
  ];

  const { ensName } = useENS(account);

  const walletLabel = account
    ? (ensName || `${account.slice(0, 6)}...${account.slice(-4)}`)
    : isLoading
      ? "Connecting"
      : "Connect Wallet";

  const renderWallet = (variant = "desktop") => {
    const isDesktop = variant === "desktop";
    
    if (account) {
      return (
        <div className={`inline-flex items-center justify-center gap-2 px-4 rounded-full text-[0.8125rem] font-bold transition-all duration-300 border border-black/5 bg-black/5 text-ink shadow-sm hover:bg-black/10 dark:bg-white/10 dark:border-white/10 dark:text-white dark:hover:bg-white/20 ${isDesktop ? 'min-h-[2.5rem]' : 'w-full min-h-[3rem]'}`}>
          <Wallet size={16} aria-hidden="true" />
          <span className="font-mono text-[0.78rem] tracking-tight whitespace-nowrap">{walletLabel}</span>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={connectWallet}
        disabled={isLoading}
        aria-busy={isLoading}
        className={`inline-flex items-center justify-center gap-2 px-4 rounded-full text-[0.8125rem] font-semibold transition-all duration-300 border border-black/10 bg-white text-ink shadow-sm hover-lift-glow active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-[#111] dark:border-white/10 dark:text-white ${isDesktop ? 'min-h-[2.5rem]' : 'w-full min-h-[3rem]'}`}
      >
        <Wallet size={16} aria-hidden="true" />
        <span className="whitespace-nowrap">{walletLabel}</span>
      </button>
    );
  };

  return (
    <>
      <header className="sticky top-2 sm:top-4 z-50 w-full px-3 sm:px-6 pointer-events-none">
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(10rem,1fr)_auto_minmax(12rem,1fr)] items-center gap-4 w-[min(100%,72rem)] min-h-[3.5rem] md:min-h-[4rem] mx-auto py-2 px-2.5 sm:px-3 md:py-2 md:px-3 md:pl-4 border border-black/5 dark:border-white/10 rounded-full bg-white/85 dark:bg-[#0a0a0a]/80 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto backdrop-blur-md transition-all duration-300">
          <Link href="/" className="inline-flex items-center justify-self-start min-w-0 w-max h-12 md:h-[3.5rem] px-1 sm:px-2 rounded-full leading-none transition-all duration-300 hover:opacity-100 hover:-translate-y-0.5 active:translate-y-[1px] group" aria-label="DFund Home">
          <Image
            src="/logo.svg"
            alt="DFund Logo"
            width={120}
            height={40}
            className="block w-auto h-9 md:h-10 object-contain origin-left transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] dark:brightness-0 dark:invert"
            priority
          />
        </Link>

        <nav className="hidden lg:flex justify-center min-w-0" aria-label="Primary navigation">
          <ul className="flex items-center gap-1 p-1 border border-black/5 rounded-full bg-black/[0.02] dark:bg-white/[0.04] dark:border-white/10">
            {navItems.map(({ label, href, active, onClick, type }) => {
              const className = `inline-flex justify-center items-center gap-1.5 min-h-[2.25rem] px-4 rounded-full font-sans text-[0.8125rem] font-semibold transition-all duration-300 hover:-translate-y-[1px] active:translate-y-[1px] ${
                active 
                  ? "bg-white text-ink shadow-sm dark:bg-white/15 dark:text-white dark:shadow-none" 
                  : "text-muted hover:bg-black/5 hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`;

              if (type === "link") {
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className={className}
                      aria-current={active ? "page" : undefined}
                    >
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              }

              return (
                <li key={label}>
                  <a
                    href={href}
                    onClick={onClick}
                    className={className}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center justify-end gap-2.5 min-w-0">
          <div className="flex items-center gap-2 mr-2 text-muted">
            <a
              href="https://github.com/sdhage1502"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-black/5 hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white active:scale-95"
              aria-label="GitHub (opens in new tab)"
            >
              <Github size={18} strokeWidth={2} />
            </a>
            <a
              href="https://portfolio.shreyashdhage.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-black/5 hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white active:scale-95"
              aria-label="Developer Portfolio (opens in new tab)"
            >
              <User size={18} strokeWidth={2} />
            </a>
            <ThemeToggle />
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="group inline-flex items-center justify-center gap-2 min-h-[2.5rem] px-4 rounded-full bg-ink text-white text-[0.8125rem] font-semibold shadow-sm transition-all duration-300 hover:opacity-90 hover-lift-glow active:scale-95 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-slate-200"
          >
            <span className="whitespace-nowrap">Explore Campaigns</span>
            <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          {renderWallet("desktop")}
        </div>

        <div className="flex lg:hidden items-center justify-self-end gap-1.5 sm:gap-2">
          <ThemeToggle className="w-9 h-9 sm:w-10 sm:h-10" />
          <button
            onClick={() => router.push('/dashboard')}
            className="group inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-ink text-white text-[0.78rem] sm:text-[0.8125rem] font-semibold shadow-sm transition-all duration-300 hover:opacity-90 active:scale-95 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-slate-200"
          >
            <span className="whitespace-nowrap">Explore</span>
            <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 border border-black/5 dark:border-white/10 rounded-full bg-white/80 dark:bg-[#111827]/90 text-ink dark:text-white shadow-sm transition-all duration-300 hover:bg-white dark:hover:bg-[#1f2937] hover:shadow-md active:scale-95 z-50 shrink-0"
          >
            <div className="relative w-4 h-3.5 flex flex-col justify-center gap-1">
              <span className={`block w-full h-[2px] bg-ink dark:bg-white rounded-sm transition-all duration-300 origin-center ${isMobileMenuOpen ? 'translate-y-[0.3125rem] rotate-45' : ''}`}></span>
              <span className={`block w-full h-[2px] bg-ink dark:bg-white rounded-sm transition-all duration-300 origin-center ${isMobileMenuOpen ? 'opacity-0 -translate-x-2' : ''}`}></span>
              <span className={`block w-full h-[2px] bg-ink dark:bg-white rounded-sm transition-all duration-300 origin-center ${isMobileMenuOpen ? '-translate-y-[0.3125rem] -rotate-45' : ''}`}></span>
            </div>
          </button>
        </div>

        </div>
      </header>

      <div
        id="mobile-navigation"
        className={`lg:hidden fixed inset-x-0 top-0 bottom-0 pt-[calc(5.5rem+env(safe-area-inset-top))] px-4 sm:px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] overflow-y-auto bg-white/95 dark:bg-[#090d16]/95 shadow-2xl origin-top backdrop-blur-lg backdrop-saturate-150 transition-all duration-500 ease-out z-40 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"}`}
      >
        <nav aria-label="Mobile navigation">
          <ul className="grid gap-1">
            {navItems.map(({ label, href, Icon, active, onClick, type }, index) => {
              const className = `flex items-center gap-3 min-h-[3rem] py-3.5 px-5 rounded-lg text-ink dark:text-white text-lg font-medium no-underline transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 ${
                active ? "bg-black/5 dark:bg-white/10" : ""
              } ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;
              
              const handleClick = (event) => {
                if (onClick) onClick(event);
                setIsMobileMenuOpen(false);
              };

              if (type === "link") {
                return (
                  <li key={label} style={{ transitionDelay: `${index * 50}ms` }}>
                    <Link
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={className}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              }

              return (
                <li key={label} style={{ transitionDelay: `${index * 50}ms` }}>
                  <a
                    href={href}
                    onClick={handleClick}
                    className={className}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}

            <li className={`pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-3 transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '150ms' }}>
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="group flex items-center justify-center gap-2 w-full min-h-[3rem] py-3.5 px-6 rounded-full bg-ink text-white text-[0.9375rem] font-semibold shadow-sm transition-all duration-300 hover:bg-ink-2 active:scale-95 dark:bg-white dark:text-ink"
              >
                <span className="whitespace-nowrap">Explore Campaigns</span>
                <ArrowUpRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              {renderWallet("mobile")}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;

