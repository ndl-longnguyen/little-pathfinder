import animalsJson from '@/data/animals.json';
import levelsJson from '@/data/levels.json';
import stickersJson from '@/data/stickers.json';
import type { AnimalData, LevelData, Progress, StickerData } from '../types';

const levels = levelsJson as LevelData[];
const animals = animalsJson as AnimalData[];
const stickers = stickersJson as StickerData[];

const maxOptionsByAge = {
  '1-2': 2,
  '3-4': 3,
  '5-6': 4,
} as const;

function validateLevels() {
  const stickerIds = new Set(stickers.map((sticker) => sticker.id));
  const animalIds = new Set(animals.map((animal) => animal.id));

  for (const level of levels) {
    const correctCount = level.options.filter((option) => option.isCorrect).length;

    if (correctCount !== 1) {
      throw new Error(`Level ${level.id} must have exactly one correct option.`);
    }

    if (level.options.length > maxOptionsByAge[level.ageMode]) {
      throw new Error(`Level ${level.id} has too many options for age ${level.ageMode}.`);
    }

    if (!level.instructionAudio) {
      throw new Error(`Level ${level.id} is missing instruction audio.`);
    }

    if (!animalIds.has(level.animalId)) {
      throw new Error(`Level ${level.id} references missing animal ${level.animalId}.`);
    }

    if (!stickerIds.has(level.rewardStickerId)) {
      throw new Error(`Level ${level.id} references missing sticker ${level.rewardStickerId}.`);
    }
  }
}

validateLevels();

export class LevelManager {
  static getLevels() {
    return levels;
  }

  static getAnimals() {
    return animals;
  }

  static getStickers() {
    return stickers;
  }

  static getLevelById(id: number) {
    return levels.find((level) => level.id === id);
  }

  static hasLevel(id: number) {
    return levels.some((level) => level.id === id);
  }

  static getAnimalById(id: string) {
    return animals.find((animal) => animal.id === id);
  }

  static getStickerById(id: string) {
    return stickers.find((sticker) => sticker.id === id);
  }

  static getFirstLevel() {
    return levels[0];
  }

  static getNextLevel(currentId: number) {
    return levels.find((level) => level.id === currentId + 1);
  }

  static getNextPlayableLevel(progress: Progress) {
    const nextUnlocked = levels.find(
      (level) =>
        progress.unlockedLevels.includes(level.id) &&
        !progress.completedLevels.includes(level.id),
    );

    return nextUnlocked ?? levels.find((level) => progress.unlockedLevels.includes(level.id)) ?? levels[0];
  }
}
