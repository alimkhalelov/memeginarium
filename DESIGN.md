# DESIGN.md: Memeginarium Design System & Aesthetic Contract

> Architectural and visual guidelines for Memeginarium — Imaginarium / Dixit reimagined with vertical meme cards.

---

## 1. Core Visual Philosophy: Ultra-Flat Radical Restraint

- **Flat & Clean**: Zero `box-shadow`, zero radial glows, zero faux-3D elevation.
- **Zero Borders / Outlines**: When containers or cards are displayed, borders are strictly `border: none` (or borderless with subtle tone separation).
- **Minimum Underlays**: Eliminate layered boxes-in-boxes. Background is unified; cards and text float natively without nesting inside card-within-card containers.
- **Progressive Disclosure**: Interactive elements appear dynamically via smooth micro-transitions (`opacity` and `transform: translateY(4px)`) only when their phase is active.

---

## 2. Typography & Scale Invariants

- **Minimum Font Size Standard**: 
  - **Absolute Minimum Font Size**: `16px` (1rem). No caption or micro-text may ever render smaller than 16px.
  - **Body / Primary Labels**: `18px`–`20px`.
  - **Headings / Storyteller Clue**: `28px`–`36px` bold.
  - **Hero / Game Phase Title**: `40px`–`48px` bold.
- **Font Stack**: Clean, highly readable system sans-serif (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`).
- **Character**: Clear, authoritative, immediate legibility across mobile screens and desktop monitors.

---

## 3. Button & Interactive Element Contract

- **Strict Button Invariant**: 
  - **NO Emojis** and **NO Icons** inside buttons. Pure text labels only (e.g. `Ready`, `Vote`, `Pass Phone`, `Create Room`, `Join Room`).
  - Text is concise and action-first (verbs or immediate status).
- **Secondary Controls & Settings**:
  - Global settings and secondary actions are hidden behind a single borderless 3-vertical-dots trigger button (`⋮`).
  - Dropdown options appear cleanly without heavy shadows.

---

## 4. Meme Card Specs

- **Aspect Ratio**: Standard vertical story / playing card ratio (`9:16` or `2:3` depending on viewport).
- **Presentation**: Edge-to-edge media fit with subtle rounded corners (`border-radius: 12px` or `16px`), zero outer borders, zero dropshadows.
- **Selection State**: Clear high-contrast outline or solid tint overlay, without heavy blur effects.

---

## 5. UI Justification Audit Table

| UI Element | Necessity & Purpose | Can it be eliminated? | Minimal Form |
|---|---|---|---|
| **Storyteller Clue Input** | Critical to gameplay (submitting riddle) | No (core game mechanic) | Single clean input with large font (24px) |
| **Action Button** | Critical to confirm turn / vote | No | Pure text button ("Vote", "Submit") |
| **Pass-and-Play Veil** | Critical to prevent screen peeking between turns | No (anti-cheat on 1 device) | Tap anywhere screen: "Pass phone to [Player]" |
| **Game Code / Share** | Critical for multiplayer join | Yes (stashed in room lobby) | Short 4-letter code, click to copy |
| **Scoreboard / Rules** | Secondary during active turn | Yes (eliminate from main view) | Hidden inside 3-dots menu (`⋮`) |
| **Deck / Pack Uploader** | Setup phase only | Yes (not visible in game loop) | Pack selector in lobby screen |
