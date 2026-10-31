"use client";

import React, { useState, useEffect, useRef } from "react";
import { GameState, MemeCard, Player } from "../types/game";
import {
  initializeMatch,
  setStorytellerClue,
  submitPlayerCard,
  castVote,
  advanceToNextRound,
} from "../engine/game-engine";
import { MemeCardComponent } from "./MemeCardComponent";
import { MenuDropdown } from "./MenuDropdown";
import { PeerMessage, formatPeerId } from "../lib/multiplayer-p2p";
import type { DataConnection, Peer } from "peerjs";

interface MultiplayerGameProps {
  isHost: boolean;
  roomCode: string;
  playerName: string;
  deck: MemeCard[];
  onExit: () => void;
}

export const MultiplayerGame: React.FC<MultiplayerGameProps> = ({
  isHost,
  roomCode,
  playerName,
  deck,
  onExit,
}) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>("");
  const [lobbyPlayers, setLobbyPlayers] = useState<{ id: string; name: string }[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [clueInput, setClueInput] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("Подключение к комнате...");

  const peerRef = useRef<Peer | null>(null);
  const hostConnRef = useRef<DataConnection | null>(null);
  const clientConnsRef = useRef<Map<string, DataConnection>>(new Map());

  // Broadcast to all connected clients if host
  const broadcastState = (newState: GameState) => {
    setGameState(newState);
    const msg: PeerMessage = { type: "STATE_UPDATE", state: newState };
    clientConnsRef.current.forEach((conn) => {
      if (conn.open) conn.send(msg);
    });
  };

  useEffect(() => {
    let isCancelled = false;

    async function initP2P() {
      const { default: Peer } = await import("peerjs");
      const peerId = isHost ? formatPeerId(roomCode) : undefined;
      const peer = new Peer(peerId || "", { debug: 1 });
      peerRef.current = peer;

      peer.on("open", (id) => {
        if (isCancelled) return;
        setMyPlayerId(id);
        setStatusMessage(isHost ? `Комната создана: ${roomCode}` : "Подключение к ведущему...");

        if (isHost) {
          setLobbyPlayers([{ id, name: playerName }]);
        } else {
          // Connect to Host
          const hostPeerId = formatPeerId(roomCode);
          const conn = peer.connect(hostPeerId, { reliable: true });
          hostConnRef.current = conn;

          conn.on("open", () => {
            conn.send({
              type: "JOIN_REQUEST",
              playerName,
              playerId: id,
            } as PeerMessage);
            setStatusMessage("В лобби. Ожидание старта игры ведущим...");
          });

          conn.on("data", (data: unknown) => {
            const msg = data as PeerMessage;
            if (msg.type === "STATE_UPDATE") {
              setGameState(msg.state);
            }
          });

          conn.on("close", () => {
            setStatusMessage("Связь с комнатой потеряна.");
          });
        }
      });

      if (isHost) {
        peer.on("connection", (conn) => {
          conn.on("data", (data: unknown) => {
            const msg = data as PeerMessage;
            if (msg.type === "JOIN_REQUEST") {
              clientConnsRef.current.set(msg.playerId, conn);
              setLobbyPlayers((prev) => {
                if (prev.some((p) => p.id === msg.playerId)) return prev;
                return [...prev, { id: msg.playerId, name: msg.playerName }];
              });
            } else if (msg.type === "STORYTELLER_CLUE") {
              setGameState((prev) => {
                if (!prev) return null;
                const updated = setStorytellerClue(prev, msg.cardId, msg.clue);
                broadcastState(updated);
                return updated;
              });
            } else if (msg.type === "PICK_CARD") {
              setGameState((prev) => {
                if (!prev) return null;
                const updated = submitPlayerCard(prev, msg.playerId, msg.cardId);
                broadcastState(updated);
                return updated;
              });
            } else if (msg.type === "CAST_VOTE") {
              setGameState((prev) => {
                if (!prev) return null;
                const updated = castVote(prev, msg.playerId, msg.cardId);
                broadcastState(updated);
                return updated;
              });
            }
          });

          conn.on("close", () => {
            clientConnsRef.current.delete(conn.peer);
            setLobbyPlayers((prev) => prev.filter((p) => p.id !== conn.peer));
          });
        });
      }

      peer.on("error", (err) => {
        console.error("PeerJS error:", err);
        setStatusMessage(`Ошибка сети: ${err.message || "Комната не найдена"}`);
      });
    }

    initP2P();

    return () => {
      isCancelled = true;
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [isHost, roomCode, playerName]);

  const handleStartGame = () => {
    if (lobbyPlayers.length < 3) {
      alert("Для игры в Imaginarium нужно минимум 3 игрока.");
      return;
    }
    const initial = initializeMatch(
      lobbyPlayers.map((p) => p.name),
      deck,
      20,
      "multiplayer"
    );
    // Bind network IDs to players
    const playersWithNetId: Player[] = initial.players.map((p, idx) => ({
      ...p,
      id: lobbyPlayers[idx].id,
    }));
    const fullState: GameState = {
      ...initial,
      players: playersWithNetId,
      roomCode,
      phase: "storyteller_turn",
    };
    broadcastState(fullState);
  };

  const myPlayer = gameState?.players.find((p) => p.id === myPlayerId);
  const storyteller = gameState?.players[gameState?.storytellerIndex || 0];
  const isMyStorytellerTurn = myPlayer && storyteller && myPlayer.id === storyteller.id;

  const sendAction = (msg: PeerMessage) => {
    if (isHost && gameState) {
      if (msg.type === "STORYTELLER_CLUE") {
        const next = setStorytellerClue(gameState, msg.cardId, msg.clue);
        broadcastState(next);
      } else if (msg.type === "PICK_CARD") {
        const next = submitPlayerCard(gameState, msg.playerId, msg.cardId);
        broadcastState(next);
      } else if (msg.type === "CAST_VOTE") {
        const next = castVote(gameState, msg.playerId, msg.cardId);
        broadcastState(next);
      }
    } else if (hostConnRef.current?.open) {
      hostConnRef.current.send(msg);
    }
  };

  // Lobby Waiting Screen
  if (!gameState || gameState.phase === "lobby") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6">
        <header className="flex justify-between items-center">
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-base">
            Комната: {roomCode}
          </span>
          <button onClick={onExit} className="text-zinc-400 hover:text-white font-bold text-lg">
            Выйти
          </button>
        </header>

        <main className="max-w-md mx-auto w-full text-center space-y-6 my-auto">
          <div className="space-y-2">
            <span className="text-zinc-400 text-base font-semibold uppercase tracking-wider block">
              Код подключения
            </span>
            <h1 className="text-white text-5xl font-black tracking-widest select-all">
              {roomCode}
            </h1>
            <p className="text-zinc-400 text-lg">{statusMessage}</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 text-left space-y-3">
            <div className="text-zinc-400 text-base font-bold uppercase tracking-wider">
              Игроки в комнате ({lobbyPlayers.length})
            </div>
            {lobbyPlayers.map((p, idx) => (
              <div key={p.id} className="text-white text-lg font-semibold flex items-center justify-between">
                <span>
                  {idx + 1}. {p.name}
                </span>
                {idx === 0 && <span className="text-zinc-400 text-base font-normal">Создатель</span>}
              </div>
            ))}
          </div>

          {isHost && (
            <button
              onClick={handleStartGame}
              disabled={lobbyPlayers.length < 3}
              className={`w-full py-4 px-8 rounded-2xl text-xl font-bold transition-all ${
                lobbyPlayers.length >= 3
                  ? "bg-white text-black hover:bg-zinc-200 active:scale-95"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {lobbyPlayers.length >= 3 ? "Начать игру" : "Ожидание минимум 3 игроков"}
            </button>
          )}
        </main>
      </div>
    );
  }

  // Active Game In-Room
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-6 select-none">
      <header className="flex items-center justify-between pb-4">
        <div>
          <span className="text-zinc-500 text-base font-semibold uppercase tracking-wider block">
            Раунд {gameState.round} | Комната: {roomCode}
          </span>
          <span className="text-white text-xl font-bold">
            Ведущий: {storyteller?.name}
          </span>
        </div>

        <MenuDropdown
          players={gameState.players}
          roomCode={roomCode}
          onResetGame={onExit}
        />
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full my-auto space-y-6">
        {/* Storyteller phase */}
        {gameState.phase === "storyteller_turn" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-white text-3xl sm:text-4xl font-black">
                {isMyStorytellerTurn ? "Вы ведущий раунда!" : `Ведущий (${storyteller?.name}) выбирает мем`}
              </h2>
              <p className="text-zinc-400 text-lg">
                {isMyStorytellerTurn
                  ? "Выберите мем из руки и введите ассоциацию"
                  : "Пожалуйста, подождите, пока ведущий загадает ассоциацию"}
              </p>
            </div>

            {isMyStorytellerTurn && myPlayer && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                  {myPlayer.hand.map((card) => (
                    <MemeCardComponent
                      key={card.id}
                      card={card}
                      isSelected={selectedCardId === card.id}
                      onClick={() => setSelectedCardId(card.id)}
                    />
                  ))}
                </div>

                {selectedCardId && (
                  <div className="max-w-xl mx-auto w-full space-y-4 pt-4 animate-fade-appear">
                    <input
                      type="text"
                      placeholder="Ваша ассоциация..."
                      value={clueInput}
                      onChange={(e) => setClueInput(e.target.value)}
                      className="w-full bg-zinc-900 text-white text-xl px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white border-0 font-semibold text-center"
                    />
                    {clueInput.trim() && (
                      <button
                        onClick={() => {
                          sendAction({
                            type: "STORYTELLER_CLUE",
                            cardId: selectedCardId,
                            clue: clueInput.trim(),
                          });
                          setSelectedCardId(null);
                        }}
                        className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
                      >
                        Загадать ассоциацию
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Matching phase */}
        {gameState.phase === "matching_turn" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-zinc-400 text-base font-semibold uppercase tracking-wider block">
                Ассоциация ведущего ({storyteller?.name})
              </span>
              <h2 className="text-white text-3xl sm:text-4xl font-black">«{gameState.clue}»</h2>
              <p className="text-zinc-400 text-lg">
                {isMyStorytellerTurn
                  ? "Другие игроки подбирают подходящие мемы..."
                  : myPlayer?.pickedCard
                  ? "Вы уже выбрали карту. Ожидание других игроков..."
                  : "Выберите мем из руки, который лучше всего подходит"}
              </p>
            </div>

            {!isMyStorytellerTurn && !myPlayer?.pickedCard && myPlayer && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                  {myPlayer.hand.map((card) => (
                    <MemeCardComponent
                      key={card.id}
                      card={card}
                      isSelected={selectedCardId === card.id}
                      onClick={() => setSelectedCardId(card.id)}
                    />
                  ))}
                </div>

                {selectedCardId && (
                  <div className="max-w-md mx-auto w-full pt-4 animate-fade-appear">
                    <button
                      onClick={() => {
                        sendAction({
                          type: "PICK_CARD",
                          playerId: myPlayer.id,
                          cardId: selectedCardId,
                        });
                        setSelectedCardId(null);
                      }}
                      className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
                    >
                      Выбрать этот мем
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Voting phase */}
        {gameState.phase === "voting" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-zinc-400 text-base font-semibold uppercase tracking-wider block">
                Голосование
              </span>
              <h2 className="text-white text-3xl sm:text-4xl font-black">«{gameState.clue}»</h2>
              <p className="text-zinc-400 text-lg">
                {isMyStorytellerTurn
                  ? "Игроки голосуют за вашу карту..."
                  : myPlayer?.votedCardId
                  ? "Ваш голос принят! Ожидание остальных..."
                  : `Угадайте карту ведущего (${storyteller?.name})`}
              </p>
            </div>

            {!isMyStorytellerTurn && !myPlayer?.votedCardId && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                  {gameState.playedCards.map((pc) => {
                    const isOwn = pc.playerId === myPlayer?.id;
                    return (
                      <MemeCardComponent
                        key={pc.card.id}
                        card={pc.card}
                        disabled={isOwn}
                        isSelected={selectedCardId === pc.card.id}
                        label={isOwn ? "Ваша карта" : undefined}
                        onClick={() => setSelectedCardId(pc.card.id)}
                      />
                    );
                  })}
                </div>

                {selectedCardId && (
                  <div className="max-w-md mx-auto w-full pt-4 animate-fade-appear">
                    <button
                      onClick={() => {
                        sendAction({
                          type: "CAST_VOTE",
                          playerId: myPlayer!.id,
                          cardId: selectedCardId,
                        });
                        setSelectedCardId(null);
                      }}
                      className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
                    >
                      Проголосовать за эту карту
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Scoring phase */}
        {gameState.phase === "scoring" && gameState.lastRoundResult && (
          <div className="space-y-6 animate-fade-appear">
            <div className="text-center space-y-2">
              <h2 className="text-white text-3xl sm:text-4xl font-black">
                Итоги раунда {gameState.round}: «{gameState.clue}»
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {gameState.playedCards.map((pc) => (
                <MemeCardComponent
                  key={pc.card.id}
                  card={pc.card}
                  votesCount={pc.votes.length}
                  label={pc.playerId === storyteller?.id ? `Ведущий` : undefined}
                />
              ))}
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 max-w-md mx-auto w-full space-y-3">
              {gameState.lastRoundResult.pointsAwarded.map((item) => (
                <div key={item.playerId} className="flex justify-between items-center text-lg">
                  <span className="text-white font-bold">{item.playerName}</span>
                  <span className="text-white font-black">+{item.points}</span>
                </div>
              ))}
            </div>

            {isHost && (
              <div className="max-w-md mx-auto w-full">
                <button
                  onClick={() => broadcastState(advanceToNextRound(gameState))}
                  className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
                >
                  Следующий раунд
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
