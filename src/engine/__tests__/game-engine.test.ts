import { describe, it, expect } from "vitest";
import {
  initializeMatch,
  setStorytellerClue,
  submitPlayerCard,
  castVote,
  advanceToNextRound,
  HAND_SIZE,
} from "../game-engine";
import { MemeCard } from "../../types/game";

const mockDeck: MemeCard[] = Array.from({ length: 30 }, (_, i) => ({
  id: `card_${i + 1}`,
  title: `Meme ${i + 1}`,
  description: `Meme description ${i + 1}`,
  imageUrl: `/memes/meme_${i + 1}.svg`,
}));

describe("Imaginarium Game Engine", () => {
  it("initializes a 3-player match with correct hand sizes and remaining deck", () => {
    const players = ["Alice", "Bob", "Charlie"];
    const state = initializeMatch(players, mockDeck, 20, "pass_and_play");

    expect(state.players).toHaveLength(3);
    expect(state.players[0].hand).toHaveLength(HAND_SIZE);
    expect(state.players[1].hand).toHaveLength(HAND_SIZE);
    expect(state.players[2].hand).toHaveLength(HAND_SIZE);
    expect(state.deck.length).toBe(30 - 3 * HAND_SIZE);
    expect(state.phase).toBe("pass_veil");
    expect(state.storytellerIndex).toBe(0);
  });

  it("handles storyteller clue and card submission", () => {
    const state = initializeMatch(["Alice", "Bob", "Charlie"], mockDeck, 20, "pass_and_play");
    const stCardId = state.players[0].hand[0].id;
    const clue = "Чистый воздухан";

    const updated = setStorytellerClue(state, stCardId, clue);

    expect(updated.clue).toBe("Чистый воздухан");
    expect(updated.storytellerCard?.id).toBe(stCardId);
    expect(updated.players[0].hand).toHaveLength(HAND_SIZE - 1);
    expect(updated.playedCards).toHaveLength(1);
    expect(updated.playedCards[0].playerId).toBe(state.players[0].id);
  });

  it("scores 0 for storyteller and +2 for others when all guess correctly", () => {
    let state = initializeMatch(["Alice", "Bob", "Charlie"], mockDeck, 20, "multiplayer");
    const stCardId = state.players[0].hand[0].id;
    state = setStorytellerClue(state, stCardId, "База");

    const p2CardId = state.players[1].hand[0].id;
    state = submitPlayerCard(state, state.players[1].id, p2CardId);

    const p3CardId = state.players[2].hand[0].id;
    state = submitPlayerCard(state, state.players[2].id, p3CardId);

    // Both Bob and Charlie vote for Alice's card (All guessed)
    state = castVote(state, state.players[1].id, stCardId);
    state = castVote(state, state.players[2].id, stCardId);

    expect(state.phase).toBe("scoring");
    expect(state.lastRoundResult?.allGuessed).toBe(true);

    const alice = state.players[0];
    const bob = state.players[1];
    const charlie = state.players[2];

    expect(alice.score).toBe(0); // Storyteller gets 0 when all guess
    expect(bob.score).toBe(2); // Others get 2
    expect(charlie.score).toBe(2);
  });

  it("scores 0 for storyteller and +2 for others when nobody guesses correctly", () => {
    let state = initializeMatch(["Alice", "Bob", "Charlie"], mockDeck, 20, "multiplayer");
    const stCardId = state.players[0].hand[0].id;
    state = setStorytellerClue(state, stCardId, "Криптонит");

    const p2CardId = state.players[1].hand[0].id;
    state = submitPlayerCard(state, state.players[1].id, p2CardId);

    const p3CardId = state.players[2].hand[0].id;
    state = submitPlayerCard(state, state.players[2].id, p3CardId);

    // Bob votes for Charlie's card, Charlie votes for Bob's card
    state = castVote(state, state.players[1].id, p3CardId);
    state = castVote(state, state.players[2].id, p2CardId);

    expect(state.lastRoundResult?.noneGuessed).toBe(true);
    expect(state.players[0].score).toBe(0); // Alice got 0
    expect(state.players[1].score).toBe(2 + 1); // Bob got 2 + 1 vote on his card
    expect(state.players[2].score).toBe(2 + 1); // Charlie got 2 + 1 vote on his card
  });

  it("scores +3 for storyteller and correct guesser, and bonus for fooled votes", () => {
    let state = initializeMatch(["Alice", "Bob", "Charlie", "David"], mockDeck, 20, "multiplayer");
    const stCardId = state.players[0].hand[0].id;
    state = setStorytellerClue(state, stCardId, "Убери телефон");

    const p2CardId = state.players[1].hand[0].id;
    state = submitPlayerCard(state, state.players[1].id, p2CardId);

    const p3CardId = state.players[2].hand[0].id;
    state = submitPlayerCard(state, state.players[2].id, p3CardId);

    const p4CardId = state.players[3].hand[0].id;
    state = submitPlayerCard(state, state.players[3].id, p4CardId);

    // Bob votes for Alice (correct!), Charlie votes for Bob, David votes for Bob
    state = castVote(state, state.players[1].id, stCardId);
    state = castVote(state, state.players[2].id, p2CardId);
    state = castVote(state, state.players[3].id, p2CardId);

    expect(state.phase).toBe("scoring");
    expect(state.lastRoundResult?.allGuessed).toBe(false);
    expect(state.lastRoundResult?.noneGuessed).toBe(false);

    // Alice (storyteller) got 3 points
    expect(state.players[0].score).toBe(3);
    // Bob guessed correctly (+3) AND got 2 votes on his card (+2) -> 5 points
    expect(state.players[1].score).toBe(3 + 2);
    // Charlie guessed Bob's card (0 points)
    expect(state.players[2].score).toBe(0);
    // David guessed Bob's card (0 points)
    expect(state.players[3].score).toBe(0);
  });

  it("advances round, rotates storyteller, and deals replenishment cards", () => {
    let state = initializeMatch(["Alice", "Bob", "Charlie"], mockDeck, 20, "multiplayer");
    state = setStorytellerClue(state, state.players[0].hand[0].id, "Тест");
    state = submitPlayerCard(state, state.players[1].id, state.players[1].hand[0].id);
    state = submitPlayerCard(state, state.players[2].id, state.players[2].hand[0].id);
    state = castVote(state, state.players[1].id, state.players[0].pickedCard!.id);
    state = castVote(state, state.players[2].id, state.players[1].pickedCard!.id);

    const nextRound = advanceToNextRound(state);

    expect(nextRound.round).toBe(2);
    expect(nextRound.storytellerIndex).toBe(1); // Bob is storyteller now
    expect(nextRound.players[0].hand).toHaveLength(HAND_SIZE);
    expect(nextRound.players[1].hand).toHaveLength(HAND_SIZE);
    expect(nextRound.players[2].hand).toHaveLength(HAND_SIZE);
    expect(nextRound.playedCards).toHaveLength(0);
  });

  it("handles complete pass-and-play handoff loop targeting correct players", () => {
    let state = initializeMatch(["Alice", "Bob", "Charlie"], mockDeck, 20, "pass_and_play");
    expect(state.phase).toBe("pass_veil");
    expect(state.veilTargetPlayerName).toBe("Alice");

    // Alice (storyteller) sets clue
    state = setStorytellerClue(state, state.players[0].hand[0].id, "Воздухан");
    expect(state.phase).toBe("pass_veil");
    expect(state.veilTargetPlayerName).toBe("Bob");

    // Bob picks card
    state = submitPlayerCard(state, state.players[1].id, state.players[1].hand[0].id);
    expect(state.phase).toBe("pass_veil");
    expect(state.veilTargetPlayerName).toBe("Charlie");

    // Charlie picks card -> transitions to voting for Bob (first voter)
    state = submitPlayerCard(state, state.players[2].id, state.players[2].hand[0].id);
    expect(state.phase).toBe("pass_veil");
    expect(state.veilTargetPlayerName).toBe("Bob"); // Non-storyteller voter!
  });
});
