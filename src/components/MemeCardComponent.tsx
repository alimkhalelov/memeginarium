"use client";

import React from "react";
import { MemeCard } from "../types/game";

interface MemeCardProps {
  card: MemeCard;
  isSelected?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  votesCount?: number;
  label?: string;
}

export const MemeCardComponent: React.FC<MemeCardProps> = ({
  card,
  isSelected = false,
  isRevealed = true,
  onClick,
  disabled = false,
  votesCount,
  label,
}) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (!disabled && onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`${card.title}. ${card.description}`}
      className={`relative w-full aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer select-none transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-white ${
        isSelected
          ? "ring-4 ring-white scale-[1.02]"
          : "hover:opacity-95"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      style={{
        backgroundColor: "#18181b",
        border: "none",
        boxShadow: "none",
      }}
    >
      {isRevealed ? (
        <>
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover pointer-events-none"
            loading="lazy"
          />

          {/* Optional votes badge for scoring phase - borderless flat pill */}
          {typeof votesCount === "number" && (
            <div className="absolute top-3 right-3 bg-white text-black font-bold px-3 py-1 rounded-full text-base">
              Голосов: {votesCount}
            </div>
          )}

          {/* Optional status label */}
          {label && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/80 text-white font-semibold px-3 py-2 rounded-xl text-base text-center">
              {label}
            </div>
          )}
        </>
      ) : (
        /* Hidden card back for Dixit */
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-6 text-center">
          <div className="w-12 h-1 bg-zinc-700 mb-6 rounded-full" />
          <span className="text-zinc-500 font-bold tracking-widest text-lg uppercase">
            Memeginarium
          </span>
          <div className="w-12 h-1 bg-zinc-700 mt-6 rounded-full" />
        </div>
      )}
    </div>
  );
};
