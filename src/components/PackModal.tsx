"use client";

import React, { useState, useEffect } from "react";
import { MemeCard } from "../types/game";
import { getCustomPacks, saveCustomPack, deleteCustomPack, fileToMemeCard, CustomPack } from "../lib/storage";

interface PackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPack: (cards: MemeCard[], packName: string) => void;
  activePackName: string;
}

export const PackModal: React.FC<PackModalProps> = ({
  isOpen,
  onClose,
  onSelectPack,
  activePackName,
}) => {
  const [customPacks, setCustomPacks] = useState<CustomPack[]>([]);
  const [packNameInput, setPackNameInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCards, setUploadedCards] = useState<MemeCard[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadPacks();
    }
  }, [isOpen]);

  const loadPacks = async () => {
    const packs = await getCustomPacks();
    setCustomPacks(packs);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const cards: MemeCard[] = [];
      for (let i = 0; i < files.length; i++) {
        const card = await fileToMemeCard(files[i], i);
        cards.push(card);
      }
      setUploadedCards((prev) => [...prev, ...cards]);
    } catch (err) {
      console.error("Error processing meme images:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSavePack = async () => {
    if (uploadedCards.length < 6) {
      alert("В паке должно быть минимум 6 карточек.");
      return;
    }
    const name = packNameInput.trim() || `Пак ${customPacks.length + 1}`;
    const newPack = await saveCustomPack(name, uploadedCards);
    setUploadedCards([]);
    setPackNameInput("");
    await loadPacks();
    onSelectPack(newPack.cards, newPack.name);
  };

  const handleDelete = async (id: string) => {
    await deleteCustomPack(id);
    await loadPacks();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fade-appear">
      <div className="bg-zinc-900 max-w-xl w-full p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-3xl font-bold">Колоды мемов</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-lg font-bold px-2 py-1"
          >
            Закрыть
          </button>
        </div>

        {/* Built-in default pack selection */}
        <div className="space-y-3">
          <div className="text-zinc-400 text-base font-semibold">Базовый пак</div>
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl">
            <div>
              <div className="text-white font-bold text-lg">СНГ Мемы 2026 (Тикток)</div>
              <div className="text-zinc-400 text-base">26 культовых мемов осени 2026</div>
            </div>
            <button
              onClick={() => {
                onSelectPack([], "СНГ Мемы 2026");
                onClose();
              }}
              className={`px-4 py-2 rounded-xl text-base font-bold ${
                activePackName === "СНГ Мемы 2026"
                  ? "bg-zinc-700 text-zinc-300 cursor-default"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {activePackName === "СНГ Мемы 2026" ? "Выбран" : "Выбрать"}
            </button>
          </div>
        </div>

        {/* Custom Packs List */}
        {customPacks.length > 0 && (
          <div className="space-y-3">
            <div className="text-zinc-400 text-base font-semibold">Ваши загруженные паки</div>
            {customPacks.map((pack) => (
              <div
                key={pack.id}
                className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl"
              >
                <div>
                  <div className="text-white font-bold text-lg">{pack.name}</div>
                  <div className="text-zinc-400 text-base">{pack.cards.length} карточек</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      onSelectPack(pack.cards, pack.name);
                      onClose();
                    }}
                    className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-base font-bold"
                  >
                    Выбрать
                  </button>
                  <button
                    onClick={() => handleDelete(pack.id)}
                    className="px-3 py-2 text-red-400 hover:text-red-300 text-base font-bold"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploader Section */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <div className="text-white font-bold text-xl">Создать свой пак</div>
          
          <input
            type="text"
            placeholder="Название пака (например: Мемы с котами)"
            value={packNameInput}
            onChange={(e) => setPackNameInput(e.target.value)}
            className="w-full bg-zinc-800 text-white text-lg px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white border-0"
          />

          <label className="block w-full border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl p-6 text-center cursor-pointer transition-colors">
            <span className="text-white text-lg font-semibold block">
              {isUploading ? "Загрузка..." : "Выберите картинки мемов"}
            </span>
            <span className="text-zinc-400 text-base block mt-1">
              JPG, PNG, WEBP, GIF
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          {uploadedCards.length > 0 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-zinc-300 text-base font-medium">
                Загружено: {uploadedCards.length} картинок
              </span>
              <button
                onClick={handleSavePack}
                className="bg-white text-black text-lg font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Сохранить пак
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
