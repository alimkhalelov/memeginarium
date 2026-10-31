"use client";

import React, { useState } from "react";
import { GameState } from "../types/game";
import {
  setStorytellerClue,
  submitPlayerCard,
  castVote,
  advanceToNextRound,
} from "../engine/game-engine";
import { MemeCardComponent } from "./MemeCardComponent";
import { PrivacyVeil } from "./PrivacyVeil";
import { MenuDropdown } from "./MenuDropdown";
import confetti from "canvas-confetti";

interface PassAndPlayGameProps {
  initialState: GameState;
  onExit: () => void;
  onOpenPacks: () => void;
}

export const PassAndPlayGame: React.FC<PassAndPlayGameProps> = ({
  initialState,
  onExit,
  onOpenPacks,
}) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isVeiled, setIsVeiled] = useState<boolean>(true);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [clueInput, setClueInput] = useState<string>("");

  const storyteller = gameState.players[gameState.storytellerIndex];

  // Helper to determine the underlying phase when in pass-and-play handoff
  const getEffectivePhase = () => {
    if (gameState.phase !== "pass_veil") return gameState.phase;
    if (!gameState.clue) return "storyteller_turn";
    if (gameState.playedCards.length < gameState.players.length) return "matching_turn";
    if (gameState.lastRoundResult === undefined) return "voting";
    return "scoring";
  };

  const effectivePhase = getEffectivePhase();

  // Helper to determine who is currently holding the phone
  const getCurrentActivePlayer = () => {
    if (effectivePhase === "storyteller_turn") {
      return storyteller;
    }
    if (effectivePhase === "matching_turn") {
      return (
        gameState.players.find(
          (p, i) => i !== gameState.storytellerIndex && !p.pickedCard
        ) || gameState.players[0]
      );
    }
    if (effectivePhase === "voting") {
      return (
        gameState.players.find(
          (p, i) => i !== gameState.storytellerIndex && !p.votedCardId
        ) || gameState.players[0]
      );
    }
    return storyteller;
  };

  const activePlayer = getCurrentActivePlayer();

  const handleRevealVeil = () => {
    setIsVeiled(false);
    setSelectedCardId(null);
  };

  const handleStorytellerSubmit = () => {
    if (!selectedCardId || !clueInput.trim()) return;
    const nextState = setStorytellerClue(gameState, selectedCardId, clueInput);
    setGameState(nextState);
    setSelectedCardId(null);
    setClueInput("");
    setIsVeiled(true);
  };

  const handlePlayerPickCard = () => {
    if (!selectedCardId) return;
    const nextState = submitPlayerCard(gameState, activePlayer.id, selectedCardId);
    setGameState(nextState);
    setSelectedCardId(null);
    setIsVeiled(true);
  };

  const handleVoteSubmit = () => {
    if (!selectedCardId) return;
    const nextState = castVote(gameState, activePlayer.id, selectedCardId);
    setGameState(nextState);
    setSelectedCardId(null);
    if (nextState.phase === "scoring") {
      setIsVeiled(false);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}
    } else {
      setIsVeiled(true);
    }
  };

  const handleNextRound = () => {
    const nextState = advanceToNextRound(gameState);
    setGameState(nextState);
    setSelectedCardId(null);
    setClueInput("");
    setIsVeiled(true);
  };

  // If veil is active (Privacy screen between players)
  if (isVeiled && effectivePhase !== "scoring" && effectivePhase !== "game_over") {
    return (
      <PrivacyVeil
        targetPlayerName={gameState.veilTargetPlayerName || activePlayer.name}
        onReveal={handleRevealVeil}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Bar: Minimalist with 3-dots trigger */}
      <header className="flex items-center justify-between pb-4">
        <div>
          <span className="text-zinc-500 text-base font-semibold uppercase tracking-wider block">
            Раунд {gameState.round}
          </span>
          <span className="text-white text-xl font-bold">
            Ход игрока: {activePlayer.name}
          </span>
        </div>

        <MenuDropdown
          players={gameState.players}
          onOpenPacks={onOpenPacks}
          onResetGame={onExit}
        />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full my-auto">
        {/* PHASE 1: Storyteller's Turn */}
        {effectivePhase === "storyteller_turn" ? (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
                Вы ведущий
              </h1>
              <p className="text-zinc-400 text-lg">
                Выберите мем и загадайте к нему ассоциацию
              </p>
            </div>

            {/* Hand Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {activePlayer.hand.map((card) => (
                <MemeCardComponent
                  key={card.id}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onClick={() => setSelectedCardId(card.id)}
                />
              ))}
            </div>

            {/* Progressive Disclosure: Clue input appears only when card is selected */}
            {selectedCardId && (
              <div className="max-w-xl mx-auto w-full space-y-4 pt-4 animate-fade-appear">
                <input
                  type="text"
                  placeholder="Ваша ассоциация (фраза, цитата или звук)..."
                  value={clueInput}
                  onChange={(e) => setClueInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStorytellerSubmit()}
                  autoFocus
                  className="w-full bg-zinc-900 text-white text-xl sm:text-2xl px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white border-0 placeholder:text-zinc-600 font-semibold text-center"
                />

                {clueInput.trim() && (
                  <button
                    onClick={handleStorytellerSubmit}
                    className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95 animate-fade-appear"
                  >
                    Загадать ассоциацию
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* PHASE 2: Other Players Matching Cards */}
        {effectivePhase === "matching_turn" ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-zinc-400 text-base font-semibold uppercase tracking-wider block">
                Ассоциация ведущего ({storyteller.name})
              </span>
              <h2 className="text-white text-3xl sm:text-4xl font-black">
                «{gameState.clue}»
              </h2>
              <p className="text-zinc-400 text-lg">
                Выберите мем из своей руки, который лучше всего подходит
              </p>
            </div>

            {/* Hand Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {activePlayer.hand.map((card) => (
                <MemeCardComponent
                  key={card.id}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onClick={() => setSelectedCardId(card.id)}
                />
              ))}
            </div>

            {/* Progressive Disclosure: Action button appears only after selecting */}
            {selectedCardId && (
              <div className="max-w-md mx-auto w-full pt-4 animate-fade-appear">
                <button
                  onClick={handlePlayerPickCard}
                  className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
                >
                  Выбрать этот мем
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* PHASE 3: Voting on Table Cards */}
        {effectivePhase === "voting" ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-zinc-400 text-base font-semibold uppercase tracking-wider block">
                Голосование: {activePlayer.name}
              </span>
              <h2 className="text-white text-3xl sm:text-4xl font-black">
                «{gameState.clue}»
              </h2>
              <p className="text-zinc-400 text-lg">
                Угадайте, какую карточку загадал ведущий {storyteller.name}
              </p>
            </div>

            {/* Shuffled Table Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {gameState.playedCards.map((played) => {
                const isOwnCard = played.playerId === activePlayer.id;
                return (
                  <MemeCardComponent
                    key={played.card.id}
                    card={played.card}
                    isSelected={selectedCardId === played.card.id}
                    disabled={isOwnCard}
                    label={isOwnCard ? "Ваша карта" : undefined}
                    onClick={() => setSelectedCardId(played.card.id)}
                  />
                );
              })}
            </div>

            {/* Progressive Disclosure: Vote button */}
            {selectedCardId && (
              <div className="max-w-md mx-auto w-full pt-4 animate-fade-appear">
                <button
                  onClick={handleVoteSubmit}
                  className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
                >
                  Проголосовать за эту карту
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* PHASE 4: Round Results & Scoring Breakdown */}
        {effectivePhase === "scoring" && gameState.lastRoundResult && (
          <div className="space-y-8 animate-fade-appear">
            <div className="text-center space-y-2">
              <span className="text-zinc-400 text-base font-semibold uppercase tracking-wider block">
                Итоги раунда {gameState.round}
              </span>
              <h2 className="text-white text-3xl sm:text-4xl font-black">
                «{gameState.clue}»
              </h2>
              <p className="text-zinc-300 text-lg">
                {gameState.lastRoundResult.allGuessed
                  ? "Все игроки угадали карту ведущего! Ведущий получает 0."
                  : gameState.lastRoundResult.noneGuessed
                  ? "Никто не угадал карту ведущего! Слишком сложно — ведущий получает 0."
                  : `Карту ведущего (${storyteller.name}) отгадали частично!`}
              </p>
            </div>

            {/* Table with vote counts and cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {gameState.playedCards.map((pc) => {
                const isStCard = pc.playerId === storyteller.id;
                const owner = gameState.players.find((p) => p.id === pc.playerId);
                return (
                  <div key={pc.card.id} className="space-y-2">
                    <MemeCardComponent
                      card={pc.card}
                      votesCount={pc.votes.length}
                      label={isStCard ? `Ведущий: ${owner?.name}` : owner?.name}
                    />
                  </div>
                );
              })}
            </div>

            {/* Score updates list */}
            <div className="max-w-xl mx-auto w-full bg-zinc-900 rounded-2xl p-6 space-y-4">
              <div className="text-white font-bold text-xl">Начисление очков:</div>
              <div className="space-y-3">
                {gameState.lastRoundResult.pointsAwarded.map((item) => (
                  <div
                    key={item.playerId}
                    className="flex items-center justify-between border-b border-zinc-800 pb-2 text-base"
                  >
                    <div>
                      <span className="text-white font-bold text-lg block">
                        {item.playerName}
                      </span>
                      <span className="text-zinc-400 text-base">{item.reason}</span>
                    </div>
                    <span className="text-white font-bold text-xl">
                      +{item.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-md mx-auto w-full pt-4">
              <button
                onClick={handleNextRound}
                className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
              >
                Следующий раунд
              </button>
            </div>
          </div>
        )}

        {/* PHASE 5: Game Over */}
        {effectivePhase === "game_over" && (
          <div className="text-center max-w-lg mx-auto w-full space-y-6 animate-fade-appear">
            <span className="text-zinc-400 text-base font-semibold uppercase tracking-wider block">
              Игра окончена
            </span>
            <h1 className="text-white text-4xl sm:text-5xl font-black">
              Победитель определен!
            </h1>
            <div className="bg-zinc-900 p-6 rounded-2xl space-y-4">
              {[...gameState.players]
                .sort((a, b) => b.score - a.score)
                .map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-800"
                  >
                    <span className="text-white font-bold text-xl">
                      {idx + 1}. {p.name}
                    </span>
                    <span className="text-white font-black text-2xl">
                      {p.score} очков
                    </span>
                  </div>
                ))}
            </div>
            <button
              onClick={onExit}
              className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
            >
              Вернуться в главное меню
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
