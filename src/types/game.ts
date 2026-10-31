export interface MemeCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
  hand: MemeCard[];
  pickedCard?: MemeCard;
  votedCardId?: string;
  isHost?: boolean;
}

export type GamePhase =
  | "lobby"
  | "storyteller_turn"
  | "matching_turn"
  | "pass_veil"
  | "voting"
  | "scoring"
  | "game_over";

export type GameMode = "pass_and_play" | "multiplayer";

export interface PlayedCard {
  card: MemeCard;
  playerId: string;
  votes: string[]; // playerIds of players who voted for this card
}

export interface RoundResult {
  round: number;
  clue: string;
  storytellerId: string;
  storytellerName: string;
  playedCards: PlayedCard[];
  pointsAwarded: {
    playerId: string;
    playerName: string;
    points: number;
    reason: string;
  }[];
  allGuessed: boolean;
  noneGuessed: boolean;
}

export interface GameState {
  mode: GameMode;
  phase: GamePhase;
  round: number;
  targetScore: number;
  storytellerIndex: number;
  clue: string;
  storytellerCard?: MemeCard;
  players: Player[];
  playedCards: PlayedCard[];
  deck: MemeCard[];
  lastRoundResult?: RoundResult;
  veilTargetPlayerName?: string;
  roomCode?: string;
}
