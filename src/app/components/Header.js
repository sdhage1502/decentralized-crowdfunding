"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useWeb3 } from "../../context/Web3Context";

const Header = () => {


    const { account, connectWallet, isLoading } = useWeb3();

            
      

    return (
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b-2 border-[#3247C5]">
            {/* Logo */}
            <div>
                <Link href="/">
                    <Image 
                        src="/logo.png" 
                        alt="Logo" 
                        width={80} 
                        height={80} 
                        className="h-16 w-auto"
                        priority
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav>
                <ul className="flex items-center gap-6 text-lg">
                    <li>
                        <Link href="/" className="text-gray-700 hover:text-[#3247C5] font-medium transition-colors">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/about-us" className="text-gray-700 hover:text-[#3247C5] font-medium transition-colors">
                            About
                        </Link>
                    </li>
                    <li>
                        <a 
                            href="https://github.com/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-700 hover:text-[#3247C5] font-medium transition-colors"
                        >
                            GitHub
                        </a>
                    </li>

            

                    {/* Wallet Connect Button */}
                    <li>
                        {account ? (
                            <div className="bg-gray-50 px-4 py-2 rounded border border-gray-200 text-[#3247C5] font-medium">
                                {`${account.slice(0, 6)}...${account.slice(-4)}`}
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={isLoading}
                                className="px-6 py-2 bg-[#3247C5] text-white font-medium rounded shadow-sm hover:bg-[#2a3aa1] transition-colors"
                            >
                                {isLoading ? "Connecting..." : "Connect Wallet"}
                            </button>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
