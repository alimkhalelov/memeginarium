"use client";

import React, { useState } from "react";
import { Lobby } from "../components/Lobby";
import { PassAndPlayGame } from "../components/PassAndPlayGame";
import { MultiplayerGame } from "../components/MultiplayerGame";
import { PackModal } from "../components/PackModal";
import { GameState, MemeCard } from "../types/game";
import { DEFAULT_MEME_PACK } from "../data/default-meme-pack";
import { initializeMatch } from "../engine/game-engine";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<"lobby" | "pass_and_play" | "multiplayer">("lobby");
  const [passAndPlayState, setPassAndPlayState] = useState<GameState | null>(null);

  // Multiplayer parameters
  const [multiParams, setMultiParams] = useState<{
    isHost: boolean;
    roomCode: string;
    playerName: string;
    deck: MemeCard[];
  } | null>(null);

  // Pack modal from in-game
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [currentDeck, setCurrentDeck] = useState<MemeCard[]>(DEFAULT_MEME_PACK);
  const [activePackName, setActivePackName] = useState("СНГ Мемы 2026");

  const handleStartPassAndPlay = (
    playerNames: string[],
    deck: MemeCard[],
    targetScore: number
  ) => {
    const state = initializeMatch(playerNames, deck, targetScore, "pass_and_play");
    setPassAndPlayState(state);
    setCurrentDeck(deck);
    setActiveScreen("pass_and_play");
  };

  const handleStartMultiplayerHost = (
    roomCode: string,
    playerName: string,
    deck: MemeCard[]
  ) => {
    setMultiParams({
      isHost: true,
      roomCode,
      playerName,
      deck,
    });
    setCurrentDeck(deck);
    setActiveScreen("multiplayer");
  };

  const handleJoinMultiplayer = (
    roomCode: string,
    playerName: string,
    deck: MemeCard[]
  ) => {
    setMultiParams({
      isHost: false,
      roomCode,
      playerName,
      deck,
    });
    setCurrentDeck(deck);
    setActiveScreen("multiplayer");
  };

  return (
    <>
      {activeScreen === "lobby" && (
        <Lobby
          onStartPassAndPlay={handleStartPassAndPlay}
          onStartMultiplayerHost={handleStartMultiplayerHost}
          onJoinMultiplayer={handleJoinMultiplayer}
        />
      )}

      {activeScreen === "pass_and_play" && passAndPlayState && (
        <PassAndPlayGame
          initialState={passAndPlayState}
          onExit={() => setActiveScreen("lobby")}
          onOpenPacks={() => setIsPackModalOpen(true)}
        />
      )}

      {activeScreen === "multiplayer" && multiParams && (
        <MultiplayerGame
          isHost={multiParams.isHost}
          roomCode={multiParams.roomCode}
          playerName={multiParams.playerName}
          deck={multiParams.deck}
          onExit={() => setActiveScreen("lobby")}
        />
      )}

      <PackModal
        isOpen={isPackModalOpen}
        onClose={() => setIsPackModalOpen(false)}
        activePackName={activePackName}
        onSelectPack={(cards, name) => {
          if (cards.length > 0) {
            setCurrentDeck(cards);
            setActivePackName(name);
          } else {
            setCurrentDeck(DEFAULT_MEME_PACK);
            setActivePackName("СНГ Мемы 2026");
          }
        }}
      />
    </>
  );
}
