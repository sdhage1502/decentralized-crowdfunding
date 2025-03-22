// // contracts/Campaign.sol
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract Campaign {
//     struct CampaignData {
//         address creator;
//         string title;
//         string description;
//         uint256 goal;
//         uint256 balance;
//         bool isActive;
//         uint256 deadline;
//     }

//     mapping(uint256 => CampaignData) public campaigns;
//     mapping(uint256 => address[]) public contributors;
//     mapping(uint256 => uint256[]) public contributions;
//     uint256 public campaignCount;

//     event CampaignCreated(uint256 id, address creator, uint256 goal);
//     event ContributionMade(uint256 id, address contributor, uint256 amount);
//     event CampaignClosed(uint256 id);
//     event GoalUpdated(uint256 id, uint256 newGoal);

//     function createCampaign(
//         string memory _title,
//         string memory _description,
//         uint256 _goal,
//         uint256 _deadline
//     ) public {
//         require(_goal > 0, "Goal must be greater than 0");
//         require(_deadline > block.timestamp, "Deadline must be in the future");
        
//         campaignCount++;
//         campaigns[campaignCount] = CampaignData(
//             msg.sender,
//             _title,
//             _description,
//             _goal,
//             0,
//             true,
//             _deadline
//         );
//         emit CampaignCreated(campaignCount, msg.sender, _goal);
//     }

//     function contribute(uint256 _id) public payable {
//         CampaignData storage campaign = campaigns[_id];
//         require(campaign.isActive, "Campaign is not active");
//         require(block.timestamp < campaign.deadline, "Campaign deadline has passed");
//         require(msg.value > 0, "Contribution must be greater than 0");

//         campaign.balance += msg.value;
//         contributors[_id].push(msg.sender);
//         contributions[_id].push(msg.value);
//         emit ContributionMade(_id, msg.sender, msg.value);
//     }

//     function closeCampaign(uint256 _id) public {
//         CampaignData storage campaign = campaigns[_id];
//         require(msg.sender == campaign.creator, "Only creator can close campaign");
//         campaign.isActive = false;
//         emit CampaignClosed(_id);
//     }

//     function updateGoal(uint256 _id, uint256 _newGoal) public {
//         CampaignData storage campaign = campaigns[_id];
//         require(msg.sender == campaign.creator, "Only creator can update goal");
//         require(_newGoal > campaign.goal, "New goal must be higher than current goal");
//         campaign.goal = _newGoal;
//         emit GoalUpdated(_id, _newGoal);
//     }
// }