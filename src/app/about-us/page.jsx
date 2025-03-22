'use client';

import React from 'react';

const About = () => {
    return (
        <section className="dark:bg-secondaryBlack inset-0 flex min-h-screen w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
            <div className="mx-auto w-container max-w-4xl px-5 py-16 lg:py-24">
                {/* Project Overview */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-heading text-blue-700 md:text-5xl mb-6">About Our Platform</h1>
                    <p className="text-lg font-normal leading-relaxed text-gray-700 md:text-xl mb-4">
                        Welcome to our <span className="font-bold">Decentralized Crowdfunding Platform</span>, where innovation meets transparency.
                        Built on <span className="font-bold">blockchain technology</span>, this platform empowers creators and backers by ensuring
                        <span className="font-bold"> secure, trustless transactions</span> through smart contracts.
                    </p>
                    <p className="text-lg font-normal leading-relaxed text-gray-700 md:text-xl">
                        Whether you're a <span className="font-bold">startup, artist, or social activist</span>, you can create a campaign, receive
                        <span className="font-bold"> crypto donations</span>, and <span className="font-bold">engage with supporters</span> worldwide. No intermediaries, no hidden fees—just direct funding.
                    </p>
                </div>

                {/* Key Features */}
                <div className="mb-16">
                    <h2 className="text-3xl font-heading text-blue-700 mb-8 text-center">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md border-2 border-gray-200">
                            <h3 className="text-xl font-bold text-[#3247C5] mb-2">🔗 Decentralized & Trustless</h3>
                            <p className="text-gray-700">Built on Ethereum smart contracts for secure transactions.</p>
                        </div>
                        <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md border-2 border-gray-200">
                            <h3 className="text-xl font-bold text-[#3247C5] mb-2">💰 Crypto-Based Funding</h3>
                            <p className="text-gray-700">Supports ETH donations directly to campaign owners.</p>
                        </div>
                        <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md border-2 border-gray-200">
                            <h3 className="text-xl font-bold text-[#3247C5] mb-2">📢 Campaign Transparency</h3>
                            <p className="text-gray-700">Funds are released only if backers approve.</p>
                        </div>
                        <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md border-2 border-gray-200">
                            <h3 className="text-xl font-bold text-[#3247C5] mb-2">🖼️ Engaging UI</h3>
                            <p className="text-gray-700">A modern design for an appealing experience.</p>
                        </div>
                    </div>
                </div>

                {/* About the Developer */}
                <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg border-2 border-gray-200">
                    <h2 className="text-3xl font-heading text-blue-700 mb-6 text-center">About the Developer</h2>
                    <div className="text-lg font-normal leading-relaxed text-gray-700">
                        <p className="mb-4">
                            Hey there! I'm <span className="font-bold">Kenn</span>, a passionate <span className="font-bold">Full-Stack Developer & Blockchain Enthusiast</span>.
                            I love building <span className="font-bold">secure, scalable applications</span> that push technology forward.
                            My expertise spans <span className="font-bold">React, Next.js, Tailwind CSS, Spring Boot</span>, and <span className="font-bold">blockchain development</span>.
                        </p>
                        <p>
                            I also have a strong interest in <span className="font-bold">banking & finance</span>, and my dream is to collaborate with
                            top firms like <span className="font-bold">Morgan Stanley</span>. This project is my way of combining tech with financial innovation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;