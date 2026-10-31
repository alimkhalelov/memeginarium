import { GameState, MemeCard, Player, PlayedCard, RoundResult } from "../types/game";

export const HAND_SIZE = 6;
export const DEFAULT_TARGET_SCORE = 20;

/**
 * Shuffles an array immutably using Fisher-Yates.
 */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Initializes a new match with players and a shuffled deck.
 */
export function initializeMatch(
  playerNames: string[],
  deck: MemeCard[],
  targetScore: number = DEFAULT_TARGET_SCORE,
  mode: GameState["mode"] = "pass_and_play"
): GameState {
  if (playerNames.length < 3) {
    throw new Error("Imaginarium requires at least 3 players.");
  }
  if (deck.length < playerNames.length * HAND_SIZE) {
    throw new Error("Deck does not contain enough cards for all players.");
  }

  const shuffledDeck = shuffleArray(deck);
  let cardPointer = 0;

  const players: Player[] = playerNames.map((name, index) => {
    const hand = shuffledDeck.slice(cardPointer, cardPointer + HAND_SIZE);
    cardPointer += HAND_SIZE;
    return {
      id: `player_${index + 1}`,
      name,
      score: 0,
      hand,
      isHost: index === 0,
    };
  });

  const remainingDeck = shuffledDeck.slice(cardPointer);

  return {
    mode,
    phase: mode === "pass_and_play" ? "pass_veil" : "storyteller_turn",
    round: 1,
    targetScore,
    storytellerIndex: 0,
    clue: "",
    players,
    playedCards: [],
    deck: remainingDeck,
    veilTargetPlayerName: players[0].name,
  };
}

/**
 * Storyteller submits their secret card and riddle/clue.
 */
export function setStorytellerClue(
  state: GameState,
  cardId: string,
  clue: string
): GameState {
  const storyteller = state.players[state.storytellerIndex];
  if (!storyteller) throw new Error("Storyteller not found.");

  const card = storyteller.hand.find((c) => c.id === cardId);
  if (!card) throw new Error("Card not found in storyteller's hand.");

  const trimmedClue = clue.trim();
  if (!trimmedClue) throw new Error("Clue cannot be empty.");

  const updatedPlayers = state.players.map((p, idx) => {
    if (idx === state.storytellerIndex) {
      return {
        ...p,
        hand: p.hand.filter((c) => c.id !== cardId),
        pickedCard: card,
      };
    }
    return p;
  });

  const initialPlayedCard: PlayedCard = {
    card,
    playerId: storyteller.id,
    votes: [],
  };

  // Next player to pick card
  const nextPlayerIndex = (state.storytellerIndex + 1) % state.players.length;

  return {
    ...state,
    clue: trimmedClue,
    storytellerCard: card,
    players: updatedPlayers,
    playedCards: [initialPlayedCard],
    phase: state.mode === "pass_and_play" ? "pass_veil" : "matching_turn",
    veilTargetPlayerName: state.players[nextPlayerIndex].name,
  };
}

/**
 * A non-storyteller player submits their best-fitting meme card.
 */
export function submitPlayerCard(
  state: GameState,
  playerId: string,
  cardId: string
): GameState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found.");

  const card = player.hand.find((c) => c.id === cardId);
  if (!card) throw new Error("Card not found in player's hand.");

  const updatedPlayers = state.players.map((p) => {
    if (p.id === playerId) {
      return {
        ...p,
        hand: p.hand.filter((c) => c.id !== cardId),
        pickedCard: card,
      };
    }
    return p;
  });

  const newPlayedCard: PlayedCard = {
    card,
    playerId,
    votes: [],
  };

  const updatedPlayedCards = [...state.playedCards, newPlayedCard];
  const allPicked = updatedPlayers.every((p) => p.pickedCard !== undefined);

  if (allPicked) {
    // Shuffle played cards for voting table
    const shuffledCards = shuffleArray(updatedPlayedCards);
    const firstVoter = updatedPlayers.find((_, idx) => idx !== state.storytellerIndex);
    return {
      ...state,
      players: updatedPlayers,
      playedCards: shuffledCards,
      phase: state.mode === "pass_and_play" ? "pass_veil" : "voting",
      veilTargetPlayerName: firstVoter ? firstVoter.name : state.players[0].name,
    };
  }

  // Find next player who hasn't picked yet
  const nextPlayer = updatedPlayers.find(
    (p, i) => i !== state.storytellerIndex && !p.pickedCard
  );

  return {
    ...state,
    players: updatedPlayers,
    playedCards: updatedPlayedCards,
    phase: state.mode === "pass_and_play" ? "pass_veil" : "matching_turn",
    veilTargetPlayerName: nextPlayer ? nextPlayer.name : undefined,
  };
}

/**
 * A non-storyteller player casts their vote on a card.
 */
export function castVote(
  state: GameState,
  voterPlayerId: string,
  cardId: string
): GameState {
  const storyteller = state.players[state.storytellerIndex];
  if (voterPlayerId === storyteller.id) {
    throw new Error("Storyteller cannot vote.");
  }

  const voter = state.players.find((p) => p.id === voterPlayerId);
  if (!voter) throw new Error("Voter not found.");

  const targetPlayedCard = state.playedCards.find((pc) => pc.card.id === cardId);
  if (!targetPlayedCard) throw new Error("Selected card is not on the table.");

  if (targetPlayedCard.playerId === voterPlayerId) {
    throw new Error("You cannot vote for your own card.");
  }

  const updatedPlayedCards = state.playedCards.map((pc) => {
    // Remove previous vote by this voter if any
    const cleanVotes = pc.votes.filter((id) => id !== voterPlayerId);
    if (pc.card.id === cardId) {
      return { ...pc, votes: [...cleanVotes, voterPlayerId] };
    }
    return { ...pc, votes: cleanVotes };
  });

  const updatedPlayers = state.players.map((p) => {
    if (p.id === voterPlayerId) {
      return { ...p, votedCardId: cardId };
    }
    return p;
  });

  // Check if all non-storyteller players have voted
  const requiredVoters = updatedPlayers.filter((_, idx) => idx !== state.storytellerIndex);
  const allVoted = requiredVoters.every((p) => p.votedCardId !== undefined);

  if (allVoted) {
    return resolveRoundScores({
      ...state,
      players: updatedPlayers,
      playedCards: updatedPlayedCards,
    });
  }

  // In pass-and-play, find next voter
  const nextVoter = requiredVoters.find((p) => !p.votedCardId);

  return {
    ...state,
    players: updatedPlayers,
    playedCards: updatedPlayedCards,
    phase: state.mode === "pass_and_play" ? "pass_veil" : "voting",
    veilTargetPlayerName: nextVoter ? nextVoter.name : undefined,
  };
}

/**
 * Resolves scoring for the current round based on classic Imaginarium rules.
 */
export function resolveRoundScores(state: GameState): GameState {
  const storyteller = state.players[state.storytellerIndex];
  const storytellerCard = state.playedCards.find((pc) => pc.playerId === storyteller.id);
  if (!storytellerCard) throw new Error("Storyteller card not found.");

  const storytellerVotes = storytellerCard.votes.length;
  const totalGuessers = state.players.length - 1;

  const allGuessed = storytellerVotes === totalGuessers;
  const noneGuessed = storytellerVotes === 0;

  const pointMap = new Map<string, { points: number; reasons: string[] }>();
  state.players.forEach((p) => pointMap.set(p.id, { points: 0, reasons: [] }));

  if (allGuessed) {
    // Everyone guessed: Storyteller gets 0, all other players get 2
    state.players.forEach((p) => {
      if (p.id !== storyteller.id) {
        const entry = pointMap.get(p.id)!;
        entry.points += 2;
        entry.reasons.push("All guessed storyteller's card (+2)");
      } else {
        pointMap.get(p.id)!.reasons.push("Everyone guessed your card (0)");
      }
    });
  } else if (noneGuessed) {
    // Nobody guessed: Storyteller gets 0, all other players get 2
    state.players.forEach((p) => {
      if (p.id !== storyteller.id) {
        const entry = pointMap.get(p.id)!;
        entry.points += 2;
        entry.reasons.push("Nobody guessed storyteller's card (+2)");
      } else {
        pointMap.get(p.id)!.reasons.push("Nobody guessed your card (0)");
      }
    });
  } else {
    // Partially guessed: Storyteller gets 3, correct guessers get 3
    const stEntry = pointMap.get(storyteller.id)!;
    stEntry.points += 3;
    stEntry.reasons.push("Clever riddle (+3)");

    storytellerCard.votes.forEach((voterId) => {
      const vEntry = pointMap.get(voterId)!;
      vEntry.points += 3;
      vEntry.reasons.push("Guessed storyteller's card (+3)");
    });
  }

  // Bonus points: +1 for each vote a player's card attracted (except storyteller)
  state.playedCards.forEach((pc) => {
    if (pc.playerId !== storyteller.id && pc.votes.length > 0) {
      const entry = pointMap.get(pc.playerId)!;
      entry.points += pc.votes.length;
      entry.reasons.push(`Fooled other players (+${pc.votes.length})`);
    }
  });

  const updatedPlayers = state.players.map((p) => {
    const scored = pointMap.get(p.id)!;
    return {
      ...p,
      score: p.score + scored.points,
    };
  });

  const roundResult: RoundResult = {
    round: state.round,
    clue: state.clue,
    storytellerId: storyteller.id,
    storytellerName: storyteller.name,
    playedCards: state.playedCards,
    pointsAwarded: updatedPlayers.map((p) => {
      const scored = pointMap.get(p.id)!;
      return {
        playerId: p.id,
        playerName: p.name,
        points: scored.points,
        reason: scored.reasons.join(", "),
      };
    }),
    allGuessed,
    noneGuessed,
  };

  const isGameOver = updatedPlayers.some((p) => p.score >= state.targetScore);

  return {
    ...state,
    players: updatedPlayers,
    lastRoundResult: roundResult,
    phase: isGameOver ? "game_over" : "scoring",
  };
}

/**
 * Advances to the next round, drawing 1 card for each player and advancing the storyteller.
 */
export function advanceToNextRound(state: GameState): GameState {
  let deck = [...state.deck];

  // Each player draws 1 card back up to HAND_SIZE
  const updatedPlayers = state.players.map((p) => {
    let hand = [...p.hand];
    if (deck.length > 0 && hand.length < HAND_SIZE) {
      const [drawn, ...rest] = deck;
      hand.push(drawn);
      deck = rest;
    }
    return {
      ...p,
      hand,
      pickedCard: undefined,
      votedCardId: undefined,
    };
  });

  const nextStorytellerIndex = (state.storytellerIndex + 1) % state.players.length;

  return {
    ...state,
    round: state.round + 1,
    storytellerIndex: nextStorytellerIndex,
    clue: "",
    storytellerCard: undefined,
    playedCards: [],
    deck,
    players: updatedPlayers,
    phase: state.mode === "pass_and_play" ? "pass_veil" : "storyteller_turn",
    veilTargetPlayerName: updatedPlayers[nextStorytellerIndex].name,
  };
}
