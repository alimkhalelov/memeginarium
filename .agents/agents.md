# Harness Manifest: Memeginarium
> **Memory Root**: Maintained via `project_memory`. Lean index (<150 lines).

## Vision & Steering
- Mission: Fast, social Imaginarium card game powered by vertical meme cards for mobile and desktop.
- Modes: Pass-and-play (single device) and room-based multiplayer (PeerJS WebRTC).
- Current Milestone: Complete playable MVP built, tested, and published to GitHub.

## Core Specs
- 🎨 **Visual & Presentation System**: [DESIGN.md](file:///DESIGN.md) — Radical flat restraint, zero shadows, minimum font size 16px, borderless elements.
- 📋 **Living User Intent**: [.agents/intent.md](file:///.agents/intent.md) — Active intent nodes INTENT-001 through INTENT-008.
- 📚 **Facts & Traceability**: [.agents/facts/facts.jsonl](file:///.agents/facts/facts.jsonl) — Machine-readable verified state.

## Tech Stack & Invariants
- Frontend: Next.js 15 App Router with Tailwind CSS and TypeScript.
- State & Realtime: Pure functional game engine for pass-and-play; decentralized PeerJS WebRTC rooms for multiplayer.
- Button Standard: Strict text-only labels without emojis or icons.
- Settings Standard: Secondary controls stashed in vertical 3-dots menu (`⋮`).

## File Map (One-sentence summaries)
- [.gitignore](file:///.gitignore) — Git ignore rules for node_modules, build outputs, and local environments.
- [DESIGN.md](file:///DESIGN.md) — Living visual specification and UI justification audit table.
- [.agents/intent.md](file:///.agents/intent.md) — Cumulative canonical user intent registry.
- [.agents/agents.md](file:///.agents/agents.md) — Central project manifest and index.
- [.agents/facts/facts.jsonl](file:///.agents/facts/facts.jsonl) — Verified facts database.
- [package.json](file:///package.json) — Node.js manifest with direct script entries to support paths with ampersands.
- [tailwind.config.ts](file:///tailwind.config.ts) — Tailwind configuration enforcing 16px font floor, zero shadows, and fade animation.
- [src/types/game.ts](file:///src/types/game.ts) — TypeScript type definitions for meme cards, players, rounds, and game phases.
- [src/engine/game-engine.ts](file:///src/engine/game-engine.ts) — Pure functional Imaginarium state machine and scoring logic.
- [src/engine/__tests__/game-engine.test.ts](file:///src/engine/__tests__/game-engine.test.ts) — Vitest unit test suite covering scoring variations and round progression.
- [src/data/default-meme-pack.ts](file:///src/data/default-meme-pack.ts) — Default catalog of 26 curated CIS TikTok 2026 meme cards.
- [src/lib/storage.ts](file:///src/lib/storage.ts) — IndexedDB storage service for custom user meme packs.
- [src/lib/multiplayer-p2p.ts](file:///src/lib/multiplayer-p2p.ts) — Decentralized PeerJS signaling and message protocol for room multiplayer.
- [src/components/MemeCardComponent.tsx](file:///src/components/MemeCardComponent.tsx) — Vertical 9:16 card component with flat selection ring and votes badge.
- [src/components/MenuDropdown.tsx](file:///src/components/MenuDropdown.tsx) — 3-vertical-dots trigger housing rules, scoreboard, and pack options.
- [src/components/PrivacyVeil.tsx](file:///src/components/PrivacyVeil.tsx) — Fullscreen privacy veil for single-phone pass-and-play handoff.
- [src/components/PackModal.tsx](file:///src/components/PackModal.tsx) — Modal for selecting default or uploading custom user meme packs.
- [src/components/Lobby.tsx](file:///src/components/Lobby.tsx) — Start screen for mode selection, player names, and room creation/joining.
- [src/components/PassAndPlayGame.tsx](file:///src/components/PassAndPlayGame.tsx) — Complete pass-and-play game loop with progressive disclosure.
- [src/components/MultiplayerGame.tsx](file:///src/components/MultiplayerGame.tsx) — Real-time P2P multiplayer room game loop.
- [src/app/page.tsx](file:///src/app/page.tsx) — Root application router orchestrating Lobby, Solo, and Multiplayer views.
- [src/app/layout.tsx](file:///src/app/layout.tsx) — Root HTML layout with viewport settings and Russian localization metadata.
- [src/app/globals.css](file:///src/app/globals.css) — Global styles enforcing zero shadow, minimum 16px scale, and dark flat background.
- [scripts/generate-memes.mjs](file:///scripts/generate-memes.mjs) — Script generating 26 distinct 9:16 SVG meme cards into public/memes.

## Feedback Loops
- Typecheck: `npm run type-check`
- Test: `npm test`
- Build: `npm run build`
