'use client';

import {
  Sparkles, Shield, Wallet, TrendingUp, Eye, CheckCircle, Share2, FileText,
  Search, Monitor, Database, Rocket, Cpu, Network, Globe, Code
} from 'lucide-react';
import Image from 'next/image';
import { createSafeMetrics } from '../../utils/metricsValidation.js';
import MetricsErrorBoundary from './MetricsErrorBoundary.jsx';

const etheriumLogo = '/ethereum-logo.svg';

// Raw meaningful metrics data (will be validated by createSafeMetrics)
const rawProjectStats = [
  { icon: Eye, label: 'Full Transparency', value: '100% On-Chain Verification' },
  { icon: Shield, label: 'Smart Contract Security', value: 'MetaMask Protected' },
  { icon: Network, label: 'Decentralized Resilience', value: 'No Platform Risk' },
  { icon: Globe, label: 'Global Accessibility', value: 'ETH + UPI Integration' },
];

// Validated metrics with fallback handling
const projectStats = createSafeMetrics(rawProjectStats, {
  metricTypes: ['transparency', 'security', 'decentralization', 'accessibility']
});

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
  { step: '2', title: 'Admin Review', description: 'Approved before going live.', details: 'Verified before going live.', icon: CheckCircle },
  { step: '3', title: 'Public Discovery', description: 'Search, filter, view stats.', details: 'Find campaigns that matter.', icon: Search },
  { step: '4', title: 'Contribute', description: 'Donate via ETH or UPI.', details: 'On-chain or QR code modal.', icon: etheriumLogo },
  { step: '5', title: 'Real-time Updates', description: 'Live sync with Firebase.', details: 'Instant visual updates.', icon: TrendingUp },
];

const techStack = [
  { 
    category: 'Smart Contracts', 
    icon: Shield, 
    technologies: [
      { name: 'Solidity', icon: Code },
      { name: 'Hardhat', icon: Cpu }
    ] 
  },
  { 
    category: 'Frontend', 
    icon: Monitor, 
    technologies: [
      { name: 'Next.js', icon: Globe },
      { name: 'React', icon: Cpu },
      { name: 'Tailwind CSS', icon: Sparkles }
    ] 
  },
  { 
    category: 'Wallet Integration', 
    icon: Wallet, 
    technologies: [
      { name: 'MetaMask', icon: Wallet },
      { name: 'Ethers.js', icon: Network }
    ] 
  },
  { 
    category: 'Backend/DB', 
    icon: Database, 
    technologies: [
      { name: 'Firestore', icon: Database },
      { name: 'REST APIs', icon: Cpu }
    ] 
  },
  { 
    category: 'Deployment', 
    icon: Rocket, 
    technologies: [
      { name: 'Vercel', icon: Rocket },
      { name: 'GitHub Actions', icon: Rocket }
    ] 
  },
];

const AboutProject = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-transparent">
    <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/8 border border-border rounded-full">
        <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
        <span className="text-[11px] font-bold text-accent uppercase tracking-wider">Blockchain Crowdfunding DApp</span>
      </div>
      
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-strong leading-tight tracking-tight">
        How it is built <span className="text-accent block md:inline">and why it works</span>
      </h2>
      
      <p className="text-base sm:text-lg text-text-body leading-relaxed">
        Built on Ethereum. No custodians, no hidden fees. Every campaign lives on-chain so you can verify it yourself.
      </p>
    </div>

    {/* Stats Grid */}
    <MetricsErrorBoundary>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" data-testid="metrics-grid">
        {projectStats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-surface/70 backdrop-blur p-5 sm:p-6 rounded-xl border border-border flex min-w-0 flex-col items-start hover:border-border transition-all duration-300"
            role="article"
            aria-labelledby={`metric-${idx}-label`}
          >
            <div className="p-2.5 bg-surface-alt border border-border rounded-lg text-accent mb-4">
              <stat.icon 
                size={20} 
                aria-label={`${stat.label} metric`}
                role="img"
              />
            </div>
            <div 
              className="text-xl sm:text-2xl font-extrabold text-text-strong tracking-tight leading-tight break-words"
              aria-label={`Metric value: ${stat.value}`}
            >
              {stat.value}
            </div>
            <div 
              id={`metric-${idx}-label`}
              className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1"
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </MetricsErrorBoundary>

    {/* Features */}
    <div className="mb-20">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-text-strong text-center tracking-tight mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectFeatures.map((feature, idx) => (
          <div key={idx} className="bg-surface/70 backdrop-blur p-5 sm:p-6 rounded-xl border border-border hover:border-border transition-all duration-300">
            <div className="p-2.5 bg-surface-alt border border-border rounded-lg text-accent mb-4 inline-flex">
              <feature.icon size={22} aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-text-strong mb-2">{feature.title}</h3>
            <p className="text-sm text-text-body leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Workflow */}
    <div className="mb-20">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-text-strong text-center tracking-tight mb-12">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {projectWorkflow.map((step, idx) => (
          <div key={idx} className="relative bg-surface/70 backdrop-blur border border-border p-5 rounded-xl flex min-w-0 flex-col justify-between hover:border-border transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/8 border border-border flex items-center justify-center text-accent text-xs font-bold">
                  {step.step}
                </div>
                <div className="text-text-body">
                  {typeof step.icon === 'string' ? (
                    <Image src={step.icon} width={20} height={20} className="opacity-70 filter dark:invert" alt="" aria-hidden="true" />
                  ) : (
                    <step.icon size={20} aria-hidden="true" />
                  )}
                </div>
              </div>
              <h3 className="text-sm font-bold text-text-strong mb-1">{step.title}</h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">{step.description}</p>
            </div>
            <div className="pt-3 border-t border-border text-[11px] text-text-muted font-semibold uppercase tracking-wider">
              {step.details}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Tech Stack */}
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-text-strong text-center tracking-tight mb-12">Technology Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techStack.map((tech, idx) => (
          <div key={idx} className="bg-surface/70 backdrop-blur border border-border rounded-xl p-5 sm:p-6 hover:border-border transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-surface-alt border border-border rounded-lg text-accent">
                <tech.icon size={18} aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-text-strong break-words">{tech.category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tech.technologies.map((t, i) => (
                <span key={i} className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-surface-alt border border-border text-text-body flex items-center gap-2 hover:border-text-muted/30 transition-colors">
                  {t.icon && <t.icon className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />}
                  {t.name}
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

