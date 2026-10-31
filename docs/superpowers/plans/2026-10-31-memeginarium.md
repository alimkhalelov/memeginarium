# Memeginarium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, ultra-flat, high-performance Imaginarium card game for memes with vertical cards, 2026 CIS meme pack, custom upload, pass-and-play and multiplayer rooms, adhering strictly to radical flat design with zero shadows, no emojis in buttons, minimum font size 16px, and progressive disclosure.

**Architecture:** Client-side Next.js 15 app with a unified game engine state machine supporting both single-phone pass-and-play and room-based multiplayer via WebRTC/PeerJS signaling. Meme packs are bundled statically with local IndexedDB storage for custom user decks.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, PeerJS / WebRTC, Vitest / React Testing Library, Lucide (stripped to raw ⋮ SVG only).

## Global Constraints
- Absolute minimum font size: `16px` everywhere in the app.
- Flat design, zero shadows (`box-shadow: none`), zero borders (`border: none`).
- No emojis or icons in button labels; buttons use pure action text only.
- Progressive disclosure: interactive controls reveal dynamically as phases change.
- Settings and secondary actions housed in vertical 3-dots menu (`⋮`).
- Maximum file size: under 400 lines per file.

---

### Task 1: Project Scaffolding & Design System Foundations

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Initialize Next.js project with Tailwind CSS and TypeScript**
Scaffold configuration files with strict typography scale (`text-base` = 16px min, `text-lg` = 18px, `text-xl` = 20px, `text-2xl` = 24px, `text-3xl` = 30px, `text-4xl` = 36px) and zero shadow utilities.

- [ ] **Step 2: Install dependencies**
Run: `npm install next@latest react@latest react-dom@latest tailwindcss@latest @tailwindcss/postcss postcss typescript @types/react @types/node peerjs canvas-confetti @types/canvas-confetti`

- [ ] **Step 3: Verify build and baseline compilation**
Run: `npm run build` or `npx next build`
Expected: Successful compile of baseline layout.

- [ ] **Step 4: Commit baseline setup**
`git add . && git commit -m "chore: scaffold next.js project with flat design tokens"`

---

### Task 2: Core Game Engine State Machine & Scoring Logic

**Files:**
- Create: `src/types/game.ts`
- Create: `src/engine/game-engine.ts`
- Test: `src/engine/__tests__/game-engine.test.ts`

**Interfaces:**
- Consumes: Game configuration (players list, target score, deck of cards).
- Produces: `GameEngine` class or pure reducer functions: `startMatch`, `submitClue`, `pickCard`, `castVote`, `resolveRound`.

- [ ] **Step 1: Write failing tests for Imaginarium scoring and turn phases**
Tests verifying:
1. Storyteller gets 0 and others get 2 points if everyone or no one guesses correctly.
2. Storyteller gets 3 points and correct guessers get 3 points if 1..N-1 guess correctly.
3. Card owners receive +1 point per vote on their card.

- [ ] **Step 2: Run tests to verify failure**
Run: `npx vitest run src/engine/__tests__/game-engine.test.ts`

- [ ] **Step 3: Implement game engine reducer & state transition logic**
Implement pure functions in `src/engine/game-engine.ts`.

- [ ] **Step 4: Run tests to verify pass**
Run: `npx vitest run src/engine/__tests__/game-engine.test.ts`
Expected: 100% tests passing.

- [ ] **Step 5: Commit engine**
`git commit -m "feat(engine): implement core imaginarium state machine and scoring"`

---

### Task 3: 2026 CIS Meme Pack Dataset & Custom Pack Storage

**Files:**
- Create: `src/data/default-meme-pack.ts`
- Create: `src/lib/storage.ts`
- Create: `public/memes/*.svg` or high-resolution vertical card generators

**Interfaces:**
- Produces: `MemeCard` array with IDs, titles, descriptions, and high-impact vertical visuals for all 20+ viral 2026 memes.
- Produces: `saveCustomPack`, `loadPacks`, `deleteCustomPack` using IndexedDB.

- [ ] **Step 1: Build the default CIS 2026 meme dataset**
Populate 25+ iconic memes: «Убери телефон», «Воздухан», «67», «Антон Чагур», «Телифон», «Брдыщ», «Мага сияй», «Chill Guy», «Квадроберы», «Сидим с бобром», «Дубайский шоколад», etc., formatted as vertical SVG/card assets.

- [ ] **Step 2: Implement IndexedDB storage for custom user meme packs**
Allow players to import images as custom decks.

- [ ] **Step 3: Commit dataset**
`git commit -m "feat(data): add default 2026 CIS meme pack and custom pack storage"`

---

### Task 4: Vertical Card & Progressive Disclosure UI Components

**Files:**
- Create: `src/components/MemeCard.tsx`
- Create: `src/components/HandGrid.tsx`
- Create: `src/components/MenuDropdown.tsx` (the 3 vertical dots `⋮`)
- Create: `src/components/PrivacyVeil.tsx`

**Constraints Check:**
- All buttons: pure text, zero icons/emojis, font-size >= 16px.
- Zero borders, zero box-shadows.
- Smooth CSS transition for progressive disclosure (`opacity-0 translate-y-2` -> `opacity-100 translate-y-0`).

- [ ] **Step 1: Implement `MemeCard.tsx`** with vertical `9:16` ratio, edge-to-edge media, and clear borderless selection indicator.
- [ ] **Step 2: Implement `PrivacyVeil.tsx`** for pass-and-play phone handoff.
- [ ] **Step 3: Implement `MenuDropdown.tsx`** (3 dots `⋮`) housing Rules, Scoreboard, and Settings.
- [ ] **Step 4: Commit UI components**
`git commit -m "feat(ui): add flat vertical card and progressive disclosure components"`

---

### Task 5: Pass-and-Play & Multiplayer Room Modes

**Files:**
- Create: `src/components/PassAndPlayGame.tsx`
- Create: `src/components/MultiplayerGame.tsx`
- Create: `src/lib/multiplayer-p2p.ts`
- Create: `src/components/Lobby.tsx`

- [ ] **Step 1: Implement `PassAndPlayGame.tsx`**
Sequential phone handoff with privacy veil, clue input, card picking, secret voting, and round scoreboard.

- [ ] **Step 2: Implement `MultiplayerGame.tsx` and P2P room sync**
Room code generation, peer connection, broadcast game state, real-time sync.

- [ ] **Step 3: Commit game modes**
`git commit -m "feat(game): add pass-and-play and room multiplayer modes"`

---

### Task 6: GitHub Repo Creation, Verification & Delivery

- [ ] **Step 1: Run typecheck and full production build**
`npm run build`

- [ ] **Step 2: Create public GitHub repository via `gh repo create`**
`gh repo create memeginarium --public --source=. --remote=origin --push`

- [ ] **Step 3: Verify deployment and deliverables**
Verify DOM, test passes, and live code.
