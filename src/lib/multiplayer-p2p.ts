"use client";

import type { DataConnection, Peer } from "peerjs";
import { GameState } from "../types/game";

export type PeerMessage =
  | { type: "JOIN_REQUEST"; playerName: string; playerId: string }
  | { type: "STATE_UPDATE"; state: GameState }
  | { type: "STORYTELLER_CLUE"; cardId: string; clue: string }
  | { type: "PICK_CARD"; playerId: string; cardId: string }
  | { type: "CAST_VOTE"; playerId: string; cardId: string }
  | { type: "NEXT_ROUND" };

export interface P2PConnectionManager {
  peer: Peer;
  connections: Map<string, DataConnection>;
  broadcast: (msg: PeerMessage) => void;
  sendToHost: (msg: PeerMessage) => void;
  disconnect: () => void;
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function formatPeerId(roomCode: string): string {
  return `memeginarium-room-${roomCode.toUpperCase()}`;
}
