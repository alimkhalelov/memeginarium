# Memeginarium: Product Specification & Design Document

> **Mission**: Fast, social Imaginarium (Dixit) card game powered by vertical meme cards for mobile and desktop.
> **Date**: 2026-10-31
> **Author**: Antigravity & User

---

## 1. Product Overview & Core Rules

Memeginarium transforms the surrealist board game Imaginarium / Dixit into a fast-paced social meme battle.
- **Card Format**: Vertical playing card / story aspect ratio (`9:16`).
- **Modes**:
  1. **Pass-and-play (Single Device)**: Players pass a single smartphone around. Before revealing each player's secret hand, a full-screen privacy veil requires a tap ("Pass phone to [PlayerName]").
  2. **Room Multiplayer**: Players join a lobby with a 4-letter room code via peer-to-peer WebRTC or real-time signaling.
- **Turn Loop**:
  1. *Storyteller Phase*: Active player secretly picks a meme from their hand (6 cards) and enters a clue (punchline / riddle).
  2. *Matching Phase*: Each other player secretly picks a card from their own hand that best matches the storyteller's clue.
  3. *Voting Phase*: All played cards are shuffled and revealed face-up in a vertical grid. Players (excluding storyteller) vote on which card belongs to the storyteller.
  4. *Scoring Phase*:
     - If all players or no players guess correctly: Storyteller gets 0 points; other players get +2 points.
     - Otherwise: Storyteller gets +3 points; correct guessers get +3 points; each player receives +1 point for each vote their submitted card received.
  5. *Next Round*: New cards dealt from the deck until winning score (e.g. 20 points) is reached.

---

## 2. Default 2026 CIS Meme Pack (30+ Cards)

The default pack includes:
- **Убери телефон**: Краснодарский водитель маршрутки («Убери телефон!»).
- **Воздухан**: Главный брейнрот осени 2026 — гигантские турбины, ураганы и пустословы.
- **67 (Сикс-севен)**: Доминирующий цифровой мем-хук в СНГ-Тиктоке 2026 года.
- **Антон Чагур (Чигур)**: Эдиты с каре, подбрасыванием монетки и холодным взглядом.
- **Телифон / Тилифон**: Искаженный звук звонка и мемные телефонные разговоры.
- **Советский брейнрот (Брдыщ)**: Рыба-собака Брдыщ, закон о запрете голода, Черемша, Сёмга и Петрович.
- **Итальянский брейнрот на рейвах**: Бомбардиро Крокодило, Шпиониро Голубиро, Балерина Капучина под Tung Tung Tung Sahur.
- **Мага, сияй**: Лезгинка под фонк с ослепительным лучом света.
- **Сидим с бобром за столом**: Хит Славы Скрипки («готовим полено»).
- **42 братухи / Э-э-эу!**: Жест с четырьмя пальцами.
- **Chill Guy**: Пёс в свитере — абсолютный пофигизм.
- **Квадроберы**: Выгул в масках на четвереньках.
- **Окак**: Кот в оцепенении и принятии.
- **Иван Золо (Баобаб)**: Реакции и треки.
- **Юсуф Дикеч**: Турецкий стрелок на чилле.
- **Дубайский шоколад**: Хрустящее катаифи и фисташка.
- **Скуф и Альтушка**: Госуслуги и танки.
- **Тапай хомяка (Hamster Kombat)**: Тапанье хомяка.
- **Плаки-плаки или нормалдаки**: Цитата Меллстроя и Зубарева.
- **Грустный хомяк (Sad Hamster)**: Под скрипичную мелодию.

*Custom Pack Upload*: Users can drag-and-drop or select image files (PNG, JPG, WEBP, GIF) to generate a custom deck instantly persisted in browser storage (IndexedDB).

---

## 3. Strict Aesthetic & UI Architecture

### 3.1. Absolute Rules
- **No Emojis or Icons in Buttons**: Pure action text (`Ready`, `Vote`, `Next`, `Pass Phone`, `Create Room`, `Join Room`).
- **Minimum Underlays**: Background is edge-to-edge monochrome (`#09090b` dark or `#fafafa` light); no cards-within-cards or floating layers.
- **Flat Design, Zero Shadows**: `box-shadow: none` across all elements.
- **No Borders**: If containers or plates are required, `border: none`.
- **Absolute Minimum Font Size**: `16px` (1rem). No caption or micro-text smaller than 16px.
  - Body / Buttons: `18px`–`20px`.
  - Clue / Callouts: `28px`–`32px`.
  - Screen Titles: `36px`–`44px`.
- **Progressive Disclosure**: Interactive elements appear dynamically (`opacity` + `translateY(4px)`) only when their phase is active.
- **Settings & Secondary Actions**: Stashed inside a borderless vertical 3-dots trigger button (`⋮`).

---

## 4. UI Justification Audit Table

| UI Element | Purpose | Can it be removed? | Form Factor |
|---|---|---|---|
| **Clue Input** | Enter riddle for storyteller card | No | Minimalist borderless text input, 28px font |
| **Action Button** | Confirm card selection or vote | No | Pure text button (`Vote`, `Submit`), 20px font |
| **Pass Screen** | Single-phone privacy veil | No in solo | Clean tap-to-continue full screen |
| **Room Code** | Multiplayer join identity | Yes during match | 4-letter code in header, click to copy |
| **Scoreboard** | Track player standings | Yes from active view | Moved into 3-dots menu (`⋮`) |
| **Rules / About** | Game help | Yes from active view | Moved into 3-dots menu (`⋮`) |
| **Custom Pack Uploader** | Create custom decks | Yes from active view | Available in setup screen / 3-dots menu |

---

## 5. Technical Stack

- **Framework**: Next.js 15 (React 19, TypeScript) with Tailwind CSS.
- **State Management**:
  - Pass-and-play: React Reducer state machine.
  - Multiplayer: Peer-to-peer WebRTC via PeerJS or lightweight signaling room server with fallback local synchronization.
- **Storage**: IndexedDB via `idb-keyval` or native IndexedDB for custom meme images.
- **Deployment**: GitHub public repository `alimzhankhalelov/memeginarium` + automated deployment.
