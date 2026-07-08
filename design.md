# Design System Specification: Decentralized Crowdfunding Platform

A premium, production-ready design blueprint for a **decentralized crowdfunding web app** built with Next.js (App Router) and Tailwind CSS.

---

## 0. Product Direction

### Website Purpose
A decentralized crowdfunding platform where users can launch fundraising campaigns, review verified causes, and contribute using Ethereum-based wallet flows.

### Target Audience
- Crypto-native users & Community backers
- Startup founders and social-impact organizers
- Users who need visible trust, legitimacy, and transaction clarity before contributing

### Core User Actions
1. Connect wallet
2. Explore trusted campaigns
3. Start a campaign
4. Contribute securely

### Design Principles
- Trust first (On-chain status, transparent metrics)
- One dominant action per layout block
- Premium through restraint, not decoration
- Clean Web3 product utility over landing-page theatrics
- Accessible and scannable text contrasts

---

## 1. Top-Level UX Direction

### Experience Model
The product has **two distinct UI modes**:

1. **Marketing / Discovery Layer**
   - Hero (Clear value metrics)
   - Value props (Why on-chain is safer)
   - How it works (Wallet -> Escrow -> Disbursal)
   - Featured campaigns & Trust badges

2. **Application / Dashboard Layer**
   - Wallet-connected state
   - Multistep campaign creation
   - Admin review / approval interfaces

### Core UX Rules
- The hero section uses **one primary CTA** and **one secondary CTA** maximum.
- `Connect Wallet` resides strictly in the header as a utility action, never as a competing hero layout element.
- Every campaign card must clearly group its core parameters: Title, Raised vs. Goal progress, trust state, and temporal deadlines.

---

## 2. Visual Direction

### Brand Feel
Premium, modern, trustworthy, technical, and calm.

### Visual Style
Use a restrained **deep-indigo + emerald-teal** accent system layered on top of neutral slate surfaces. Avoid glowing crypto-neon aesthetics, intense gradients, and excessive blurs. The application must look like an institutional financial product.

---

## 3. Color System

### A. Hex Palette

#### Core Neutrals
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `bg` | `#F8FAFC` | App/page background |
| `surface` | `#FFFFFF` | Primary cards and panels |
| `surface-alt` | `#F1F5F9` | Secondary panels and muted blocks |
| `border` | `#E2E8F0` | Default UI borders |

#### Text
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `text-strong` | `#0F172A` | Headings, key metrics |
| `text-body` | `#334155` | Main body copy |
| `text-muted` | `#64748B` | Supporting text, metadata |
| `text-inverse` | `#F8FAFC` | Text on dark/brand elements |

#### Brand & Accent
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `primary-600` | `#1E40AF` | Main brand CTA action |
| `primary-700` | `#1D4ED8` | Hover states |
| `accent-500` | `#0D9488` | On-chain progress, trust indicators |
| `accent-600` | `#0F766E` | Active highlights / metrics |

---

### B. Recommended Tailwind Token Mapping
```css
@theme {
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F1F5F9;
  --color-border: #E2E8F0;

  --color-text-strong: #0F172A;
  --color-text-body: #334155;
  --color-text-muted: #64748B;
  --color-text-inverse: #F8FAFC;

  --color-primary: #1E40AF;
  --color-primary-hover: #1D4ED8;
  --color-accent: #0D9488;
  --color-accent-hover: #0F766E;

  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-danger: #DC2626;
}

.dark {
  --color-bg: #090D16;
  --color-surface: #111827;
  --color-surface-alt: #1F2937;
  --color-border: #374151;

  --color-text-strong: #F8FAFC;
  --color-text-body: #E5E7EB;
  --color-text-muted: #9CA3AF;
  --color-text-inverse: #090D16;

  --color-primary: #3B82F6;
  --color-primary-hover: #60A5FA;
  --color-accent: #14B8A6;
  --color-accent-hover: #2DD4BF;

  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
}
```
