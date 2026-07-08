"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wallet, Menu, X, Home, Info, GitFork, ExternalLink, Code } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";

const Header = () => {
  const { account, connectWallet, isLoading } = useWeb3();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveLink = (href) => pathname === href;

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
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group flex items-center" aria-label="CrowdFund Home">
            <div className="relative flex items-center">
              <Image
                src="/logo.png"
                alt="CrowdFund Logo"
                width={50}
                height={50}
                className="relative h-12 w-auto transform group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link
                  href="/"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActiveLink("/")
                      ? "text-primary bg-primary/8"
                      : "text-text-body hover:text-primary hover:bg-surface-alt"
                  }`}
                >
                  <Home size={16} />
                  Home
                </Link>
              </li>
              <li>
                <a
                  href={pathname === "/" ? "#about" : "/about-us"}
                  onClick={handleAboutClick}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActiveLink("/about-us")
                      ? "text-primary bg-primary/8"
                      : "text-text-body hover:text-primary hover:bg-surface-alt"
                  }`}
                >
                  <Info size={16} />
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://shreyash-portfoilo-website.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-text-body hover:text-primary hover:bg-surface-alt font-medium transition-all duration-200"
                >
                  <Code size={16} />
                  Portfolio
                  <ExternalLink size={12} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sdhage1502"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-text-body hover:text-primary hover:bg-surface-alt font-medium transition-all duration-200"
                >
                  <GitFork size={16} />
                  GitHub
                </a>
              </li>

              {/* Wallet Connect */}
              <li>
                {account ? (
                  <div className="flex items-center gap-2 bg-primary/8 px-4 py-2 rounded-lg border border-border text-primary font-semibold shadow-sm text-sm">
                    <Wallet size={16} />
                    <span className="font-mono">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2 bg-primary text-text-inverse font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Wallet size={16} />
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </button>
                )}
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-lg text-text-strong hover:bg-surface-alt transition-all duration-200"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <nav>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActiveLink("/")
                        ? "text-primary bg-primary/8"
                        : "text-text-body hover:text-primary hover:bg-surface-alt"
                    }`}
                  >
                    <Home size={18} />
                    Home
                  </Link>
                </li>
                <li>
                  <a
                    href={pathname === "/" ? "#about" : "/about-us"}
                    onClick={(e) => {
                      handleAboutClick(e);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActiveLink("/about-us")
                        ? "text-primary bg-primary/8"
                        : "text-text-body hover:text-primary hover:bg-surface-alt"
                    }`}
                  >
                    <Info size={18} />
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="https://shreyash-portfoilo-website.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-body hover:text-primary hover:bg-surface-alt font-medium transition-all duration-200"
                  >
                    <Code size={18} />
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/sdhage1502"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-body hover:text-primary hover:bg-surface-alt font-medium transition-all duration-200"
                  >
                    <GitFork size={18} />
                    GitHub
                  </a>
                </li>

                {/* Mobile Wallet Connect */}
                <li className="pt-2 border-t border-border">
                  {account ? (
                    <div className="flex items-center justify-center gap-3 bg-primary/8 px-4 py-3 rounded-lg border border-border text-primary font-semibold text-sm">
                      <Wallet size={18} />
                      <span className="font-mono">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        connectWallet();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary text-text-inverse font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 text-sm"
                    >
                      <Wallet size={18} />
                      {isLoading ? "Connecting..." : "Connect Wallet"}
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
