"use client";

import React, { useState } from "react";
import { MemeCard } from "../types/game";
import { DEFAULT_MEME_PACK } from "../data/default-meme-pack";
import { PackModal } from "./PackModal";
import { generateRoomCode } from "../lib/multiplayer-p2p";

interface LobbyProps {
  onStartPassAndPlay: (playerNames: string[], deck: MemeCard[], targetScore: number) => void;
  onStartMultiplayerHost: (roomCode: string, playerName: string, deck: MemeCard[]) => void;
  onJoinMultiplayer: (roomCode: string, playerName: string, deck: MemeCard[]) => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  onStartPassAndPlay,
  onStartMultiplayerHost,
  onJoinMultiplayer,
}) => {
  const [mode, setMode] = useState<"select" | "pass_and_play" | "multiplayer">("select");
  const [players, setPlayers] = useState<string[]>(["Игрок 1", "Игрок 2", "Игрок 3"]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [targetScore, setTargetScore] = useState<number>(20);

  // Multiplayer state
  const [multiRole, setMultiRole] = useState<"create" | "join">("create");
  const [mpName, setMpName] = useState("Игрок");
  const [joinCode, setJoinCode] = useState("");

  // Pack state
  const [activeDeck, setActiveDeck] = useState<MemeCard[]>(DEFAULT_MEME_PACK);
  const [activePackName, setActivePackName] = useState("СНГ Мемы 2026");
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers((prev) => [...prev, newPlayerName.trim()]);
    setNewPlayerName("");
  };

  const handleRemovePlayer = (idx: number) => {
    if (players.length <= 3) return;
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleStartSolo = () => {
    if (players.length < 3) return;
    onStartPassAndPlay(players, activeDeck, targetScore);
  };

  const handleStartMulti = () => {
    if (!mpName.trim()) return;
    if (multiRole === "create") {
      const code = generateRoomCode();
      onStartMultiplayerHost(code, mpName.trim(), activeDeck);
    } else {
      if (!joinCode.trim()) return;
      onJoinMultiplayer(joinCode.trim().toUpperCase(), mpName.trim(), activeDeck);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 select-none">
      {/* Top Header */}
      <header className="flex justify-between items-center max-w-xl mx-auto w-full">
        <span className="text-white font-black text-2xl tracking-tighter">
          MEMEGINARIUM
        </span>
        <button
          onClick={() => setIsPackModalOpen(true)}
          className="text-zinc-400 hover:text-white text-base font-semibold py-2 px-3 rounded-xl bg-zinc-900 transition-colors"
        >
          {activePackName} ({activeDeck.length})
        </button>
      </header>

      {/* Main Center Container */}
      <main className="max-w-xl mx-auto w-full space-y-8 my-auto">
        {mode === "select" && (
          <div className="space-y-6 text-center animate-fade-appear">
            <div className="space-y-2">
              <h1 className="text-white text-4xl sm:text-5xl font-black tracking-tight">
                Имаджинариум для мемов
              </h1>
              <p className="text-zinc-400 text-lg">
                Свежие СНГ-тренды осени 2026 в вертикальном формате
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={() => setMode("pass_and_play")}
                className="w-full bg-white text-black text-xl font-bold py-5 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
              >
                Один телефон (Pass-and-play)
              </button>

              <button
                onClick={() => setMode("multiplayer")}
                className="w-full bg-zinc-900 text-white text-xl font-bold py-5 px-8 rounded-2xl hover:bg-zinc-800 transition-transform active:scale-95"
              >
                Мультиплеер по комнатам
              </button>
            </div>
          </div>
        )}

        {/* Pass-and-play Setup Screen */}
        {mode === "pass_and_play" && (
          <div className="space-y-6 animate-fade-appear">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-3xl font-bold">Один телефон</h2>
              <button
                onClick={() => setMode("select")}
                className="text-zinc-400 hover:text-white text-base font-bold"
              >
                Назад
              </button>
            </div>

            {/* Players List */}
            <div className="bg-zinc-900 rounded-2xl p-6 space-y-4">
              <div className="text-zinc-400 text-base font-bold uppercase tracking-wider">
                Игроки (минимум 3)
              </div>
              <div className="space-y-2">
                {players.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-zinc-800 text-lg font-semibold"
                  >
                    <span>
                      {idx + 1}. {p}
                    </span>
                    {players.length > 3 && (
                      <button
                        onClick={() => handleRemovePlayer(idx)}
                        className="text-red-400 hover:text-red-300 text-base font-bold px-2 py-1"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add player field */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Имя нового игрока"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
                  className="flex-1 bg-zinc-800 text-white text-lg px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white border-0 font-medium"
                />
                <button
                  onClick={handleAddPlayer}
                  className="bg-white text-black text-lg font-bold px-6 py-3 rounded-xl hover:bg-zinc-200"
                >
                  Добавить
                </button>
              </div>
            </div>

            {/* Target Score Selection */}
            <div className="bg-zinc-900 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <span className="text-white text-lg font-bold block">Счёт для победы</span>
                <span className="text-zinc-400 text-base">Очков для завершения матча</span>
              </div>
              <div className="flex gap-2">
                {[15, 20, 30].map((score) => (
                  <button
                    key={score}
                    onClick={() => setTargetScore(score)}
                    className={`px-4 py-2 rounded-xl text-lg font-bold transition-colors ${
                      targetScore === score
                        ? "bg-white text-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartSolo}
              className="w-full bg-white text-black text-xl font-bold py-5 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
            >
              Начать игру
            </button>
          </div>
        )}

        {/* Multiplayer Setup Screen */}
        {mode === "multiplayer" && (
          <div className="space-y-6 animate-fade-appear">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-3xl font-bold">Мультиплеер</h2>
              <button
                onClick={() => setMode("select")}
                className="text-zinc-400 hover:text-white text-base font-bold"
              >
                Назад
              </button>
            </div>

            {/* Role Switcher */}
            <div className="flex gap-2 bg-zinc-900 p-2 rounded-2xl">
              <button
                onClick={() => setMultiRole("create")}
                className={`flex-1 py-3 rounded-xl text-lg font-bold transition-colors ${
                  multiRole === "create"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Создать комнату
              </button>
              <button
                onClick={() => setMultiRole("join")}
                className={`flex-1 py-3 rounded-xl text-lg font-bold transition-colors ${
                  multiRole === "join"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Войти по коду
              </button>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-zinc-400 text-base font-semibold block mb-2">
                  Ваше имя в игре
                </label>
                <input
                  type="text"
                  value={mpName}
                  onChange={(e) => setMpName(e.target.value)}
                  className="w-full bg-zinc-800 text-white text-lg px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white border-0 font-medium"
                />
              </div>

              {multiRole === "join" && (
                <div>
                  <label className="text-zinc-400 text-base font-semibold block mb-2">
                    4-значный код комнаты
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Например: ABCD"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full bg-zinc-800 text-white text-2xl font-bold tracking-widest text-center px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white border-0 uppercase"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleStartMulti}
              className="w-full bg-white text-black text-xl font-bold py-5 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95"
            >
              {multiRole === "create" ? "Создать комнату" : "Подключиться"}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-zinc-600 text-base max-w-xl mx-auto w-full pt-4">
        Минимальный размер шрифта 16px • Без теней и обводок
      </footer>

      {/* Pack Modal */}
      <PackModal
        isOpen={isPackModalOpen}
        onClose={() => setIsPackModalOpen(false)}
        activePackName={activePackName}
        onSelectPack={(cards, name) => {
          if (cards.length > 0) {
            setActiveDeck(cards);
            setActivePackName(name);
          } else {
            setActiveDeck(DEFAULT_MEME_PACK);
            setActivePackName("СНГ Мемы 2026");
          }
        }}
      />
    </div>
  );
};
