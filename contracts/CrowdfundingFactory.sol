// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CrowdfundingFactory
 * @notice Simple on-chain crowdfunding contract.
 *
 * Architecture (Hybrid model):
 *  - Firebase Firestore holds campaign metadata (title, description, image, etc.)
 *  - This contract holds ETH contributions and tracks on-chain totals.
 *  - The Firestore campaign document ID (converted to bytes32) is used as the campaignId.
 *
 * Flow:
 *  1. Admin approves a campaign in Firebase.
 *  2. Frontend calls registerCampaign() with the bytes32 doc ID and creator wallet.
 *  3. Contributors call contribute(campaignId) with ETH attached.
 *  4. Campaign creator calls withdrawFunds(campaignId) to pull collected ETH.
 */
contract CrowdfundingFactory is Ownable, ReentrancyGuard {

    // ─────────────────────────────────────────────────────────────────────────
    // Data structures
    // ─────────────────────────────────────────────────────────────────────────

    struct Campaign {
        bytes32 firestoreId;      // Firestore document ID encoded as bytes32
        address payable creator;  // Wallet that receives withdrawals
        uint256 goalWei;          // Funding goal in wei
        uint256 collectedWei;     // Total ETH collected so far
        uint256 contributorCount; // Number of unique contributors
        bool    isActive;         // Admin can deactivate
        bool    exists;           // Guard to prevent double-registration
    }

    // campaignId (bytes32 format of Firestore doc ID) → Campaign
    mapping(bytes32 => Campaign) private campaigns;

    // Track unique contributors per campaign
    mapping(bytes32 => mapping(address => bool)) private hasContributed;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event CampaignRegistered(
        bytes32 indexed campaignId,
        address indexed creator,
        uint256 goalWei
    );

    event ContributionReceived(
        bytes32 indexed campaignId,
        address indexed contributor,
        uint256 amountWei
    );

    event FundsWithdrawn(
        bytes32 indexed campaignId,
        address indexed creator,
        uint256 amountWei
    );

    event CampaignStatusChanged(bytes32 indexed campaignId, bool isActive);

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Modifiers
    // ─────────────────────────────────────────────────────────────────────────

    modifier campaignExists(bytes32 campaignId) {
        require(campaigns[campaignId].exists, "CrowdfundingFactory: campaign not found");
        _;
    }

    modifier campaignActive(bytes32 campaignId) {
        require(campaigns[campaignId].isActive, "CrowdfundingFactory: campaign is not active");
        _;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Owner / Admin functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Register a campaign on-chain after admin approval in Firebase.
     * @param campaignId  bytes32 representation of Firestore document ID
     * @param creator     ETH wallet address of the campaign creator
     * @param goalWei     Funding goal in wei
     */
    function registerCampaign(
        bytes32 campaignId,
        address payable creator,
        uint256 goalWei
    ) external onlyOwner {
        require(!campaigns[campaignId].exists, "CrowdfundingFactory: campaign already registered");
        require(creator != address(0), "CrowdfundingFactory: invalid creator address");
        require(goalWei > 0, "CrowdfundingFactory: goal must be greater than zero");

        campaigns[campaignId] = Campaign({
            firestoreId:      campaignId,
            creator:          creator,
            goalWei:          goalWei,
            collectedWei:     0,
            contributorCount: 0,
            isActive:         true,
            exists:           true
        });

        emit CampaignRegistered(campaignId, creator, goalWei);
    }

    /**
     * @notice Toggle a campaign's active status (admin only).
     */
    function setCampaignActive(bytes32 campaignId, bool active)
        external
        onlyOwner
        campaignExists(campaignId)
    {
        campaigns[campaignId].isActive = active;
        emit CampaignStatusChanged(campaignId, active);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Contribute ETH to a campaign. ETH is held by this contract.
     * @param campaignId  bytes32 representation of Firestore document ID
     */
    function contribute(bytes32 campaignId)
        external
        payable
        campaignExists(campaignId)
        campaignActive(campaignId)
        nonReentrant
    {
        require(msg.value > 0, "CrowdfundingFactory: contribution must be greater than zero");

        Campaign storage c = campaigns[campaignId];

        c.collectedWei += msg.value;

        // Count unique contributors
        if (!hasContributed[campaignId][msg.sender]) {
            hasContributed[campaignId][msg.sender] = true;
            c.contributorCount += 1;
        }

        emit ContributionReceived(campaignId, msg.sender, msg.value);
    }

    /**
     * @notice Withdraw collected ETH. Only the campaign creator can call this.
     * @param campaignId  bytes32 representation of Firestore document ID
     */
    function withdrawFunds(bytes32 campaignId)
        external
        campaignExists(campaignId)
        nonReentrant
    {
        Campaign storage c = campaigns[campaignId];
        require(msg.sender == c.creator, "CrowdfundingFactory: only creator can withdraw");
        require(c.collectedWei > 0, "CrowdfundingFactory: no funds to withdraw");

        uint256 amount = c.collectedWei;
        c.collectedWei = 0; // Reset before transfer (re-entrancy guard pattern)

        (bool success, ) = c.creator.call{value: amount}("");
        require(success, "CrowdfundingFactory: Transfer failed");

        emit FundsWithdrawn(campaignId, c.creator, amount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Get on-chain stats for a campaign.
     */
    function getCampaign(bytes32 campaignId)
        external
        view
        campaignExists(campaignId)
        returns (
            uint256 collectedWei,
            uint256 contributorCount,
            uint256 goalWei,
            bool    isActive,
            address creator
        )
    {
        Campaign storage c = campaigns[campaignId];
        return (
            c.collectedWei,
            c.contributorCount,
            c.goalWei,
            c.isActive,
            c.creator
        );
    }

    /**
     * @notice Returns true if the campaign has been registered on-chain.
     */
    function isCampaignRegistered(bytes32 campaignId)
        external
        view
        returns (bool)
    {
        return campaigns[campaignId].exists;
    }
}
