'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, storage } from '../../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useWeb3 } from '../../../context/Web3Context';
import {
  Upload, X, CheckCircle, Clock, Mail, Phone, FileText,
  AlertCircle, Wallet, Link, Camera, Loader2, Sparkles, Check
} from 'lucide-react';

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
  const [uploadType, setUploadType] = useState('url');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  /**
   * Upload image file to Firebase Storage and return the public download URL.
   */
  const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `campaigns/${timestamp}_${safeName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setIsUploading(true);
      setUploadProgress(0);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          setIsUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setIsUploading(false);
          setUploadProgress(100);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploadedFile(file);

    try {
      const downloadURL = await uploadImageToStorage(file);
      setCampaign((prev) => ({ ...prev, image: downloadURL }));
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again or use an image URL.');
      clearImage();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUploading) {
      alert('Please wait for the image to finish uploading.');
      return;
    }

    if (!campaign.image) {
      alert('Please provide a campaign image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const campaignData = {
        ...campaign,
        amount: parseFloat(campaign.amount),
        status: "pending",
        createdAt: serverTimestamp(),
        dateCreated: new Date().toISOString(),
        raised: 0,
        collected: 0,
        donors: 0,
        contributors: 0,
        isActive: false,
        submissionTimestamp: Date.now()
      };

      const docRef = await addDoc(collection(db, "campaigns"), campaignData);
      console.log("Campaign submitted for review with ID:", docRef.id);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting campaign:", error);
      alert("Error submitting campaign. Please try again.");
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
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fadeIn">
      <div className="bg-paper-glass backdrop-blur-md border border-rule rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-success-bg border border-success-border rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-ink mb-2">Campaign Submitted!</h2>
          <p className="text-ink-2 text-sm mb-6">
            Thank you, <strong className="text-ink">{campaign.fullName}</strong>. Your campaign submission is pending review.
          </p>

          <div className="bg-accent-bg border-l-4 border-accent p-4 mb-4 text-left rounded-r-lg">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 text-accent mr-2" />
              <span className="font-semibold text-accent text-sm">Under Review</span>
            </div>
            <p className="text-ink-2 text-xs leading-relaxed">
              Our team will review your campaign details within 24–48 hours. Updates will be sent to <strong className="text-ink">{campaign.email}</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-accent hover:bg-accent-hover text-white py-2.5 px-6 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm"
            >
              View Dashboard
            </button>
            <button
              onClick={() => { setShowModal(false); resetForm(); }}
              className="w-full bg-paper-2-glass backdrop-blur hover:bg-paper-3-glass border border-rule text-ink py-2.5 px-6 rounded-lg transition-all duration-200 font-medium text-sm"
            >
              Create Another Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 px-6 bg-transparent min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-3">
            Start a <span className="text-accent">Campaign</span>
          </h1>
          <p className="text-ink-2 text-sm max-w-xl">
            Fill out the details below. Once approved by our team, your campaign will be deployed on-chain and open for contributions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Card */}
          <div className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule shadow-sm space-y-4">
            <h3 className="text-md font-bold text-ink flex items-center gap-2 pb-2 border-b border-rule">
              <Mail className="w-4 h-4 text-accent" />
              Creator Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-ink-2 mb-1">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={campaign.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-ink-2 mb-1">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={campaign.email}
                  onChange={handleChange}
                  placeholder="e.g. name@domain.com"
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-xs font-semibold text-ink-2 mb-1">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={campaign.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                />
              </div>
            </div>
          </div>

          {/* Campaign Details Card */}
          <div className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule shadow-sm space-y-4">
            <h3 className="text-md font-bold text-ink flex items-center gap-2 pb-2 border-b border-rule">
              <FileText className="w-4 h-4 text-accent" />
              Campaign Specs
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-xs font-semibold text-ink-2 mb-1">Campaign Title *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={campaign.title}
                  onChange={handleChange}
                  placeholder="e.g. Support for High School Football Team Kits"
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-xs font-semibold text-ink-2 mb-1">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={campaign.category}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                    aria-required="true"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-xs font-semibold text-ink-2 mb-1">Urgency Level *</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={campaign.urgency}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                    aria-required="true"
                  >
                    <option value="low">Low Urgency</option>
                    <option value="medium">Medium Urgency</option>
                    <option value="high">High Urgency</option>
                    <option value="critical">Critical (Immediate Help Required)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-xs font-semibold text-ink-2 mb-1">Funding Target (ETH) *</label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={campaign.amount}
                  onChange={handleChange}
                  placeholder="e.g. 1.5"
                  step="0.001"
                  min="0.001"
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-ink-2 mb-1">Campaign Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={campaign.description}
                  onChange={handleChange}
                  placeholder="Tell your story. Why do you need funds, and how will they be used? Be specific."
                  rows="5"
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
                  required
                  aria-required="true"
                />
              </div>

              {/* Image Input Section */}
              <div className="space-y-2">
                <label htmlFor={uploadType === 'url' ? 'campaignImage' : 'campaignFile'} className="block text-xs font-semibold text-ink-2">Campaign Cover Photo *</label>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setUploadType('url'); clearImage(); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      uploadType === 'url'
                        ? 'bg-accent border-accent text-white'
                        : 'bg-paper-glass backdrop-blur-md border-rule text-ink hover:bg-paper-3-glass'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5 inline mr-1.5" />
                    Provide Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUploadType('file'); clearImage(); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      uploadType === 'file'
                        ? 'bg-accent border-accent text-white'
                        : 'bg-paper-glass backdrop-blur-md border-rule text-ink hover:bg-paper-3-glass'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 inline mr-1.5" />
                    Upload Local File
                  </button>
                </div>

                {uploadType === 'url' ? (
                  <input
                    id="campaignImage"
                    type="url"
                    value={campaign.image}
                    onChange={handleImageUrl}
                    placeholder="https://images.unsplash.com/... or any static image link"
                    className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                    aria-required="true"
                  />
                ) : (
                  <div className="border-2 border-dashed border-rule-strong rounded-lg p-5 text-center bg-paper-glass backdrop-blur-md hover:border-accent transition-colors">
                    <input
                      id="campaignFile"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex flex-col items-center gap-1 mx-auto text-ink-2 hover:text-accent transition-colors disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-accent mb-1" />
                      ) : (
                        <Upload className="w-6 h-6 mb-1" />
                      )}
                      <span className="text-xs font-semibold">
                        {isUploading ? `Uploading image (${uploadProgress}%)` : 'Click to select image file'}
                      </span>
                      <span className="text-[10px] opacity-75">PNG, JPG, WebP up to 5MB</span>
                    </button>

                    {isUploading && (
                      <div className="mt-2 w-full bg-paper-3-glass backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-accent h-1.5 rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {imagePreview && (
                  <div className="relative mt-2 rounded-lg overflow-hidden border border-rule-strong">
                    <img
                      src={imagePreview}
                      alt="Upload Preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="documents" className="block text-xs font-semibold text-ink-2 mb-1">Supporting Document URLs (Optional)</label>
                <input
                  id="documents"
                  type="text"
                  name="documents"
                  value={campaign.documents}
                  onChange={handleChange}
                  placeholder="Medical reports, bills, receipts (comma separated URLs)"
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule shadow-sm space-y-4">
            <h3 className="text-md font-bold text-ink flex items-center gap-2 pb-2 border-b border-rule">
              <Wallet className="w-4 h-4 text-accent" />
              Settlement Credentials
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="walletAddress" className="block text-xs font-semibold text-ink-2">Creator Wallet Address *</label>
                  {account && (
                    <span className="text-[10px] text-success flex items-center gap-1 font-medium bg-success-bg px-2 py-0.5 rounded-full border border-success-border">
                      <Check size={10} /> MetaMask Connected
                    </span>
                  )}
                </div>
                <input
                  id="walletAddress"
                  type="text"
                  name="walletAddress"
                  value={campaign.walletAddress}
                  onChange={handleChange}
                  placeholder="0x..."
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-xs font-mono text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                  aria-describedby="walletAddress-hint"
                />
                <p id="walletAddress-hint" className="text-[10px] text-ink-2 mt-1">
                  This address will receive all ETH withdrawals from the on-chain smart contract.
                </p>
              </div>

              <div>
                <label htmlFor="upiId" className="block text-xs font-semibold text-ink-2 mb-1">UPI ID * (For off-chain donations)</label>
                <input
                  id="upiId"
                  type="text"
                  name="upiId"
                  value={campaign.upiId}
                  onChange={handleChange}
                  placeholder="e.g. creator@upi"
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                />
              </div>
            </div>
          </div>

          {/* Submission and Terms */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-1">
              <input 
                id="acceptTerms"
                type="checkbox" 
                required 
                className="mt-1 accent-accent" 
              />
              <label htmlFor="acceptTerms" className="text-xs text-ink-2 leading-relaxed select-none cursor-pointer">
                I attest that all documents, details, and goals supplied are accurate and true. I understand this campaign requires admin review and manual smart contract registration prior to public display.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full py-3 text-white font-bold rounded-lg shadow-sm transition-all duration-200 text-sm flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Submitting to Database...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Waiting for image upload...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit Campaign for Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {showModal && <SuccessModal />}
    </section>
  );
};

export default CreateCampaign;
