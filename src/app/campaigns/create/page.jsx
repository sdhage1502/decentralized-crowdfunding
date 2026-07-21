'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '../../../context/Web3Context';
import { uploadFile, deleteFileByUrl } from '../../../utils/storageService';
import { createCampaign } from '../../../utils/campaignService';
import {
  Upload, X, CheckCircle, Clock, Link as LinkIcon, Camera, Loader2, Sparkles, Check,
  Edit, Wallet, Mail, Image as ImageIcon, Rocket, FileText, QrCode, DollarSign, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedLoader from '../../../components/ui/AnimatedLoader';

const CreateCampaign = () => {
  const { account } = useWeb3();
  const router = useRouter();

  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    image: "",
    walletAddress: "",
    upiId: "",
    email: "",
    phone: "",
    fullName: "",
    category: "",
    urgency: "medium",
    documents: ""
  });

  // Auto-fill connected wallet address
  useEffect(() => {
    if (account) {
      setCampaign(prev => ({ ...prev, walletAddress: account }));
    }
  }, [account]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadType, setUploadType] = useState('file');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic-details');
  const fileInputRef = useRef(null);

  // Active section observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    const sections = ['basic-details', 'funding', 'contact', 'media'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const categories = [
    "Medical Emergency",
    "Education",
    "Animal Welfare",
    "Disaster Relief",
    "Community Development",
    "Sports & Recreation",
    "Arts & Culture",
    "Environment",
    "Technology",
    "Other"
  ];

  const handleChange = (e) => {
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
  };

  const handleUrgencySelect = (level) => {
    setCampaign({ ...campaign, urgency: level });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploadedFile(file);

    try {
      setIsUploading(true);
      const downloadURL = await uploadFile(file, 'campaigns', (progress) => {
        setUploadProgress(progress);
      });
      setCampaign((prev) => ({ ...prev, image: downloadURL }));
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error('Failed to upload image. Please try again or use an image URL.');
      clearImage();
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUrl = (e) => {
    const url = e.target.value;
    setCampaign({ ...campaign, image: url });
    setImagePreview(url || '');
  };

  const clearImage = () => {
    setUploadedFile(null);
    setImagePreview('');
    setUploadProgress(0);
    setCampaign((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = () => {
    if (campaign.walletAddress) {
      navigator.clipboard.writeText(campaign.walletAddress);
      toast.success('Address copied!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUploading) {
      toast.error('Please wait for the image to finish uploading.');
      return;
    }

    if (!campaign.image) {
      toast.error('Please provide a campaign image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const docId = await createCampaign(campaign);
      console.log("Campaign submitted for review with ID:", docId);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting campaign:", error);
      toast.error("Error submitting campaign. Please try again.");
      
      if (uploadType === 'file' && campaign.image) {
        toast.loading('Cleaning up uploaded image...', { id: 'cleanup' });
        await deleteFileByUrl(campaign.image);
        toast.dismiss('cleanup');
        clearImage();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCampaign({
      title: "",
      description: "",
      amount: "",
      image: "",
      walletAddress: account || "",
      upiId: "",
      email: "",
      phone: "",
      fullName: "",
      category: "",
      urgency: "medium",
      documents: ""
    });
    clearImage();
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-slide-in">
      <div className="glass-panel rounded-2xl shadow-xl max-w-lg w-full max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <div className="p-6 sm:p-8 text-center text-ink">
          <div className="mx-auto w-20 h-20 bg-success-bg border border-success-border rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-3xl font-bold neon-gradient-text mb-2">Campaign Submitted</h2>
          <p className="text-ink-2 text-sm mb-6">
            Thank you, <strong>{campaign.fullName}</strong>. Your campaign submission is pending review.
          </p>

          <div className="bg-accent-bg border-l-4 border-accent p-4 mb-8 text-left rounded-r-lg">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 text-accent mr-2" />
              <span className="font-semibold text-accent text-sm">Under Review</span>
            </div>
            <p className="text-ink-2 text-xs leading-relaxed">
              Our team will review your campaign details within 24-48 hours. Updates will be sent to <strong className="text-ink">{campaign.email}</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full primary-gradient-btn min-h-12 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
            >
              View Dashboard
            </button>
            <button
              onClick={() => { setShowModal(false); resetForm(); }}
              className="w-full min-h-12 glass-input hover:bg-paper-3-glass text-ink py-3 px-6 rounded-xl transition-all duration-300 font-medium text-sm"
            >
              Create Another Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    { id: 'basic-details', label: 'Basic Details', icon: Edit },
    { id: 'funding', label: 'Funding', icon: Wallet },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'media', label: 'Media', icon: ImageIcon },
  ];

  return (
    <section className="relative min-h-[100dvh] custom-scrollbar text-ink overflow-x-clip pb-24 bg-transparent">
      {/* Main Content Canvas */}
      <main className="pt-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* Left Vertical Stepper (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 relative">
          <div className="sticky top-[100px]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-3 mb-8 px-2">Campaign Setup</h3>
            <div className="relative">
              {/* Connecting vertical line */}
              <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-rule/30"></div>
              
              <div className="space-y-2 relative z-10">
                {steps.map((step, index) => {
                  const isActive = activeSection === step.id;
                  return (
                    <a 
                      key={step.id}
                      href={`#${step.id}`}
                      onClick={() => setActiveSection(step.id)} 
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-accent-bg shadow-[0_0_15px_rgba(0,112,243,0.1)]' : 'hover:bg-paper-3-glass border border-transparent'}`}
                    >
                      {/* Stepper Dot */}
                      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-accent/20' : 'bg-paper-3 text-ink-3 border border-rule/50 group-hover:border-accent/50'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isActive ? 'bg-accent shadow-[0_0_10px_rgba(0,112,243,0.8)] scale-110' : 'bg-ink-3 group-hover:bg-accent/50'}`}></div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm tracking-wide transition-colors ${isActive ? 'text-accent' : 'text-ink-2 group-hover:text-ink'}`}>{step.label}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Top Stepper Navigation (Mobile Only) */}
        <div className="lg:hidden sticky top-[72px] z-40 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-4 mb-4 bg-transparent backdrop-blur-2xl border-b border-rule/30">
          <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-between gap-4 overflow-x-auto custom-scrollbar pb-2">
            {steps.map((step, index) => {
              const isActive = activeSection === step.id;
              return (
                <div key={step.id} className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <a 
                    href={`#${step.id}`} 
                    onClick={() => setActiveSection(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-accent-bg text-accent shadow-[0_0_15px_rgba(0,112,243,0.1)]' : 'text-ink-2 hover:text-ink hover:bg-paper-3-glass'}`}
                  >
                    {/* Stepper Dot */}
                    <div className={`relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${isActive ? 'bg-accent/20' : 'bg-paper-3 text-ink-3 border border-rule/50'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-accent shadow-[0_0_10px_rgba(0,112,243,0.8)] scale-110' : 'bg-ink-3'}`}></div>
                    </div>
                    <span className="font-semibold text-sm whitespace-nowrap">{step.label}</span>
                  </a>
                  {index < steps.length - 1 && (
                    <div className="w-4 sm:w-8 h-px bg-rule/50 hidden sm:block"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Form Content Wrapper */}
        <div className="flex-1 w-full max-w-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight mb-2">New Campaign</h1>
            <p className="text-ink-2 text-sm max-w-xl leading-relaxed">
              Fill out the details below to start raising funds. Once approved by our team, your campaign will be deployed on-chain and open for global contributions.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Basic Details */}
          <section className="space-y-6 scroll-mt-28" id="basic-details">
            <div className="flex items-center gap-3">
              <Edit className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold neon-gradient-text">Basic Details</h2>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Campaign Title *</label>
                  <input
                    name="title"
                    value={campaign.title}
                    onChange={handleChange}
                    className="glass-input w-full p-4 rounded-xl placeholder-muted font-medium"
                    placeholder="e.g. Project Solaris: Decentralized Energy Grid"
                    type="text"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Category *</label>
                  <select
                    name="category"
                    value={campaign.category}
                    onChange={handleChange}
                    className="glass-input w-full p-4 rounded-xl appearance-none font-medium [&>option]:bg-paper"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Campaign Urgency *</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUrgencySelect('low')}
                      className={`flex-1 p-3 rounded-xl text-sm font-semibold transition-all border ${campaign.urgency === 'low' ? 'bg-accent-bg border-accent text-accent' : 'glass-input border-transparent text-ink-2 hover:bg-paper-3-glass'}`}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUrgencySelect('medium')}
                      className={`flex-1 p-3 rounded-xl text-sm font-semibold transition-all border ${campaign.urgency === 'medium' ? 'bg-accent-bg border-accent text-accent' : 'glass-input border-transparent text-ink-2 hover:bg-paper-3-glass'}`}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUrgencySelect('high')}
                      className={`flex-1 p-3 rounded-xl text-sm font-semibold transition-all border ${campaign.urgency === 'high' ? 'bg-accent-bg border-accent text-accent' : 'glass-input border-transparent text-ink-2 hover:bg-paper-3-glass'}`}
                    >
                      High
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Goal Amount (ETH) *</label>
                  <div className="relative">
                    <input
                      name="amount"
                      value={campaign.amount}
                      onChange={handleChange}
                      className="glass-input w-full p-4 pl-12 rounded-xl placeholder-muted font-bold text-2xl tracking-wide"
                      placeholder="5.0"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-accent w-6 h-6" />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Section: Funding & Wallet */}
          <section className="space-y-6 scroll-mt-28" id="funding">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold neon-gradient-text">Funding & Wallet</h2>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Creator Wallet Address *</label>
                  {account && (
                    <span className="text-[10px] text-success flex items-center gap-1 font-bold bg-success-bg px-2 py-0.5 rounded-full border border-success-border">
                      <Check size={12} /> Connected
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      name="walletAddress"
                      value={campaign.walletAddress}
                      onChange={handleChange}
                      className="glass-input w-full p-4 pr-12 rounded-xl font-mono text-sm opacity-80"
                      type="text"
                      placeholder="0x..."
                      required
                    />
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-accent hover:scale-110 transition-transform"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  <button type="button" className="glass-input p-4 rounded-xl flex items-center justify-center hover:bg-paper-3-glass transition-colors">
                    <QrCode className="w-5 h-5 text-ink-2" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">UPI ID (Optional)</label>
                <input
                  name="upiId"
                  value={campaign.upiId}
                  onChange={handleChange}
                  className="glass-input w-full p-4 rounded-xl placeholder-muted font-medium"
                  placeholder="projectname@upi"
                  type="text"
                />
              </div>
            </div>
          </section>

          {/* Section: Contact Info */}
          <section className="space-y-6 scroll-mt-28" id="contact">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold neon-gradient-text">Contact Info</h2>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Full Name *</label>
                <input
                  name="fullName"
                  value={campaign.fullName}
                  onChange={handleChange}
                  className="glass-input w-full p-4 rounded-xl placeholder-muted font-medium"
                  placeholder="Alex Rivera"
                  type="text"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Email Address *</label>
                <input
                  name="email"
                  value={campaign.email}
                  onChange={handleChange}
                  className="glass-input w-full p-4 rounded-xl placeholder-muted font-medium"
                  placeholder="alex@decrowdfund.io"
                  type="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Phone Number *</label>
                <input
                  name="phone"
                  value={campaign.phone}
                  onChange={handleChange}
                  className="glass-input w-full p-4 rounded-xl placeholder-muted font-medium"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section: Media & Content */}
          <section className="space-y-6 scroll-mt-28" id="media">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold neon-gradient-text">Media & Content</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Image Upload Zone */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Upload Toggle */}
                <div className="flex items-center gap-2 mb-4 bg-paper-3-glass p-1.5 rounded-xl w-fit border border-rule">
                  <button
                    type="button"
                    onClick={() => { setUploadType('file'); clearImage(); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${uploadType === 'file' ? 'bg-paper text-ink shadow-sm' : 'text-ink-2 hover:text-ink'}`}
                  >
                    <Camera className="w-4 h-4" /> Local File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUploadType('url'); clearImage(); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${uploadType === 'url' ? 'bg-paper text-ink shadow-sm' : 'text-ink-2 hover:text-ink'}`}
                  >
                    <LinkIcon className="w-4 h-4" /> Image URL
                  </button>
                </div>

                {uploadType === 'file' ? (
                  !imagePreview ? (
                    <div className="glass-panel rounded-2xl p-2 h-72 relative group overflow-hidden border-dashed border-2 drop-zone-pulse flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div 
                        className="text-center space-y-4 z-10 p-8 w-full h-full flex flex-col items-center justify-center"
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                      >
                        {isUploading ? (
                          <>
                            <AnimatedLoader size={48} className="mb-4" />
                            <p className="text-xl font-bold text-ink">Uploading...</p>
                            <div className="w-48 bg-rule rounded-full h-2 mt-4 overflow-hidden">
                              <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-accent-bg rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,112,243,0.1)]">
                              <Upload className="text-accent w-8 h-8" />
                            </div>
                            <p className="text-xl font-bold text-ink">Upload Cover Image *</p>
                            <p className="text-xs text-ink-2">Drag and drop or click. PNG, JPG (Max 10MB)</p>
                          </>
                        )}
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-bg blur-[60px] rounded-full"></div>
                    </div>
                  ) : (
                    <div className="glass-panel rounded-2xl h-72 relative overflow-hidden border-2 border-rule">
                      <Image src={imagePreview} width={800} height={400} alt="Preview" className="w-full h-full object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-4 right-4 bg-error hover:bg-error/90 backdrop-blur text-white rounded-full p-2 transition-colors shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={campaign.image}
                      onChange={handleImageUrl}
                      placeholder="https://example.com/image.jpg"
                      className="glass-input w-full p-4 rounded-xl placeholder-muted font-medium"
                      required
                    />
                    {imagePreview && (
                      <div className="glass-panel rounded-2xl h-64 mt-4 relative overflow-hidden border-2 border-rule">
                        <Image src={imagePreview} width={800} height={400} alt="Preview" className="w-full h-full object-cover" unoptimized />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Side actions/Info */}
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm text-ink font-bold uppercase flex items-center gap-2 tracking-wider">
                    <FileText className="w-4 h-4 text-accent" /> Documents
                  </h3>
                  <input
                    name="documents"
                    value={campaign.documents}
                    onChange={handleChange}
                    className="glass-input w-full p-4 rounded-xl placeholder-muted text-sm font-medium"
                    placeholder="Whitepaper/Docs URL (Optional)"
                    type="url"
                  />
                  <p className="text-[10px] text-ink-2 leading-relaxed">
                    Upload a detailed technical document or roadmap to increase investor trust and transparency scores.
                  </p>
                </div>
                
                <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-accent bg-accent-bg">
                  <p className="text-xs text-accent italic leading-relaxed font-medium">
                    "Campaigns with professional cover images and detailed whitepapers raise 4.5x more funding."
                  </p>
                </div>
              </div>
              
              {/* Description Area */}
              <div className="lg:col-span-3 space-y-2 mt-4">
                <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider">Campaign Description *</label>
                <textarea
                  name="description"
                  value={campaign.description}
                  onChange={handleChange}
                  className="glass-input w-full p-6 rounded-2xl placeholder-muted resize-y min-h-[200px] font-medium leading-relaxed"
                  placeholder="Tell the world about your vision, the problem you're solving, and how you'll use the funds..."
                  rows="8"
                  required
                ></textarea>
              </div>
              
            </div>
          </section>

          {/* Submission Area */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between mt-8">
            <div className="flex items-start gap-3 flex-1">
              <input 
                id="acceptTerms"
                type="checkbox" 
                required 
                className="mt-1 w-4 h-4 accent-accent bg-paper-3-glass border-rule rounded cursor-pointer" 
              />
              <label htmlFor="acceptTerms" className="text-xs text-ink-2 leading-relaxed cursor-pointer font-medium">
                I attest that all documents, details, and goals supplied are accurate and true. I understand this campaign requires admin review and manual smart contract registration prior to public display.
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="primary-gradient-btn min-w-[200px] min-h-[56px] text-white font-bold rounded-xl shadow-lg transition-all duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <AnimatedLoader size={20} />
                  <span>Submitting...</span>
                </div>
              ) : isUploading ? (
                <div className="flex items-center gap-2">
                  <AnimatedLoader size={20} />
                  <span>Uploading Media...</span>
                </div>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Launch Campaign
                </>
              )}
            </button>
          </div>
          
        </form>
      </div>
      </main>

      {showModal && <SuccessModal />}
      
      {/* Floating Action Button for Mobile navigation */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => scrollToSection('basic-details')}
          className="primary-gradient-btn w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-95"
        >
          <Rocket className="w-6 h-6 text-white" />
        </button>
      </div>
    </section>
  );
};

export default CreateCampaign;
