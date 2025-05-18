"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { contributeToWallet } from "../../../utils/contributeToWallet";
import { fetchCampaignById, updateCampaignStats } from "../../../utils/campaignService";

import UpiPaymentModal from "../../upi-qr-modal/UpiPaymentModal";
import ShareCampaignModal from "../../../app/shareModal/ShareCampaignModal";

const CampaignDetails = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("eth");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    
    const load = async () => {
      try {
        const data = await fetchCampaignById(id);
        setCampaign(data);
      } catch (error) {
        toast.error("Failed to load campaign details.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [id, router]);

  const campaignUrl = 
    typeof window !== "undefined" ? `${window.location.origin}/campaigns/${id}` : "";

  const handleContribute = async () => {
    // Validate the campaign data first
    if (!campaign) {
      toast.error("Campaign data not available.");
      return;
    }
    
    if (!campaign.walletAddress) {
      toast.error("Campaign wallet address not found!");
      return;
    }

    if (!contributionAmount || isNaN(contributionAmount) || Number(contributionAmount) <= 0) {
      toast.error("Please enter a valid amount to contribute.");
      return;
    }

    try {
      setIsContributing(true);
      
      // The contributeToWallet function now handles all the validation
      // and error messaging internally
      const receipt = await contributeToWallet(campaign.walletAddress, contributionAmount);
      
      // Only update campaign stats if the transaction was successful
      if (receipt) {
        const updated = await updateCampaignStats(id, campaign, parseFloat(contributionAmount));
        setCampaign((prev) => ({ ...prev, ...updated }));
        setContributionAmount("");
        toast.success(`Successfully contributed ${contributionAmount} ETH to ${campaign.title}!`);
      }
    } catch (error) {
      // Most errors are already handled in the contributeToWallet function
      // We can add additional error handling specific to this component if needed
      console.error("Contribution process failed:", error);
    } finally {
      setIsContributing(false);
    }
  };

  const handleUpiPaymentSuccess = async (amount) => {
    try {
      // Convert INR to approximate ETH value
      const ethApprox = amount / 250000; // Assuming 1 ETH = 250,000 INR
      
      const updated = await updateCampaignStats(id, campaign, ethApprox);
      setCampaign((prev) => ({ ...prev, ...updated }));
      toast.success(`Successfully contributed ₹${amount} to ${campaign.title}!`);
    } catch (err) {
      console.error("Failed to update campaign stats after UPI payment:", err);
      toast.error("Payment recorded, but campaign stats couldn't be updated.");
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-secondaryBlack min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    ((campaign.collected || 0) / campaign.amount) * 100,
    100
  );

  return (
    <div className="dark:bg-secondaryBlack bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-screen w-full py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg overflow-hidden shadow-xl border-2 border-[#3247C5]">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5">
            <div className="relative h-64 md:h-80 w-full">
              {campaign.image && (
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="bg-[#FFC107] text-black text-sm font-bold px-3 py-1 rounded-full">
                  Goal: {campaign.amount} ETH
                </span>
              </div>
            </div>
          </div>

          <div className="md:w-3/5 p-6">
            <h1 className="text-3xl font-heading text-blue-700 mb-3">
              {campaign.title}
            </h1>

            <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-2">About this Campaign</h2>
              <p className="text-gray-700 whitespace-pre-line text-sm">
                {campaign.description}
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#28A745] h-2 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm font-medium">
                {progressPercentage.toFixed(1)}%
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Raised</p>
                <p className="text-sm font-bold text-[#3247C5]">
                  {campaign.collected || 0} ETH
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Goal</p>
                <p className="text-sm font-bold text-[#3247C5]">
                  {campaign.amount} ETH
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Backers</p>
                <p className="text-sm font-bold text-[#3247C5]">
                  {campaign.contributors || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="p-4 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-3">How to Contribute</h2>

          <div className="flex mb-3 bg-gray-100 rounded-lg p-1 max-w-xs">
            <button
              onClick={() => setPaymentMethod("eth")}
              className={`flex-1 py-1 text-center rounded-md transition-colors ${
                paymentMethod === "eth"
                  ? "bg-white shadow-md text-[#3247C5] font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              ETH
            </button>
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`flex-1 py-1 text-center rounded-md transition-colors ${
                paymentMethod === "upi"
                  ? "bg-white shadow-md text-[#3247C5] font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              disabled={!campaign.upiId}
            >
              UPI (INR)
            </button>
          </div>

          {paymentMethod === "eth" ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="mb-3 text-sm">
                To support this campaign, connect your wallet and contribute ETH directly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="Enter amount (ETH)"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={handleContribute}
                  className="h-10 px-4 bg-[#28A745] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#218838] transition-colors flex-1"
                  disabled={isContributing}
                >
                  {isContributing ? "Processing..." : "Contribute Now"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              {campaign.upiId ? (
                <>
                  <p className="mb-3 text-sm">
                    To contribute in INR, pay directly with UPI:
                  </p>
                  <button
                    onClick={() => setShowUpiModal(true)}
                    className="w-full py-2 bg-[#3247C5] text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                  >
                    Pay with UPI
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  UPI payment is not available for this campaign.
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 mt-6">
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-8 py-1.5 bg-[#3247C5] text-white rounded-lg text-xl font-medium hover:bg-[#2a3aa0] transition-colors"
            >
              Share Campaign
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-1.5 text-[#3247C5] border border-[#3247C5] rounded-lg text-xl font-medium hover:bg-[#3247C5] hover:text-white transition-colors"
            >
              Back to All Campaigns
            </button>
          </div>
        </div>
      </div>

      {campaign?.upiId && (
        <UpiPaymentModal
          isOpen={showUpiModal}
          onClose={() => setShowUpiModal(false)}
          upiId={campaign.upiId}
          campaignTitle={campaign.title}
          onSuccessfulPayment={handleUpiPaymentSuccess}
        />
      )}

      {isShareOpen && (
        <ShareCampaignModal
          onClose={() => setIsShareOpen(false)}
          url={campaignUrl}
          title={campaign.title}
        />
      )}
    </div>
  );
};

export default CampaignDetails;