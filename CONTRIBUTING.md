# 🤝 Contributing to SkillxPro

We are absolutely thrilled that you are looking to contribute to **SkillxPro**! SkillxPro is participating in **GSSoC (GirlScript Summer of Code) 2026** as a high-fidelity learning management ecosystem.

Whether you are fixing a responsive styling bug, building strongly typed TypeScript models, or developing advanced mock modules from our feature roadmap, your effort is highly appreciated!

---

## ⚡ Git Contribution Workflow

To keep contributions tidy and ensure smooth review pipelines, please follow this process:

### 1. Fork & Clone
Fork the main repository to your own GitHub account, then clone it locally:
```bash
git clone https://github.com/sahil4love/SkillxPro.git
cd SkillxPro
```

### 2. Configure Remote Upstream
Keep your local branch in perfect sync with the parent repository:
```bash
git remote add upstream https://github.com/sahil4love/SkillxPro.git
```

### 3. Create a Feature Branch
Create a descriptive local working branch before starting your changes:
*   For styling, feature additions, or layout fixes:
    ```bash
    git checkout -b feat/your-feature-name
    ```
*   For performance optimizations, core upgrades, or type-safety bug fixes:
    ```bash
    git checkout -b fix/your-bug-description
    ```

### 4. Running the Sandbox Locally
Navigate to the web client workspace, set up packages, and run the Vite server:
```bash
cd apps/web
npm install
npm run dev
```
*Access your hot-reloaded instance at `http://localhost:3000`*

### 5. Validate Before Submitting
To ensure your Pull Request is accepted instantly, confirm that it builds cleanly without strict TypeScript type errors:
```bash
npm run build
```

### 6. Commit Semantics
We enforce clean, descriptive commit histories. Write semantic commits describing your actions:
*   `feat(web): add ratings model and modal inputs`
*   `fix(web): solve balance arithmetic state sync bug`
*   `style(web): polish announcement badge layout`

---

## 📝 Design & Code Quality Standards

*   **Outfit Typography:** Preserve standard `font-family: 'Outfit'` styling across all custom text nodes.
*   **Google Developer Palette:** Use configured Tailwind tokens (`primary`, `accent`, `textPrimary`, `textSecondary`) to maintain a cohesive HSL system.
*   **No Placeholders:** Avoid static list stubs inside mock cards; bind data directly to our dynamic `AuthContext` database models.
*   **Strict Type Safety:** Always declare types inside `src/types.ts`. Avoid applying `any` assignments to code components.

Happy hacking! Let's build the future of peer-to-peer knowledge exchange together! 🎓
