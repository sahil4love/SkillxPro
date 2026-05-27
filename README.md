# 🎓 SkillxPro — Next-Gen Peer-to-Peer Knowledge Exchange Network

<div align="center">

[![GSSoC 2026](https://img.shields.io/badge/GSSoC-2026-brightgreen?style=for-the-badge&logo=github)](https://gssoc.girlscript.tech/)
[![Open Source Love](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)](#)
[![Vite Build](https://img.shields.io/badge/Vite-Build%20Passing-blue?style=for-the-badge&logo=vite)](#)
[![Tech Stack](https://img.shields.io/badge/React%2018-TypeScript%20%2B%20Tailwind-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**SkillxPro** is a premium, borderless peer-to-peer LMS and knowledge barter network. It completely eliminates traditional currency, replacing it with **Knowledge Tokens** to foster a self-sustaining peer learning ecosystem where you can be a passionate student today and an expert mentor tomorrow.

[Explore Codebase](#-architecture-overview) • [Quick Setup](#-local-development-guide) • [Contributing Guidelines](CONTRIBUTING.md)

</div>

---

## ⚡ Why SkillxPro? (Core Philosophy & Mechanics)

In traditional systems, education is locked behind high financial barriers. **SkillxPro** bridges this gap using a local, stateful, and decentralized peer ledger:

*   **🎓 Equalizer Credit:** Every newly registered user receives a welcome bonus of `200 Knowledge Tokens` to immediately kickstart their learning.
*   **💡 Knowledge Liquidity:** Host high-quality virtual classes to earn tokens directly from your peers, expanding your personal wallet.
*   **🚀 Limitless Reinvestment:** Spend your earned ledger tokens to unlock masterclasses in coding, visual design, public speaking, or marketing.
*   **🛡️ Pure Sandbox Isolation:** SkillxPro works entirely inside an active React `localStorage` database. Enjoy a stateful messaging chat hub, responsive class completion managers, and administrator dashboard controls out of the box with zero external configuration!

---

## ✨ Interface Highlights (Google Developers Material 3 Theme)

The interface has been redesigned to reflect a premium, state-of-the-art **Google Developers M3** design aesthetic:

*   **🎨 Premium HSL Palette:** Tailored brand colors (Hex `#4285F4`, `#34A853`, `#FBBC04`, `#EA4335`) combined with high-contrast neutral backgrounds.
*   **🔄 Animated 3D Flip Card:** A dynamic showcase card in the hero container that flips smoothly every 4 seconds to alternate between live network metrics with zero layout shifts.
*   **🌟 Polished Glassmorphic Pill:** An ultra-premium announcement badge featuring a pulsing gradient `NEW` tag and a slowly rotating sparkles icon.
*   **📱 12-Column Responsive Bento Grid:** Structured feature deck utilizing custom shadow elevations, interactive borders, and smooth transform scaling.
*   **💎 Custom Material Icons**: Clean, sharp ligatures powered by the official Google Material Symbols library.

---

## 📁 Architecture Overview

SkillxPro is structured as an organized monorepo workspace for maximum clarity:

```
SkillxPro/
├── .github/                 # Git issue templates & validation schemas
├── apps/
│   └── web/                 # React 18 + TS + Tailwind Client Application (Vite)
│       ├── src/
│       │   ├── components/  # Shared layouts (Pill Navbars, Footers, Bento Cards)
│       │   ├── context/     # AuthContext & reactive localStorage ledger core
│       │   ├── pages/       # Responsive views (Home, Login, Dashboard, Admin)
│       │   ├── types.ts     # Strict TypeScript type models
│       │   └── main.tsx     # SPA entry point
├── CONTRIBUTING.md          # Guidelines for GSSoC contributors
├── ROADMAP.md               # Feature backlog & task complexity lists
└── LICENSE                  # MIT License Open Source
```

---

## 🚀 Local Development Guide

Get your own local development instance of SkillxPro running in minutes:

### Prerequisites
*   **Node.js** (v18.0.0 or higher)
*   **npm** (or yarn)

### Step-by-Step Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/sahil4love/SkillxPro.git
    cd SkillxPro
    ```

2.  **Navigate to the Client Workspace & Install Dependencies**
    ```bash
    cd apps/web
    npm install
    ```

3.  **Launch the Hot-Reloaded Dev Server**
    ```bash
    npm run dev
    ```
    *Open your browser and navigate to [http://localhost:3000](http://localhost:3000)*

4.  **Confirm Build Pass Rules**
    ```bash
    npm run build
    ```

---

## 🤝 Contribution Guidelines (GSSoC 2026)

SkillxPro welcomes all open-source contributions! Check out our [CONTRIBUTING.md](CONTRIBUTING.md) to set up your branch names, write semantic commits, and match our high-fidelity coding guidelines. Let's make this project a flagship of GSSoC 2026! 🚀
