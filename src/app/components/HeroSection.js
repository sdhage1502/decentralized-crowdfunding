'use client';

import React from "react";
import { useWeb3 } from '../../context/Web3Context';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
    const { account, connectWallet } = useWeb3();
    const router = useRouter();

    const handleCreateCampaign = () => {
        if (!account) {
            connectWallet();
        } else {
            router.push('/campaigns/create');
        }
    };

    return (
        <section className="dark:bg-secondaryBlack inset-0 flex min-h-[90vh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
            <div className="mx-auto w-container max-w-full px-5 py-[100px] text-center lg:py-[130px]">
                <h1 className="text-4xl font-heading text-blue-700 md:text-5xl lg:text-6xl">
                    Decentralized Crowdfunding Platform
                </h1>
                <p className="my-8 mt-6 text-lg font-normal leading-relaxed text-gray-700 md:text-xl lg:text-2xl lg:leading-relaxed">
                    Empowering secure and transparent fundraising through blockchain technology.
                    Launch campaigns, set goals, and build trust with contributors worldwide.
                </p>
                <div className="flex justify-center items-center gap-6 mt-10">
                    {!account && (
                        <button
                            onClick={connectWallet}
                            className="h-[55px] px-8 bg-[#3247C5] text-white rounded-lg text-lg font-bold shadow-md hover:bg-[#2a3aa1] transition-colors"
                        >
                            Connect Wallet
                        </button>
                    )}
                    <button
                        onClick={handleCreateCampaign}
                        className="h-[55px] px-8 bg-[#28A745] text-white rounded-lg text-lg font-bold shadow-md hover:bg-[#218838] transition-colors"
                    >
                        Create Campaign
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="h-[55px] px-8 bg-[#FFC107] text-black rounded-lg text-lg font-bold shadow-md hover:bg-[#E0A800] transition-colors"
                    >
                        Dashboard
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
