import { get, set, del } from "idb-keyval";
import { MemeCard } from "../types/game";

export interface CustomPack {
  id: string;
  name: string;
  createdAt: number;
  cards: MemeCard[];
}

const STORAGE_KEY = "memeginarium_custom_packs";

export async function getCustomPacks(): Promise<CustomPack[]> {
  try {
    const packs = await get<CustomPack[]>(STORAGE_KEY);
    return packs || [];
  } catch (err) {
    console.error("Failed to load custom packs from IndexedDB:", err);
    return [];
  }
}

export async function saveCustomPack(name: string, cards: MemeCard[]): Promise<CustomPack> {
  const existing = await getCustomPacks();
  const newPack: CustomPack = {
    id: `pack_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || "Пользовательский пак",
    createdAt: Date.now(),
    cards,
  };
  const updated = [newPack, ...existing];
  await set(STORAGE_KEY, updated);
  return newPack;
}

export async function deleteCustomPack(packId: string): Promise<void> {
  const existing = await getCustomPacks();
  const filtered = existing.filter((p) => p.id !== packId);
  await set(STORAGE_KEY, filtered);
}

/**
 * Converts a browser File into a base64 DataURL MemeCard.
 */
export function fileToMemeCard(file: File, index: number): Promise<MemeCard> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").toUpperCase();
      resolve({
        id: `custom_${Date.now()}_${index}`,
        title: cleanTitle.slice(0, 30),
        description: "Кастомный мем из пака",
        imageUrl: dataUrl,
        tags: ["кастом"],
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
