'use client';

import {
  Sparkles,
  Shield,
  Wallet,
  TrendingUp,
  Eye,
  CheckCircle,
  Share2,
  FileText,
  Search,
  Monitor,
  Database,
  Rocket,
} from 'lucide-react';

const etheriumLogo = '/ethereum-logo.svg';

const projectStats = [
  { icon: Shield, label: 'Security Features', value: 'Multi-layer' },
  { icon: Wallet, label: 'Crypto Integration', value: 'MetaMask & UPI' },
  { icon: TrendingUp, label: 'Performance Gain', value: '40%' },
  { icon: Monitor, label: 'Components Built', value: '15+' },
];

const projectFeatures = [
  { icon: Shield, title: 'Decentralized & Trustless', description: 'Ethereum smart contracts ensure transparency' },
  { icon: Wallet, title: 'Crypto Funding (ETH)', description: 'Secure contributions using MetaMask' },
  { icon: TrendingUp, title: 'Real-time Tracking', description: 'Live updates and contribution monitoring' },
  { icon: Eye, title: 'Campaign Discovery', description: 'Search and explore detailed campaign stats' },
  { icon: CheckCircle, title: 'Admin Approval', description: 'Only verified campaigns go live' },
  { icon: Share2, title: 'Social Sharing', description: 'Shareable links for social media' },
];

const projectWorkflow = [
  { step: '1', title: 'Create Campaign', description: 'Users enter campaign details.', details: 'Data saved on-chain and off-chain.', icon: FileText },
  { step: '2', title: 'Admin Review', description: 'Approved before going live.', details: 'Ensures legitimacy.', icon: CheckCircle },
  { step: '3', title: 'Public Discovery', description: 'Search, filter, view stats.', details: 'Engage with live campaigns.', icon: Search },
  { step: '4', title: 'Contribute', description: 'Donate via ETH or UPI.', details: 'On-chain or QR code modal.', icon: etheriumLogo },
  { step: '5', title: 'Real-time Updates', description: 'Live sync with Firebase.', details: 'Instant visual updates.', icon: TrendingUp },
];

const techStack = [
  { category: 'Smart Contracts', technologies: ['Solidity', 'Hardhat'], icon: Shield },
  { category: 'Frontend', technologies: ['Next.js', 'React', 'Tailwind CSS'], icon: Monitor },
  { category: 'Wallet Integration', technologies: ['MetaMask', 'Ethers.js'], icon: Wallet },
  { category: 'Backend/DB', technologies: ['Firestore', 'REST APIs'], icon: Database },
  { category: 'Deployment', technologies: ['Vercel', 'GitHub Actions'], icon: Rocket },
];

const AboutProject = () => (
  <section className="max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:py-24 bg-transparent">
    <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-bg border border-rule-strong rounded-full">
        <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Blockchain Crowdfunding DApp</span>
      </div>
      
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink leading-tight tracking-tight">
        Crowdfunding with <span className="text-accent block md:inline">Decentralized Technology</span>
      </h1>
      
      <p className="text-base sm:text-lg text-ink-2 leading-relaxed">
        Build, launch, and manage fundraising campaigns directly on Ethereum. Secure. Transparent. Empowering.
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
      {projectStats.map((stat, idx) => (
        <div key={idx} className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule flex flex-col items-start hover:border-rule-strong transition-all duration-300">
          <div className="p-2.5 bg-paper-3 border border-rule rounded-lg text-accent mb-4">
            <stat.icon size={20} aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-ink tracking-tight">{stat.value}</div>
          <div className="text-xs font-semibold text-ink-2 uppercase tracking-wider mt-1">{stat.label}</div>
        </div>
      ))}
    </div>

    {/* Features */}
    <div className="mb-20">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-ink text-center tracking-tight mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectFeatures.map((feature, idx) => (
          <div key={idx} className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule hover:border-rule-strong transition-all duration-300">
            <div className="p-2.5 bg-paper-3 border border-rule rounded-lg text-accent mb-4 inline-flex">
              <feature.icon size={22} aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">{feature.title}</h3>
            <p className="text-sm text-ink-2 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Workflow */}
    <div className="mb-20">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-ink text-center tracking-tight mb-12">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {projectWorkflow.map((step, idx) => (
          <div key={idx} className="relative bg-paper-2-glass backdrop-blur border border-rule p-5 rounded-xl flex flex-col justify-between hover:border-rule-strong transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-full bg-accent-bg border border-rule-strong flex items-center justify-center text-accent text-xs font-bold">
                  {step.step}
                </div>
                <div className="text-ink-2">
                  {typeof step.icon === 'string' ? (
                    <img src={step.icon} className="w-5 h-5 opacity-70" alt="" aria-hidden="true" />
                  ) : (
                    <step.icon size={20} aria-hidden="true" />
                  )}
                </div>
              </div>
              <h3 className="text-sm font-bold text-ink mb-1">{step.title}</h3>
              <p className="text-xs text-ink-2 leading-relaxed mb-4">{step.description}</p>
            </div>
            <div className="pt-3 border-t border-rule text-[10px] text-ink-2 font-semibold uppercase tracking-wider">
              {step.details}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Tech Stack */}
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-ink text-center tracking-tight mb-12">Technology Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techStack.map((tech, idx) => (
          <div key={idx} className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl p-6 hover:border-rule-strong transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-paper-3 border border-rule rounded-lg text-accent">
                <tech.icon size={18} aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-ink">{tech.category}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tech.technologies.map((t, i) => (
                <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded-md bg-paper-3 border border-rule text-ink-2">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutProject;
