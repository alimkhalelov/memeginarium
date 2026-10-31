"use client";

import React from "react";

interface PrivacyVeilProps {
  targetPlayerName: string;
  onReveal: () => void;
  subtitle?: string;
}

export const PrivacyVeil: React.FC<PrivacyVeilProps> = ({
  targetPlayerName,
  onReveal,
  subtitle = "Не подглядывайте в чужие карты",
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center p-6 text-center select-none animate-fade-appear">
      <div className="max-w-md w-full space-y-6">
        <span className="text-zinc-500 font-bold uppercase tracking-widest text-base block">
          Передача хода
        </span>
        
        <h1 className="text-white text-4xl sm:text-5xl font-black tracking-tight">
          {targetPlayerName}
        </h1>

        <p className="text-zinc-400 text-lg">
          {subtitle}
        </p>

        <div className="pt-8">
          <button
            onClick={onReveal}
            autoFocus
            className="w-full bg-white text-black text-xl font-bold py-4 px-8 rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-zinc-400"
          >
            Я держу телефон
          </button>
        </div>
      </div>
    </div>
  );
};
