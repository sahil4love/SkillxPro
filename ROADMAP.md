# 🗺️ SkillxPro Feature Roadmap & Developer Backlog

Welcome to the future developer backlog for SkillxPro! This document outlines planned features, code refactors, and interface improvements categorized by engineering complexity. It serves as an informative guide for developers seeking to contribute or build upon this sandbox codebase.

---

## 🟢 Phase 1: Beginner Complexity

*Small UI enhancements and micro-interactions designed to improve user delight.*

### 🛠️ 1. Marketplace Categories Sliders
*   **Objective:** Refactor the category tags carousel in the marketplace to slide smoothly using custom controls.
*   **Design Touch:** Add an interactive border glow matching the primary purple-indigo theme when a category tag is active.
*   **Target File:** `src/pages/Dashboard.tsx`

### 🛠️ 2. Dynamic Scroll Indicator Progress Bar
*   **Objective:** Add a slim progress bar at the very top of the landing page that expands horizontally as the user scrolls down.
*   **Design Touch:** Utilize a neon accent gradient transition (`#7c6fff` to `#10b981`) for a futuristic visual touch.
*   **Target File:** `src/components/Navbar.tsx` or `src/App.tsx`

### 🛠️ 3. Sidebar Inbox Notification Badges
*   **Objective:** Introduce active unread notification badges (e.g. numerical indicator bubbles) next to the "Direct Chat" sidebar menu tab when new simulated messages are loaded.
*   **Design Touch:** Subtle scaling animation when a new notification is received.
*   **Target File:** `src/pages/Dashboard.tsx`

---

## 🟡 Phase 2: Intermediate Complexity

*Advanced state tracking, ledger adjustments, and responsive layout modals.*

### 🛠️ 4. Active Contact Search Filter
*   **Objective:** Implement a search bar inside the chat hub directory to let users filter their contact lists dynamically by name.
*   **Target File:** `src/pages/Dashboard.tsx`

### 🛠️ 5. Instructor Ratings & Reviews Deck
*   **Objective:** Create a popup modal triggered when clicking "Log Completed" inside the classes schedule list. Allow users to submit a 1-to-5 star rating and save the feedback to a reactive ratings list.
*   **Target File:** `src/pages/Dashboard.tsx`

### 🛠️ 6. Settings Avatar Customization Carousel
*   **Objective:** Replace standard static avatars inside the settings panel with a visual profile-selection carousel loaded from dynamic vector avatar API services.
*   **Target File:** `src/pages/Dashboard.tsx` (Settings Tab)

### 🛠️ 7. Visual Conversion Range Sliders
*   **Objective:** Refactor the token package input form from a standard drop-down list into an interactive visual range slider, letting users drag a custom slider handle from 50 to 1000 tokens while instantly displaying a simulated conversion cost.
*   **Target File:** `src/pages/Dashboard.tsx` (Tokens Tab)

---

## 🔴 Phase 3: Advanced Complexity

*Complex architectural adjustments, client-side database expansion, and third-party API integrations.*

### 🛠️ 8. Direct Messaging Chirps & Soundscapes
*   **Objective:** Wire the HTML5 Audio API inside the chat context to trigger custom futuristic audio cues whenever a simulated peer replies inside the direct message panel.
*   **Target File:** `src/pages/Dashboard.tsx` or `src/context/AuthContext.tsx`

### 🛠️ 9. Web Workers LocalStorage Synchronization
*   **Objective:** Configure background Web Workers or Broadcast Channel APIs to detect changes in local storage, keeping multi-tab sessions and chats perfectly aligned across active browser windows.
*   **Target File:** `src/context/AuthContext.tsx`

### 🛠️ 10. External Mock REST API Migrations
*   **Objective:** Swap local reactive contexts for async service requests (e.g., configuring `axios` or standard `fetch` patterns) that read/write details to a mock server database.
*   **Target File:** `src/context/AuthContext.tsx`

### 🛠️ 11. Immersive Video Classrooms (WebRTC)
*   **Objective:** Integrate Jitsi Meet's open-source Web API wrapper to embed fully functioning, temporary sandbox video rooms when classrooms are marked active.
*   **Target File:** `src/pages/Dashboard.tsx`
