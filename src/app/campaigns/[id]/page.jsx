"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { contributeToWallet } from "../../../utils/contributeToWallet";
import { db } from "../../../firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CampaignDetails = ({ params }) => {
  const [campaignId, setCampaignId] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [contributionAmount, setContributionAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);

  // Resolve params properly
  useEffect(() => {
    async function resolveParams() {
      if (params instanceof Promise) {
        const resolvedParams = await params;
        setCampaignId(resolvedParams.id);
      } else {
        setCampaignId(params.id);
      }
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    async function fetchCampaign() {
      if (!campaignId) return;

      try {
        const campaignDoc = await getDoc(doc(db, "campaigns", campaignId));
        if (campaignDoc.exists()) {
          setCampaign(campaignDoc.data());
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        toast.error("Failed to load campaign details.");
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [campaignId, router]);

  const handleShareCampaign = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Campaign link copied to clipboard!");
  };



const handleContribute = async () => {
  if (!campaign?.walletAddress) {
    toast.error("Campaign wallet address not found.");
    return;
  }

  try {
    setIsContributing(true);
    await contributeToWallet(campaign.walletAddress, contributionAmount);
    await updateCampaignStats(parseFloat(contributionAmount));
    toast.success(`You contributed ${contributionAmount} ETH!`);
    setContributionAmount("");
  } catch (error) {
   console.error("Contribution failed.");
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
      toast.success(`Successfully contributed ₹${amount}!`);
    } catch (error) {
      console.error("Failed to update campaign after UPI payment:", error);
      toast.error("Payment recorded, but campaign stats couldn't be updated.");
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-secondaryBlack min-h-screen w-full flex items-center justify-center">
        <div className="text-center text-2xl text-gray-500 animate-pulse">
          Loading campaign details...
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-secondaryBlack min-h-screen w-full py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-xl border-2 border-[#3247C5]">
        <div className="relative h-80 w-full">
          {campaign.image && (
            <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <span className="bg-[#FFC107] text-black text-lg font-bold px-4 py-1 rounded-full">
              Goal: {campaign.amount} ETH
            </span>
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-heading text-blue-700 mb-4">{campaign.title}</h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#28A745] h-3 rounded-full"
                  style={{
                    width: `${Math.min((campaign.collected || 0) / campaign.amount * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="text-lg font-medium">
              {((campaign.collected || 0) / campaign.amount * 100).toFixed(1)}%
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Raised</p>
              <p className="text-xl font-bold text-[#3247C5]">{campaign.collected || 0} ETH</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Goal</p>
              <p className="text-xl font-bold text-[#3247C5]">{campaign.amount} ETH</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Backers</p>
              <p className="text-xl font-bold text-[#3247C5]">{campaign.contributors || 0}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How to Contribute</h2>
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="mb-4">To support this campaign, connect your wallet and contribute ETH directly.</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="Enter amount (ETH)"
                  className="flex-1 px-4 py-3 border rounded-lg text-lg"
                />

                <button
                  onClick={handleContribute}
                  className="h-[55px] px-8 bg-[#28A745] text-white rounded-lg text-lg font-bold shadow-md hover:bg-[#218838] transition-colors flex-1"
                  disabled={isContributing}
                >
                  {isContributing ? "Processing..." : "Contribute Now"}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 text-[#3247C5] border border-[#3247C5] rounded-lg font-medium hover:bg-[#3247C5] hover:text-white transition-colors"
            >
              Back to All Campaigns
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
