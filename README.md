# 🧠 Decentralized Crowdfunding DApp

This project is a **decentralized crowdfunding platform** built using **Next.js (App Router)** on the frontend and **Solidity smart contracts** deployed to an Ethereum-compatible blockchain. It allows users to **create fundraising campaigns**, **view campaign details**, and **contribute ETH** securely via their crypto wallets (like MetaMask). All contributions and campaign data are stored **on-chain** for transparency, immutability, and decentralization.

---

## 🔁 Workflow & Features

### 💡 1. Create Campaign
- Any user can create a campaign by providing:
  - Title
  - Description
  - Funding goal (in ETH)
  - Deadline (timestamp)
- The campaign is stored on-chain in a `Campaign` smart contract.

### 📢 2. View Campaign Details
- Visitors can view:
  - Campaign title and description
  - ETH raised vs goal
  - Deadline
  - List of contributors (wallet addresses)

### 💸 3. Contribute to Campaign
- Anyone can donate ETH to a live campaign.
- Contributions are recorded on-chain, updating the balance and contributor list in real time.

### 🚫 4. Campaign Closure (optional)
- The creator can close a campaign to prevent further donations.
- Optionally, the goal can be updated if more funds are needed.

---

## 🧱 Codebase Structure

### 📂 `/contracts/`
Contains Solidity smart contracts compiled and deployed via Hardhat.

#### ✅ `Campaign.sol`
- Handles campaign creation, contributions, goal updates, and state changes.
- Stores campaign data in a mapping with unique `campaignCount` identifiers.

### 📂 `/app/create/page.jsx`
Frontend page to **create a new campaign**.
- Form to collect user input.
- Calls `createCampaign()` on the smart contract using `ethers.js`.
- Tailwind CSS for styling.

### 📂 `/app/[id]/page.jsx`
Dynamic frontend page to **view and contribute** to a specific campaign.
- Fetches campaign details using `useParams()` and the campaign ID.
- Displays contributors, balance, goal, and deadline.
- Enables users to send ETH using the `contribute()` method.

### 📂 `/abi/Campaign.json`
ABI file auto-generated from the Solidity contract via Hardhat, used by `ethers.js` to interact with the smart contract.

---

## 🔧 Tech Stack

| Layer              | Tech/Tool                     |
|-------------------|-------------------------------|
| Smart Contracts    | Solidity, Hardhat             |
| Frontend           | Next.js (App Router)          |
| Wallet Integration | MetaMask, `ethers.js`         |
| Styling            | Tailwind CSS                  |
| Blockchain         | Ethereum testnet / Hardhat    |

---

## 🧪 How It Works

1. Smart contract is deployed using Hardhat.
2. ABI is exported and used in the frontend to connect with Ethereum.
3. Frontend enables users to:
   - Create campaigns
   - View campaign details
   - Contribute ETH using MetaMask
4. All data is stored **on-chain** for full transparency and decentralization.

---

## 🚀 Future Enhancements

- Real-time progress bars
- Campaign categories and filters
- Withdrawal feature for campaign owners
- IPFS integration for decentralized image hosting
- User dashboard with campaign history

---







This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
