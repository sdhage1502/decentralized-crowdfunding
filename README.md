# 🧠 Decentralized Crowdfunding DApp

A **decentralized crowdfunding platform** built using **Next.js (App Router)** on the frontend and **Solidity smart contracts** deployed to an Ethereum-compatible blockchain. This DApp enables users to **create fundraising campaigns**, **view campaign details**, and **contribute ETH** securely using MetaMask. All campaign metadata is stored in **Firebase Firestore**, media assets are managed by **Cloudinary**, while financial transactions and totals are stored **on-chain**, ensuring full **transparency, security, and decentralization**.

---

## 🚀 Live Demo

🔗 [Visit the Live App](https://decentralized-crowdfunding-woad.vercel.app)  

---

## 📚 Table of Contents

- [Project Purpose](#project-purpose)
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Codebase Structure](#codebase-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Available Scripts](#available-scripts)
- [Code Quality & Standards](#code-quality--standards)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Author](#author)

---

## 🎯 Project Purpose

The Decentralized Crowdfunding DApp was built to solve the transparency and trust issues prevalent in traditional crowdfunding platforms (e.g., Kickstarter, GoFundMe). 

**What it does:** It allows users to create, manage, and contribute to fundraising campaigns.
**Why it exists:** To eliminate middlemen, reduce fees, and provide immutable proof of funds raised.
**Target Users:** Campaign creators seeking transparent funding, and crypto-native users looking to support projects securely.
**Core Business Goal:** Bridge the gap between Web2 usability and Web3 trustless execution.

---

## 🏗 Architecture Overview

The application utilizes a **Hybrid Architecture**:

1. **Frontend (Next.js):** Handles the UI, routing, and user interactions.
2. **Off-chain DB (Firebase Firestore & Cloudinary):** Stores heavy campaign metadata (rich text descriptions, categories) in Firebase, and images in Cloudinary to save gas costs on Ethereum.
3. **On-chain State (Ethereum Smart Contract):** Tracks ETH balances, individual contributions, and manages fund withdrawals securely via a `bytes32` mapped reference to the Firestore document.

### Flow Diagram

```mermaid
graph TD
    A[User/Browser] -->|Creates Campaign| B(Next.js App)
    B -->|Uploads Image via API| C(Cloudinary)
    B -->|Saves Metadata| D[(Firestore DB)]
    D -->|Doc ID| B
    B -->|Calls registerCampaign| E(Smart Contract)
    
    A -->|Contributes ETH| E
    E -->|Updates On-chain Total| E
    B -->|Listens to Contract/Firestore| A
```

---

## 🌟 Features

- 🔐 **Decentralized & Trustless** — Financial state is governed by the `CrowdfundingFactory.sol` smart contract.
- 💰 **Crypto Funding (ETH)** — Contribute securely using MetaMask with `ethers.js`.
- 🧾 **Real-Time Data Sync** — Off-chain metadata (Firestore `onSnapshot`) and on-chain metrics sync instantly without page reloads.
- 🆔 **ENS Name Resolution** — Custom `useENS` hook maps raw `0x...` Ethereum addresses to human-readable ENS names (e.g., vitalik.eth).
- 🔄 **Transaction Lifecycle Tracker** — Robust `useTransaction` hook monitors blockchain states (`idle → pending → confirming → confirmed`) with automatic toast notifications.
- 🖼️ **Cloudinary Image Uploads** — Direct Next.js API route integration for fast and optimized campaign image hosting.
- 🎨 **Premium UI & GSAP Animations** — Hydration-safe Dark/Light mode (`next-themes`), scroll-triggered animated counters, custom cursor-tracking spotlight background, and exact-dimension glassmorphic skeleton shimmer loaders.
- 🔍 **Dynamic SEO & OG Meta Tags** — Server-rendered Open Graph meta tags for rich social sharing previews of campaigns.
- 🛡️ **Admin Approval System** — Admin panel to approve/reject campaigns before they go live on-chain with 'Verified' badges.

---

## 🧰 Tech Stack

| Category | Technology | Reason for choosing |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server-side rendering, API routes, dynamic OG metadata, and optimized routing. |
| **Styling & UI** | Tailwind CSS v3, next-themes | Utility-first styling for rapid UI development and hydration-safe dark mode. |
| **Animations** | GSAP | High-performance, complex web animations (animated counters, spotlights). |
| **Smart Contracts**| Solidity (v0.8.28), Hardhat | Industry standard for Ethereum contract development and testing. |
| **Web3 Client** | Ethers.js (v6) | Connecting frontend UI to Ethereum blockchain and MetaMask. |
| **Database** | Firebase Firestore | NoSQL document database for fast, off-chain metadata storage and real-time listeners. |
| **Media Storage**| Cloudinary | Fast, optimized image hosting via Next.js serverless API routes. |
| **UI Components**| Radix UI / Lucide React | Accessible headless components and modern iconography. |

---

## 📂 Codebase Structure

```text
.
├── contracts/                  # Hardhat Smart Contracts (Solidity)
│   └── CrowdfundingFactory.sol # Core factory contract managing campaigns
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin dashboard for approving campaigns
│   │   ├── api/upload/         # Cloudinary image upload API route
│   │   ├── campaigns/          # Public campaign listings and details
│   │   ├── dashboard/          # Creator's private dashboard
│   │   ├── layout.jsx          # Root layout and context providers
│   │   └── page.jsx            # Landing page
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Base UI components (ThemeToggle, Skeletons, Headers)
│   │   └── modals/             # Share, UPI, and Confirmation modals
│   ├── context/                # React Context (e.g., Web3 connection state)
│   ├── hooks/                  # Custom hooks (`useENS`, `useTransaction`)
│   ├── lib/                    # SDK configurations (Cloudinary)
│   ├── firebase/               # Firebase initialization and config (`config.js`)
│   ├── utils/                  # Helper functions and services
│   │   ├── campaignService.js  # Firestore CRUD operations
│   │   ├── contractService.js  # Ethers.js contract interactions
│   │   └── constants.js        # ABI and Contract Addresses
├── test/                       # Hardhat smart contract test suites
├── public/                     # Static assets (images, fonts, icons)
├── hardhat.config.js           # Hardhat configuration (networks, compiler)
├── next.config.mjs             # Next.js config (Remote patterns for images)
└── package.json                # Project dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MetaMask** browser extension installed.
- **Firebase Account** with Firestore enabled.
- **Cloudinary Account** for image storage.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sdhage1502/decentralized-crowdfunding.git
   cd decentralized-crowdfunding
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory. This file is required for Firebase integration, Cloudinary, and Next.js setup.

```env
# Firebase Configuration (Get these from your Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Smart Contract (Set after deploying via Hardhat)
NEXT_PUBLIC_CONTRACT_ADDRESS="your-deployed-contract-address"
```

> **Warning:** Never commit your `.env.local` file to version control.

---

## ⛓ Smart Contract Deployment

To run a local blockchain and deploy the contract for development:

1. **Start Hardhat local node:**
   ```bash
   npx hardhat node
   ```

2. **Deploy the contract:**
   Open a new terminal window:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Update Frontend Constants:**
   Copy the deployed contract address from the terminal output and update your `.env.local` file or `src/utils/constants.js`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `localhost:3000`. |
| `npm run build` | Builds the Next.js application for production. |
| `npm run start` | Starts the production server (after running build). |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npx hardhat test` | Runs the smart contract unit tests using Chai/Mocha. |

---

## 📏 Code Quality & Standards

- **Component Architecture:** Functional React components using hooks. Custom hooks (`useENS`, `useTransaction`) encapsulate complex state logic.
- **Services:** All external API, Firebase, and Blockchain calls are abstracted into `src/utils/*Service.js` files.
- **Styling:** Tailwind CSS using custom CSS variables (e.g., `bg`, `surface`, `primary`) defined in `globals.css` to support `next-themes` Dark Mode natively.
- **Formatting:** ESLint is configured for Next.js strict mode. 

---

## 🌐 Deployment Guide

This project is optimized for deployment on **Vercel**.

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and create a new project.
3. Import your GitHub repository.
4. Add all environment variables from your `.env.local` to the Vercel Environment Variables section.
5. Click **Deploy**. Vercel will automatically run `npm run build`.

**Smart Contract Production Deployment:**
To deploy to a live testnet (e.g., Sepolia) or Mainnet, update `hardhat.config.js` with your RPC URL and Private Key, then run:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🛠 Troubleshooting

- **MetaMask doesn't connect:** Ensure you are on the correct network (Localhost 8545 for dev) and that the Hardhat node is running. Reset your MetaMask account if you get nonce errors.
- **Firebase Permission Denied:** Check your Firestore security rules (`firestore.rules`). Ensure read/write access is properly configured.
- **Image Upload Fails:** Ensure your `CLOUDINARY_*` environment variables are correctly set.
- **Contract Calls Failing:** Verify that `NEXT_PUBLIC_CONTRACT_ADDRESS` matches exactly with the address generated by your recent Hardhat deployment.

---

## ❓ FAQ

**Q: Why use Firebase/Cloudinary if it's a Decentralized App?**
A: Storing large strings (like descriptions) and images on Ethereum is prohibitively expensive. We use a hybrid model: heavy data off-chain (Firebase/Cloudinary), financial truth on-chain (Solidity), bridging them via a `bytes32` document ID.

**Q: Can a creator withdraw funds before the goal is met?**
A: Currently, yes. The smart contract allows the creator to withdraw any collected funds at any time.

**Q: How is admin approval handled?**
A: Campaigns are saved to Firestore with `isActive = false`. The admin dashboard allows an authorized user to set it to `true` and call `registerCampaign` on the smart contract.

---

## 🔮 Future Improvements

**High Priority**
- Migrate off-chain metadata from Firebase to **IPFS / Arweave** for complete decentralization.
- Add refund mechanisms in the smart contract if funding goals are not met by a deadline.

**Medium Priority**
- Implement Subgraphs (The Graph) for faster on-chain data querying.
- Add comprehensive user profiles and contribution history.

**Nice-to-have**
- Support for ERC-20 tokens (e.g., USDT, USDC) instead of just raw ETH.
- Email or push notifications for campaign milestones.

---

## 👨‍💻 Author

**Shreyash Dhage** – Full Stack Developer  
📍 Pune, India  
📧 [sdhage1502@gmail.com](mailto:sdhage1502@gmail.com)  
🔗 [GitHub](https://github.com/sdhage1502) | [LinkedIn](https://www.linkedin.com/in/shreyashdhage/)

---

## ⭐ Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/sdhage1502/decentralized-crowdfunding/issues). If you like this project, please consider giving it a ⭐ on GitHub.
