import React from 'react';
import  logo from "../../..//public/crowdfunding.svg"
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 max-w-7xl">
        <div className="flex items-center">
            <Link href="/" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="relative h-16 w-auto transform group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </Link>
          </div>

        {/* Navigation Links */}
        <nav className="flex space-x-8 mb-6 md:mb-0 text-sm md:text-base">
          <a href="/" className="hover:text-indigo-500 transition">
            Home
          </a>
          <a href="/about-us" className="hover:text-indigo-500 transition">
            About
          </a>
          <a href="/campaigns/create" className="hover:text-indigo-500 transition">
            Campaigns
          </a>
          <a href="https://github.com/sdhage1502/decentralized-crowdfunding" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition">
            GitHub
          </a>
          <a href="/dashboard" className="hover:text-indigo-500 transition">
            Dashboard
          </a>
        </nav>

        {/* Social & Contact */}
        <div className="text-sm md:text-base space-x-4">
          <a href="mailto:sdhage1502@gmail.com" className="hover:text-indigo-500 transition">
            Contact
          </a>
          <a href="https://www.linkedin.com/in/shreyashdhage/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Decentralized Crowdfunding DApp — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
