# Harness Manifest: Memeginarium
> **Memory Root**: Maintained via `project_memory`. Lean index (<150 lines).

## Vision & Steering
- Mission: Fast, social Imaginarium card game powered by vertical meme cards for mobile and desktop.
- Modes: Pass-and-play (single device) and room-based multiplayer (code/link).
- Current Milestone: Specification, meme pack curation, and design approval.

## Core Specs
- 🎨 **Visual & Presentation System**: [DESIGN.md](file:///DESIGN.md) — Radical flat restraint, zero shadows, minimum font size 16px, borderless elements.
- 📋 **Living User Intent**: [.agents/intent.md](file:///.agents/intent.md) — Active intent nodes INTENT-001 through INTENT-007.
- 📚 **Facts & Traceability**: [.agents/facts/facts.jsonl](file:///.agents/facts/facts.jsonl) — Machine-readable verified state.

## Tech Stack & Invariants
- Frontend: Next.js / React with Tailwind CSS (or Vite + React) for high-performance responsive web app.
- State & Realtime: Local state for pass-and-play; lightweight signaling / PartyKit / WebSocket or peer room sync for multiplayer.
- Button Standard: Strict text-only labels without emojis or icons.
- Settings Standard: Secondary controls stashed in vertical 3-dots menu (`⋮`).

## File Map (One-sentence summaries)
- [.gitignore](file:///.gitignore) — Git ignore rules for node_modules, build outputs, and local environments.
- [DESIGN.md](file:///DESIGN.md) — Living visual specification and UI justification audit table.
- [.agents/intent.md](file:///.agents/intent.md) — Cumulative canonical user intent registry.
- [.agents/agents.md](file:///.agents/agents.md) — Central project manifest and index.
- [.agents/facts/facts.jsonl](file:///.agents/facts/facts.jsonl) — Verified facts database.

## Feedback Loops
- Typecheck: `npm run type-check` (or `tsc --noEmit`)
- Lint: `npm run lint`
- Test: `npm test`
- Build: `npm run build`
