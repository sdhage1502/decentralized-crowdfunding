"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import {
  Target, TrendingUp, Users, Wallet, CreditCard, Share2,
  ArrowLeft, Loader2, Info, Heart, CheckCircle, AlertCircle,
  Zap, Globe, Smartphone, Download, ExternalLink, ShieldAlert
} from "lucide-react";

import { contributeToWallet } from "../../../utils/contributeToWallet";
import { fetchCampaignById, updateCampaignStats } from "../../../utils/campaignService";
import { getCampaignOnChainStats, withdrawCampaignFunds } from "../../../utils/contractService";
import { useWeb3 } from "../../../context/Web3Context";

import UpiPaymentModal from "../../upi-qr-modal/UpiPaymentModal";
import ShareCampaignModal from "../../../app/shareModal/ShareCampaignModal";

const CampaignDetails = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContribution] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("eth");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [onChainStats, setOnChainStats] = useState(null);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { account } = useWeb3();

  // Load campaign data
  const loadCampaign = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchCampaignById(id);
      setCampaign(data);

      try {
        const stats = await getCampaignOnChainStats(id);
        setOnChainStats(stats);
      } catch {
        setOnChainStats(null);
      }
    } catch {
      toast.error("Failed to load campaign details.");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  const campaignUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaigns/${id}`
      : "";

  // ETH Contribution
  const handleContribute = async () => {
    if (!campaign) { toast.error("Campaign data not available."); return; }
    if (!campaign.walletAddress) { toast.error("Campaign wallet address not found!"); return; }
    if (!contributionAmount || isNaN(contributionAmount) || Number(contributionAmount) <= 0) {
      toast.error("Please enter a valid amount to contribute.");
      return;
    }

    try {
      setIsContributing(true);
      const receipt = await contributeToWallet(
        campaign.walletAddress,
        contributionAmount,
        id
      );

      if (receipt) {
        await updateCampaignStats(id, parseFloat(contributionAmount));
        await loadCampaign();
        setContribution("");
        toast.success(`Successfully contributed ${contributionAmount} ETH!`);
      }
    } catch (error) {
      console.error("Contribution failed:", error);
    } finally {
      setIsContributing(false);
    }
  };

  // Withdraw funds (creator only)
  const handleWithdraw = async () => {
    if (!id) return;
    try {
      setIsWithdrawing(true);
      toast.loading("Withdrawing funds from contract...", { id: "withdraw" });
      await withdrawCampaignFunds(id);
      toast.dismiss("withdraw");
      toast.success("Funds withdrawn successfully to your wallet!");
      await loadCampaign();
    } catch (error) {
      toast.dismiss("withdraw");
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        toast.error("Withdrawal cancelled.");
      } else {
        toast.error(`Withdrawal failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <p className="text-ink-2 text-sm flex items-center gap-1.5 font-medium">
            <Info size={16} /> Fetching campaign details...
          </p>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  const displayCollected = onChainStats
    ? onChainStats.collectedEth
    : (campaign.collected || 0);
  const displayContributors = onChainStats
    ? onChainStats.contributorCount
    : (campaign.contributors || 0);

  const progressPercentage = Math.min(
    (displayCollected / campaign.amount) * 100,
    100
  );
  const isGoalReached = progressPercentage >= 100;

  const isCreator =
    account &&
    campaign.walletAddress &&
    account.toLowerCase() === campaign.walletAddress.toLowerCase();

  const hasOnChainFunds =
    onChainStats && onChainStats.collectedEth > 0;

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back navigation & Share buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-xs font-semibold text-ink-2 hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} /> Back to campaigns
          </button>
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-paper-2-glass backdrop-blur border border-rule hover:bg-paper-3-glass text-xs font-semibold rounded-lg text-ink transition-all"
          >
            <Share2 size={14} /> Share Campaign
          </button>
        </div>

        {/* Split Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visuals and Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-rule-strong shadow-sm bg-paper-2-glass backdrop-blur">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                  {campaign.category}
                </span>
                {onChainStats ? (
                  <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <ExternalLink size={12} /> Verified On-Chain
                  </span>
                ) : (
                  <span className="bg-warning text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle size={12} /> Pending Registration
                  </span>
                )}
              </div>
            </div>

            {/* Campaign Story */}
            <div className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule shadow-sm space-y-4">
              <h1 className="text-2xl font-extrabold text-ink leading-snug">
                {campaign.title}
              </h1>
              <div className="border-t border-rule pt-4">
                <h3 className="text-xs font-bold text-ink-2 tracking-wider uppercase mb-2">Campaign Description</h3>
                <p className="text-ink text-sm leading-relaxed whitespace-pre-line">
                  {campaign.description}
                </p>
              </div>

              {campaign.documents && (
                <div className="border-t border-rule pt-4">
                  <h3 className="text-xs font-bold text-ink-2 tracking-wider uppercase mb-2">Supporting Verification Documents</h3>
                  <div className="flex flex-col gap-2">
                    {campaign.documents.split(',').map((url, idx) => (
                      <a
                        key={idx}
                        href={url.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-semibold text-accent hover:underline"
                      >
                        <ExternalLink size={12} /> View verification report {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Funding Status & Tools */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Goal Card */}
            <div className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold text-ink-2 block mb-1">Target Funding Goal</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-ink">{campaign.amount}</span>
                  <span className="text-md font-bold text-accent">ETH</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-ink-2">Collected thus far</span>
                  <span className="font-mono text-ink font-bold">{displayCollected.toFixed ? displayCollected.toFixed(4) : displayCollected} ETH</span>
                </div>
                
                <div className="w-full bg-paper-3-glass backdrop-blur-sm rounded-full h-2 overflow-hidden border border-rule">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isGoalReached ? "bg-success" : "bg-accent"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-ink-2 font-medium">
                  <span>{progressPercentage.toFixed(1)}% Completed</span>
                  {isGoalReached && <span className="text-success font-semibold flex items-center gap-0.5"><CheckCircle size={10} /> Fully Funded</span>}
                </div>
              </div>

              {/* Backer counts */}
              <div className="grid grid-cols-2 gap-4 border-t border-rule pt-4">
                <div>
                  <span className="text-[10px] font-semibold text-ink-2 uppercase block">Backers</span>
                  <span className="text-lg font-bold text-ink">{displayContributors}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-ink-2 uppercase block">Escrow Mode</span>
                  <span className="text-xs font-bold text-ink flex items-center gap-1 mt-0.5">
                    {onChainStats ? (
                      <><Zap size={12} className="text-purple-600" /> Contract</>
                    ) : (
                      <><Wallet size={12} className="text-amber-600" /> P2P Fallback</>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Donation Area */}
            <div className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent" />
                Contribute to Project
              </h3>

              {/* Toggles */}
              <div className="flex bg-paper-3-glass backdrop-blur-sm rounded-lg p-1 border border-rule">
                <button
                  onClick={() => setPaymentMethod("eth")}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${
                    paymentMethod === "eth"
                      ? "bg-accent text-white shadow-sm"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  Ethereum (ETH)
                </button>
                <button
                  onClick={() => setPaymentMethod("upi")}
                  disabled={!campaign.upiId}
                  className="flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all text-ink-2 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  UPI (Rupees)
                </button>
              </div>

              {/* ETH Box */}
              {paymentMethod === "eth" ? (
                <div className="space-y-4">
                  {/* Warning if fallback is active */}
                  {!onChainStats && (
                    <div className="bg-warning-bg border border-warning-border p-3 rounded-lg flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-warning block leading-tight">DIRECT WALLET TRANSFER</span>
                        <p className="text-[10px] text-ink mt-0.5 leading-normal">
                          This campaign has not been registered on the smart contract yet. Donations go directly to the creator's wallet without contract escrow safety.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={contributionAmount}
                      onChange={(e) => setContribution(e.target.value)}
                      placeholder="Amount in ETH"
                      className="flex-1 px-3 py-2 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      onClick={handleContribute}
                      disabled={isContributing}
                      className="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isContributing ? (
                        <><Loader2 size={12} className="animate-spin" /> Sending...</>
                      ) : (
                        <><Heart size={12} /> Support</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-success-bg border border-success-border p-3 rounded-lg flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-success block leading-tight">OFF-CHAIN DIRECT UPI</span>
                      <p className="text-[10px] text-ink mt-0.5 leading-normal">
                        INR payments directly transfer to the creator's bank account. These are not secured, held, or verified by our smart contract.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpiModal(true)}
                    className="w-full py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CreditCard size={14} /> Pay via UPI QR / Address
                  </button>
                </div>
              )}
            </div>

            {/* Creator Panel */}
            {isCreator && (
              <div className="bg-paper-2-glass backdrop-blur p-6 rounded-xl border border-rule shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  Creator Panel
                </h3>
                {onChainStats ? (
                  <div className="space-y-3">
                    <p className="text-xs text-ink-2">
                      {hasOnChainFunds
                        ? `A total of ${onChainStats.collectedEth.toFixed(4)} ETH is held in the smart contract escrow and available to withdraw.`
                        : "There are no contract funds to withdraw at this time."}
                    </p>
                    <button
                      onClick={handleWithdraw}
                      disabled={isWithdrawing || !hasOnChainFunds}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      {isWithdrawing ? (
                        <><Loader2 size={12} className="animate-spin" /> Withdrawing...</>
                      ) : (
                        <><Download size={14} /> Withdraw On-Chain Escrow</>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-paper-3-glass backdrop-blur-sm p-3 rounded-lg border border-rule">
                    <p className="text-[10px] text-ink-2 leading-normal">
                      This campaign hasn't been registered on the blockchain contract by the admin yet. Escrow withdrawals will become available once registered.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Modals */}
      {campaign?.upiId && (
        <UpiPaymentModal
          isOpen={showUpiModal}
          onClose={() => setShowUpiModal(false)}
          upiId={campaign.upiId}
          campaignTitle={campaign.title}
        />
      )}

      {isShareOpen && (
        <ShareCampaignModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          campaignUrl={campaignUrl}
          campaignTitle={campaign.title}
        />
      )}
    </div>
  );
};

export default CampaignDetails;
