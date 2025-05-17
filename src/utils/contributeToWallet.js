import { ethers } from "ethers";
import { toast } from "react-hot-toast";

/**
 * Sends ETH to a given wallet address using MetaMask and ethers.js
 * Includes full validation: MetaMask presence, wallet format, amount value, and balance check.
 * @param {string} walletAddress - Recipient wallet address
 * @param {string | number} amountEth - Amount in ETH to send
 * @returns {Promise<object>} Transaction receipt
 */
export const contributeToWallet = async (walletAddress, amountEth) => {
  try {
    // Check if MetaMask is available
    if (!window.ethereum) {
      toast.error("MetaMask is not installed.",);
    
    }

    // Validate wallet address
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast.error("Invalid or missing wallet address.",);
 
    }

    // Validate amount
    if (!amountEth || isNaN(amountEth) || Number(amountEth) <= 0) {
      toast.error("Enter a valid amount greater than 0.",);
     
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // Check user's ETH balance
    const userBalanceWei = await provider.getBalance(userAddress);
    const userBalanceEth = Number(ethers.formatEther(userBalanceWei));
    const contribution = Number(amountEth);

    if (contribution > userBalanceEth) {
      toast.error("Insufficient ETH balance to contribute.");
         }

    // Convert to Wei and send transaction
    const amountInWei = ethers.parseEther(amountEth.toString());
    const tx = await signer.sendTransaction({
      to: walletAddress,
      value: amountInWei,
    });

    toast.success("Transaction sent. Waiting for confirmation...");
    return await tx.wait(); // Returns the receipt
  } catch (error) {
    console.error("Contribution failed:", error);
    throw error;
  }
};
