"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ethers } from "ethers";
import { db } from "../../../firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpiPaymentModal from "../../upi-qr-modal/UpiPaymentModal";
import ShareCampaignModal from "../../../app/shareModal/ShareCampaignModal";
import { use } from "react";

const CampaignDetails = ({ params }) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [contributionAmount, setContributionAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("eth");
  const [isShareOpen, setIsShareOpen] = useState(false);

  const id = use(params).id;

  useEffect(() => {
    async function fetchCampaign() {
      if (!id) return;

      try {
        const campaignDoc = await getDoc(doc(db, "campaigns", id));
        if (campaignDoc.exists()) {
          setCampaign({ ...campaignDoc.data(), id });
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        toast.error("Failed to load campaign details.", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [id, router]);

  const campaignUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/campaign/${id}`;

  const handleContribute = async () => {
    if (!window.ethereum) {
      toast.error(
        <div>
          MetaMask is required!
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', textDecoration: 'underline', fontWeight: 'bold', marginLeft: '5px' }}
          >
            Install MetaMask
          </a>
        </div>,
        {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    if (!campaign?.walletAddress) {
      toast.error("Campaign wallet address not found!", { position: "top-center" });
      return;
    }

    if (!contributionAmount || isNaN(contributionAmount) || contributionAmount <= 0) {
      toast.error("Please enter a valid amount to contribute.", { position: "top-center" });
      return;
    }

    try {
      setIsContributing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const amountInWei = ethers.parseEther(contributionAmount);
      const tx = await signer.sendTransaction({
        to: campaign.walletAddress,
        value: amountInWei,
      });

      await tx.wait();
      await updateCampaignStats(parseFloat(contributionAmount));
      toast.success(`Successfully contributed ${contributionAmount} ETH!`, {
        position: "top-center",
      });
      setContributionAmount("");
    } catch (error) {
      console.error("Contribution failed:", error);
      toast.error("Transaction failed. Please try again.", { position: "top-center" });
    } finally {
      setIsContributing(false);
    }
  };

  const updateCampaignStats = async (amount) => {
    const campaignRef = doc(db, "campaigns", id);
    await updateDoc(campaignRef, {
      collected: (campaign.collected || 0) + amount,
      contributors: (campaign.contributors || 0) + 1,
    });

    setCampaign((prev) => ({
      ...prev,
      collected: (prev.collected || 0) + amount,
      contributors: (prev.contributors || 0) + 1,
    }));
  };

  const handleUpiPaymentSuccess = async (amount) => {
    try {
      const approximateEthValue = amount / 250000;
      await updateCampaignStats(approximateEthValue);
      toast.success(`Successfully contributed ₹${amount}!`, { position: "top-center" });
    } catch (error) {
      console.error("Failed to update campaign after UPI payment:", error);
      toast.error("Payment recorded, but campaign stats couldn't be updated.", {
        position: "top-center",
      });
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
    (campaign.collected || 0) / campaign.amount * 100,
    100
  );

  return (
    <div className="dark:bg-secondaryBlack bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-screen w-full py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg overflow-hidden shadow-xl border-2 border-[#3247C5]">
        {/* Horizontal Layout - Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image */}
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

          {/* Right Side - Content */}
          <div className="md:w-3/5 p-6">
            <h1 className="text-3xl font-heading text-blue-700 mb-3">
              {campaign.title}
            </h1>

            {/* Description */}
            <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-2">About this Campaign</h2>
              <p className="text-gray-700 whitespace-pre-line text-sm">
                {campaign.description}
              </p>
            </div>

            {/* Progress Bar */}
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

            {/* Stats */}
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

        {/* Payment Section - Below in full width */}
        <div className="p-4 border-t border-gray-200">
          {/* Payment Method */}
          <div className="mb-4">
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
                  To support this campaign, connect your wallet and contribute
                  ETH directly.
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3">
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

      {/* UPI Modal */}
      {campaign?.upiId && (
        <UpiPaymentModal
          isOpen={showUpiModal}
          onClose={() => setShowUpiModal(false)}
          upiId={campaign.upiId}
          campaignTitle={campaign.title}
          onSuccessfulPayment={handleUpiPaymentSuccess}
        />
      )}

      {/* Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <ShareCampaignModal
              isOpen={isShareOpen}
              onClose={() => setIsShareOpen(false)}
              campaignUrl={campaignUrl}
              campaignTitle={campaign.title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
