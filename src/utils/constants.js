/**
 * Contract address is set automatically by scripts/deploy.js after deployment.
 *
 * To deploy locally:
 *   1. In one terminal: npx hardhat node
 *   2. In another:      npx hardhat run scripts/deploy.js --network localhost
 *
 * The deploy script will replace the address below automatically.
 */
export const contractAddress = "0x0000000000000000000000000000000000000000"; // replaced by deploy script

/**
 * ABI generated from: contracts/CrowdfundingFactory.sol
 * Last compiled: Solidity 0.8.28
 */
export const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "internalType": "string",  "name": "campaignId", "type": "string" },
      { "indexed": true,  "internalType": "address", "name": "creator",    "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "goalWei",    "type": "uint256" }
    ],
    "name": "CampaignRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "internalType": "string", "name": "campaignId", "type": "string" },
      { "indexed": false, "internalType": "bool",   "name": "isActive",   "type": "bool" }
    ],
    "name": "CampaignStatusChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "internalType": "string",  "name": "campaignId",  "type": "string" },
      { "indexed": true,  "internalType": "address", "name": "contributor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amountWei",   "type": "uint256" }
    ],
    "name": "ContributionReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "internalType": "string",  "name": "campaignId", "type": "string" },
      { "indexed": true,  "internalType": "address", "name": "creator",    "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amountWei",  "type": "uint256" }
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "campaignId", "type": "string" }
    ],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "campaignId", "type": "string" }
    ],
    "name": "getCampaign",
    "outputs": [
      { "internalType": "uint256", "name": "collectedWei",     "type": "uint256" },
      { "internalType": "uint256", "name": "contributorCount", "type": "uint256" },
      { "internalType": "uint256", "name": "goalWei",          "type": "uint256" },
      { "internalType": "bool",    "name": "isActive",         "type": "bool" },
      { "internalType": "address", "name": "creator",          "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "campaignId", "type": "string" }
    ],
    "name": "isCampaignRegistered",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string",          "name": "campaignId", "type": "string" },
      { "internalType": "address payable", "name": "creator",    "type": "address" },
      { "internalType": "uint256",         "name": "goalEth",    "type": "uint256" }
    ],
    "name": "registerCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "campaignId", "type": "string" },
      { "internalType": "bool",   "name": "active",     "type": "bool" }
    ],
    "name": "setCampaignActive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "campaignId", "type": "string" }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
