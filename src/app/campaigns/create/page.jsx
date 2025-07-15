'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Upload, X, CheckCircle, Clock, Mail, Phone, FileText, AlertCircle, Wallet, Link, Camera } from 'lucide-react';

const CreateCampaign = () => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadType, setUploadType] = useState('url');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const router = useRouter();

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setCampaign({ ...campaign, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = (e) => {
    const url = e.target.value;
    setCampaign({ ...campaign, image: url });
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview('');
    setCampaign({ ...campaign, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const campaignData = {
        ...campaign,
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

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Campaign Submitted!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for submitting your campaign, <strong>{campaign.fullName}</strong>!
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-800">Under Review</span>
            </div>
            <p className="text-blue-700 text-sm">
              Our team will review your campaign within 24-48 hours. You'll receive an email at <strong>{campaign.email}</strong> with the approval or rejection status.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-left">
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-800">Stay Informed</span>
            </div>
            <p className="text-green-700 text-sm">
              Please check your inbox (and spam/junk folder) for updates. If approved, your campaign will go live on our platform!
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Campaigns
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                setCampaign({
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
                clearImage();
              }}
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Create Another Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto p-8 bg-white border-4 border-black rounded-lg shadow-xl">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-blue-700 mb-2">Create a Campaign</h2>
          <p className="text-gray-600">
            Your campaign will be reviewed by our team before going live. Please provide accurate information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                value={campaign.fullName}
                onChange={handleChange}
                placeholder="Full Name *"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                value={campaign.email}
                onChange={handleChange}
                placeholder="Gmail Address *"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                type="tel"
                name="phone"
                value={campaign.phone}
                onChange={handleChange}
                placeholder="Phone Number *"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Campaign Details
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={campaign.title}
                onChange={handleChange}
                placeholder="Campaign Title *"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="category"
                  value={campaign.category}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Category *</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  name="urgency"
                  value={campaign.urgency}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="low">Low Urgency</option>
                  <option value="medium">Medium Urgency</option>
                  <option value="high">High Urgency</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <textarea
                name="description"
                value={campaign.description}
                onChange={handleChange}
                placeholder="Detailed Campaign Description (Why do you need this funding? How will it be used?) *"
                rows="6"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />

              <input
                type="number"
                name="amount"
                value={campaign.amount}
                onChange={handleChange}
                placeholder="Target Amount (ETH) *"
                step="0.001"
                min="0.001"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Image *
                </label>
                
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      uploadType === 'url'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Link className="w-4 h-4 inline mr-2" />
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      uploadType === 'file'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Camera className="w-4 h-4 inline mr-2" />
                    Upload File
                  </button>
                </div>

                {uploadType === 'url' ? (
                  <input
                    type="url"
                    value={campaign.image}
                    onChange={handleImageUrl}
                    placeholder="Enter image URL *"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    required
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      required={!campaign.image}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-2 mx-auto text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Upload className="w-8 h-8" />
                      <span className="font-medium">Click to upload image</span>
                      <span className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</span>
                    </button>
                  </div>
                )}

                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Campaign preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <textarea
                name="documents"
                value={campaign.documents}
                onChange={handleChange}
                placeholder="Supporting Documents URLs (Medical reports, bills, certificates etc. - separate multiple URLs with commas)"
                rows="3"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Payment Information
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="walletAddress"
                value={campaign.walletAddress}
                onChange={handleChange}
                placeholder="Your Ethereum Wallet Address *"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                name="upiId"
                value={campaign.upiId}
                onChange={handleChange}
                placeholder="Your UPI ID (e.g. name@paytm, name@phonepe) *"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
            <div className="mb-4">
              <label className="flex items-start space-x-3">
                <input type="checkbox" required className="mt-1" />
                <span className="text-sm text-gray-700">
                  I confirm that all information provided is accurate and I agree to the platform's terms and conditions. 
                  I understand that my campaign will be reviewed before going live. *
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-4 text-white font-bold rounded-lg shadow-lg transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#28A745] hover:bg-[#218838]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting for Review...
                </div>
              ) : (
                'Submit Campaign for Review'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>24-48 hour review</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Email notification</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Provide accurate info</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && <SuccessModal />}
    </section>
  );
};

export default CreateCampaign;