"use client";

import React, { useState, useEffect, useRef } from "react";
import { Player } from "../types/game";

interface MenuDropdownProps {
  players?: Player[];
  onOpenPacks?: () => void;
  onResetGame?: () => void;
  roomCode?: string;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({
  players = [],
  onOpenPacks,
  onResetGame,
  roomCode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"rules" | "scores" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveModal(null);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* 3-dots trigger button: pure typographic glyph, borderless, no underlay */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-white hover:text-zinc-300 px-3 py-2 text-2xl font-bold leading-none bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
        aria-label="Настройки и меню"
        aria-expanded={isOpen}
      >
        ⋮
      </button>

      {/* Dropdown panel: radical flat, zero shadows, zero borders */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-zinc-900 rounded-xl p-2 z-50 animate-fade-appear">
          {roomCode && (
            <div className="px-4 py-3 border-b border-zinc-800">
              <span className="text-zinc-400 text-base block">Код комнаты</span>
              <span className="text-white font-bold text-xl tracking-wider select-all">
                {roomCode}
              </span>
            </div>
          )}

          <button
            onClick={() => {
              setActiveModal("scores");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-white text-lg font-semibold hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Таблица счёта
          </button>

          <button
            onClick={() => {
              setActiveModal("rules");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-white text-lg font-semibold hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Правила игры
          </button>

          {onOpenPacks && (
            <button
              onClick={() => {
                onOpenPacks();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-white text-lg font-semibold hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Колода и загрузка
            </button>
          )}

          {onResetGame && (
            <button
              onClick={() => {
                onResetGame();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-red-400 text-lg font-semibold hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Выйти в лобби
            </button>
          )}
        </div>
      )}

      {/* Rules Modal */}
      {activeModal === "rules" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fade-appear">
          <div className="bg-zinc-900 max-w-lg w-full p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-white text-3xl font-bold mb-4">Правила</h2>
            <div className="text-zinc-300 text-base space-y-4">
              <p>
                <strong>1. Ведущий:</strong> Выбирает один мем из руки и загадывает ассоциацию (фразу, цитату, звук).
              </p>
              <p>
                <strong>2. Игроки:</strong> Выбирают из своей руки мем, который лучше всего подходит под ассоциацию ведущего.
              </p>
              <p>
                <strong>3. Голосование:</strong> Все карты перемешиваются. Игроки голосуют за карту, которую загадал ведущий. За свою голосовать нельзя.
              </p>
              <p>
                <strong>4. Очки:</strong> Если угадали все или никто — ведущий получает 0, остальные по 2. В остальных случаях ведущий и угадавшие получают по +3 очка, плюс +1 за каждый голос за чужую карту.
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full bg-white text-black text-lg font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Понятно
            </button>
          </div>
        </div>
      )}

      {/* Scores Modal */}
      {activeModal === "scores" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fade-appear">
          <div className="bg-zinc-900 max-w-md w-full p-6 sm:p-8 rounded-2xl">
            <h2 className="text-white text-3xl font-bold mb-6">Текущий счёт</h2>
            <div className="space-y-3">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2 border-b border-zinc-800"
                >
                  <span className="text-white text-lg font-medium">
                    {idx + 1}. {p.name}
                  </span>
                  <span className="text-white text-xl font-bold">
                    {p.score} очков
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full bg-white text-black text-lg font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
