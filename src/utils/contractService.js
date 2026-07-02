/**
 * contractService.js
 *
 * Helpers for interacting with the deployed CrowdfundingFactory contract.
 * All functions require MetaMask (window.ethereum) to be available.
 */

import { ethers } from "ethers";
import { contractAddress, contractABI } from "./constants";

/**
 * Returns a read-only contract instance (no signer needed).
 */
export const getReadOnlyContract = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not available.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(contractAddress, contractABI, provider);
};

/**
 * Returns a writable contract instance (signer required).
 * Will prompt MetaMask to connect if not already connected.
 */
export const getSignedContract = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

/**
 * Contribute ETH to a campaign via the smart contract.
 *
 * @param {string} campaignId   Firestore document ID (on-chain campaign key)
 * @param {string|number} amountEth  Amount to contribute in ETH
 * @returns {object} Transaction receipt
 */
export const contributeToContract = async (campaignId, amountEth) => {
  if (!campaignId) throw new Error("Campaign ID is required.");
  if (!amountEth || isNaN(amountEth) || Number(amountEth) <= 0) {
    throw new Error("Enter a valid amount greater than 0.");
  }

  const contract = await getSignedContract();

  // Verify campaign is registered on-chain before attempting contribution
  const isRegistered = await contract.isCampaignRegistered(campaignId);
  if (!isRegistered) {
    throw new Error(
      "This campaign is not yet registered on-chain. Please try again shortly after admin approval."
    );
  }

  const amountWei = ethers.parseEther(amountEth.toString());

  const tx = await contract.contribute(campaignId, { value: amountWei });
  const receipt = await tx.wait();
  return receipt;
};

/**
 * Fetch on-chain stats for a campaign.
 *
 * @param {string} campaignId  Firestore document ID
 * @returns {{ collectedEth: number, contributorCount: number, goalEth: number, isActive: boolean, creator: string } | null}
 */
export const getCampaignOnChainStats = async (campaignId) => {
  try {
    const contract = await getReadOnlyContract();
    const isRegistered = await contract.isCampaignRegistered(campaignId);
    if (!isRegistered) return null;

    const [collectedWei, contributorCount, goalWei, isActive, creator] =
      await contract.getCampaign(campaignId);

    return {
      collectedEth:     parseFloat(ethers.formatEther(collectedWei)),
      contributorCount: Number(contributorCount),
      goalEth:          parseFloat(ethers.formatEther(goalWei)),
      isActive,
      creator,
    };
  } catch {
    return null;
  }
};

/**
 * Register a campaign on-chain (called by admin after Firebase approval).
 * Only the contract owner (deployer) can call this.
 *
 * @param {string} campaignId      Firestore document ID
 * @param {string} creatorAddress  Campaign creator's ETH wallet address
 * @param {number} goalEth         Goal amount in ETH (integer only — contract stores as goalEth * 1 ether)
 * @returns {object} Transaction receipt
 */
export const registerCampaignOnChain = async (campaignId, creatorAddress, goalEth) => {
  if (!campaignId || !creatorAddress || !goalEth) {
    throw new Error("campaignId, creatorAddress, and goalEth are all required.");
  }

  const contract = await getSignedContract();

  // goalEth must be a whole number for the contract (it multiplies by 1 ether internally)
  // We round up to nearest whole ETH to avoid precision issues
  const goalEthRounded = Math.ceil(Number(goalEth));

  const tx = await contract.registerCampaign(campaignId, creatorAddress, goalEthRounded);
  const receipt = await tx.wait();
  return receipt;
};

/**
 * Withdraw collected ETH from a campaign (only the creator can call this).
 *
 * @param {string} campaignId  Firestore document ID
 * @returns {object} Transaction receipt
 */
export const withdrawCampaignFunds = async (campaignId) => {
  if (!campaignId) throw new Error("Campaign ID is required.");

  const contract = await getSignedContract();
  const tx = await contract.withdrawFunds(campaignId);
  const receipt = await tx.wait();
  return receipt;
};
