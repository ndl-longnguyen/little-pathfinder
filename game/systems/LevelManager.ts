import animalsJson from '@/data/animals.json';
import decorationsJson from '@/data/decorations.json';
import levelsJson from '@/data/levels.json';
import missionsJson from '@/data/missions.json';
import stickersJson from '@/data/stickers.json';
import worldsJson from '@/data/worlds.json';
import type {
  AnimalData,
  DecorationData,
  LevelData,
  MissionConfig,
  Progress,
  StickerData,
  WorldConfig,
} from '../types';

const levels = levelsJson as LevelData[];
const animals = animalsJson as AnimalData[];
const stickers = stickersJson as StickerData[];
const missions = missionsJson as MissionConfig[];
const worlds = worldsJson as WorldConfig[];
const decorations = decorationsJson as DecorationData[];

function validateGameData() {
  const animalIds = new Set(animals.map((a) => a.id));
  const stickerIds = new Set(stickers.map((s) => s.id));
  const decorationIds = new Set(decorations.map((d) => d.id));

  // Validate Missions
  for (const mission of missions) {
    if (!animalIds.has(mission.animalId)) {
      console.warn(`[LevelManager] Mission ${mission.id} references unknown animal: ${mission.animalId}`);
    }
    if (!stickerIds.has(mission.reward.stickerId)) {
      console.warn(`[LevelManager] Mission ${mission.id} references unknown sticker: ${mission.reward.stickerId}`);
    }
    if (mission.reward.decorationId && !decorationIds.has(mission.reward.decorationId)) {
      console.warn(`[LevelManager] Mission ${mission.id} references unknown decoration: ${mission.reward.decorationId}`);
    }
    if (!mission.challenges || mission.challenges.length === 0) {
      console.error(`[LevelManager] Mission ${mission.id} has no challenges!`);
    }
  }
}

validateGameData();

export class LevelManager {
  // Worlds
  static getWorlds(): WorldConfig[] {
    return worlds;
  }

  static getActiveWorld(): WorldConfig {
    return worlds.find((w) => w.status === 'active') || worlds[0];
  }

  // Missions
  static getMissions(): MissionConfig[] {
    return missions;
  }

  static getMissionById(id: number): MissionConfig | undefined {
    return missions.find((m) => m.id === id);
  }

  static hasMission(id: number): boolean {
    return missions.some((m) => m.id === id);
  }

  static getFirstMission(): MissionConfig {
    return missions[0];
  }

  static getNextMission(currentId: number): MissionConfig | undefined {
    return missions.find((m) => m.id === currentId + 1);
  }

  static getNextPlayableMission(progress: Progress): MissionConfig {
    const unlocked = progress.unlockedMissions || progress.unlockedLevels || [1];
    const completed = progress.completedMissions || progress.completedLevels || [];

    const nextUnfinished = missions.find(
      (m) => unlocked.includes(m.id) && !completed.includes(m.id),
    );

    if (nextUnfinished) {
      return nextUnfinished;
    }

    const lastUnlocked = missions.filter((m) => unlocked.includes(m.id)).pop();
    return lastUnlocked || missions[0];
  }

  // Animals
  static getAnimals(): AnimalData[] {
    return animals;
  }

  static getAnimalById(id: string): AnimalData | undefined {
    return animals.find((a) => a.id === id);
  }

  // Stickers
  static getStickers(): StickerData[] {
    return stickers;
  }

  static getStickerById(id: string): StickerData | undefined {
    return stickers.find((s) => s.id === id);
  }

  // Decorations
  static getDecorations(): DecorationData[] {
    return decorations;
  }

  static getDecorationById(id: string): DecorationData | undefined {
    return decorations.find((d) => d.id === id);
  }

  // Legacy Level compatibility
  static getLevels(): LevelData[] {
    return levels;
  }

  static getLevelById(id: number): LevelData | undefined {
    return levels.find((l) => l.id === id);
  }

  static hasLevel(id: number): boolean {
    return LevelManager.hasMission(id) || levels.some((l) => l.id === id);
  }

  static getFirstLevel(): LevelData {
    return levels[0];
  }

  static getNextLevel(currentId: number): LevelData | undefined {
    return levels.find((l) => l.id === currentId + 1);
  }

  static getNextPlayableLevel(progress: Progress): LevelData {
    const mission = LevelManager.getNextPlayableMission(progress);
    return LevelManager.getLevelById(mission.id) || levels[0];
  }
}
