/**
 * contributeToWallet.js
 *
 * Handles ETH contributions through the CrowdfundingFactory smart contract.
 * ETH is sent to the contract (not directly to the creator wallet), which
 * tracks contributions on-chain. The creator can later call withdrawFunds().
 *
 * Falls back to direct wallet transfer if the campaign is not yet
 * registered on-chain (e.g. admin just approved, contract tx still pending).
 */

import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { contributeToContract, getCampaignOnChainStats } from "./contractService";

/**
 * Contribute ETH to a campaign.
 *
 * @param {string} walletAddress  Creator wallet (used for direct fallback only)
 * @param {string|number} amountEth  Amount in ETH
 * @param {string} campaignId    Firestore document ID (used for contract call)
 * @returns {Promise<object>} Transaction receipt
 */
export const contributeToWallet = async (walletAddress, amountEth, campaignId) => {
  if (typeof window === "undefined" || !window.ethereum) {
    toast.error("MetaMask is not installed.");
    throw new Error("MetaMask not installed");
  }

  if (!amountEth || isNaN(amountEth) || Number(amountEth) <= 0) {
    toast.error("Enter a valid amount greater than 0.");
    throw new Error("Invalid amount");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // Balance check
    const userBalanceWei = await provider.getBalance(userAddress);
    const userBalanceEth = parseFloat(ethers.formatEther(userBalanceWei));
    const contribution   = Number(amountEth);

    if (contribution > userBalanceEth) {
      toast.error(
        `Insufficient balance. You have ${userBalanceEth.toFixed(4)} ETH.`
      );
      throw new Error("Insufficient ETH balance");
    }

    const pendingToast = toast.loading("Processing transaction...");

    let receipt;

    // ── Try on-chain contract contribution first ─────────────────────────
    if (campaignId) {
      try {
        const onChainStats = await getCampaignOnChainStats(campaignId);

        if (onChainStats && onChainStats.isActive) {
          // Campaign is registered on-chain — use the contract
          toast.dismiss(pendingToast);
          toast.loading("Sending to contract...", { id: "contrib" });

          receipt = await contributeToContract(campaignId, amountEth);

          toast.dismiss("contrib");
          toast.success(
            `Contributed ${amountEth} ETH on-chain! Tx: ${receipt.hash.slice(0, 10)}...`
          );
          return receipt;
        }
      } catch (contractError) {
        // Contract call failed — fall through to direct transfer
        console.warn(
          "Contract contribution failed, falling back to direct transfer:",
          contractError.message
        );
      }
    }

    // ── Fallback: direct peer-to-peer ETH transfer ───────────────────────
    // Used when the campaign is not yet registered on-chain.
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast.dismiss(pendingToast);
      toast.error("Invalid wallet address and campaign not on-chain.");
      throw new Error("No valid contribution method available");
    }

    toast.dismiss(pendingToast);
    const fallbackToast = toast.loading(
      "Campaign not yet on-chain — sending directly to creator wallet..."
    );

    const amountInWei = ethers.parseEther(amountEth.toString());
    const tx = await signer.sendTransaction({ to: walletAddress, value: amountInWei });
    receipt = await tx.wait();

    toast.dismiss(fallbackToast);
    toast.success(
      `Contributed ${amountEth} ETH directly! Tx: ${receipt.hash.slice(0, 10)}...`
    );

    return receipt;

  } catch (error) {
    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      toast.error("Transaction rejected by user.");
    } else if (!error.message?.includes("Insufficient")) {
      toast.error(`Transaction failed: ${error.message || "Unknown error"}`);
    }
    throw error;
  }
};
