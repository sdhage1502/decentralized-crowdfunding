// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title CrowdfundingFactory
 * @notice Simple on-chain crowdfunding contract.
 *
 * Architecture (Hybrid model):
 *  - Firebase Firestore holds campaign metadata (title, description, image, etc.)
 *  - This contract holds ETH contributions and tracks on-chain totals.
 *  - The Firestore campaign document ID is used as the campaignId here so
 *    both data stores stay linked.
 *
 * Flow:
 *  1. Admin approves a campaign in Firebase.
 *  2. Frontend calls registerCampaign() with the Firestore doc ID and creator wallet.
 *  3. Contributors call contribute(campaignId) with ETH attached.
 *  4. Campaign creator calls withdrawFunds(campaignId) to pull collected ETH.
 */
contract CrowdfundingFactory {

    // ─────────────────────────────────────────────────────────────────────────
    // Data structures
    // ─────────────────────────────────────────────────────────────────────────

    struct Campaign {
        string  firestoreId;      // Firestore document ID (links to off-chain metadata)
        address payable creator;  // Wallet that receives withdrawals
        uint256 goalWei;          // Funding goal in wei
        uint256 collectedWei;     // Total ETH collected so far
        uint256 contributorCount; // Number of unique contributors
        bool    isActive;         // Admin can deactivate
        bool    exists;           // Guard to prevent double-registration
    }

    // campaignId (Firestore doc ID string) → Campaign
    mapping(string => Campaign) private campaigns;

    // Track unique contributors per campaign
    mapping(string => mapping(address => bool)) private hasContributed;

    // ─────────────────────────────────────────────────────────────────────────
    // Access control
    // ─────────────────────────────────────────────────────────────────────────

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "CrowdfundingFactory: caller is not the owner");
        _;
    }

    modifier campaignExists(string memory campaignId) {
        require(campaigns[campaignId].exists, "CrowdfundingFactory: campaign not found");
        _;
    }

    modifier campaignActive(string memory campaignId) {
        require(campaigns[campaignId].isActive, "CrowdfundingFactory: campaign is not active");
        _;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event CampaignRegistered(
        string indexed campaignId,
        address indexed creator,
        uint256 goalWei
    );

    event ContributionReceived(
        string indexed campaignId,
        address indexed contributor,
        uint256 amountWei
    );

    event FundsWithdrawn(
        string indexed campaignId,
        address indexed creator,
        uint256 amountWei
    );

    event CampaignStatusChanged(string indexed campaignId, bool isActive);

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Owner / Admin functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Register a campaign on-chain after admin approval in Firebase.
     * @param campaignId  Firestore document ID (links to off-chain metadata)
     * @param creator     ETH wallet address of the campaign creator
     * @param goalEth     Funding goal in ETH (converted to wei internally)
     */
    function registerCampaign(
        string memory campaignId,
        address payable creator,
        uint256 goalEth
    ) external onlyOwner {
        require(!campaigns[campaignId].exists, "CrowdfundingFactory: campaign already registered");
        require(creator != address(0), "CrowdfundingFactory: invalid creator address");
        require(goalEth > 0, "CrowdfundingFactory: goal must be greater than zero");

        uint256 goalWei = goalEth * 1 ether;

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
    function setCampaignActive(string memory campaignId, bool active)
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
     * @param campaignId  Firestore document ID of the campaign to support
     */
    function contribute(string memory campaignId)
        external
        payable
        campaignExists(campaignId)
        campaignActive(campaignId)
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
     * @param campaignId  Firestore document ID
     */
    function withdrawFunds(string memory campaignId)
        external
        campaignExists(campaignId)
    {
        Campaign storage c = campaigns[campaignId];
        require(msg.sender == c.creator, "CrowdfundingFactory: only creator can withdraw");
        require(c.collectedWei > 0, "CrowdfundingFactory: no funds to withdraw");

        uint256 amount = c.collectedWei;
        c.collectedWei = 0; // Reset before transfer (re-entrancy guard pattern)

        c.creator.transfer(amount);

        emit FundsWithdrawn(campaignId, c.creator, amount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Get on-chain stats for a campaign.
     * @return collectedWei     Total ETH collected (in wei)
     * @return contributorCount Number of unique contributors
     * @return goalWei          Funding goal (in wei)
     * @return isActive         Whether the campaign is currently active
     * @return creator          Creator wallet address
     */
    function getCampaign(string memory campaignId)
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
    function isCampaignRegistered(string memory campaignId)
        external
        view
        returns (bool)
    {
        return campaigns[campaignId].exists;
    }
}
