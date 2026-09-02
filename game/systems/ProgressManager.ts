import { LevelManager } from './LevelManager';
import type { LearningSkill, MissionReward, Progress, Settings } from '../types';

type PreferenceValue = string | null;

const keys = {
  version: 'progress_version',
  currentWorld: 'current_world_id',
  unlockedLevels: 'unlocked_levels',
  completedLevels: 'completed_levels',
  unlockedStickers: 'unlocked_stickers',
  unlockedMissions: 'unlocked_missions',
  completedMissions: 'completed_missions',
  unlockedAnimals: 'unlocked_animals',
  unlockedDecorations: 'unlocked_decorations',
  stars: 'rescue_stars',
  learningProgress: 'learning_progress',
  sound: 'settings_sound',
  language: 'settings_language',
  ageMode: 'settings_age_mode',
} as const;

async function getPreference(key: string): Promise<PreferenceValue> {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    const result = await Preferences.get({ key });
    if (result.value !== null) {
      return result.value;
    }
  } catch {
    // web fallback
  }

  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(key);
}

async function setPreference(key: string, value: string) {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key, value });
  } catch {
    // web fallback
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
}

async function removePreference(key: string) {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.remove({ key });
  } catch {
    // web fallback
  }

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
}

function parseNumberList(value: PreferenceValue, fallback: number[]): number[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is number => Number.isInteger(item));
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function parseStringList(value: PreferenceValue, fallback: string[]): string[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function parseRecord(value: PreferenceValue, fallback: Record<string, number>): Record<string, number> {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, number>;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function emit(name: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(name));
  }
}

export class ProgressManager {
  static defaultProgress: Progress = {
    version: 2,
    currentWorldId: 'forest',
    unlockedLevels: [1],
    completedLevels: [],
    unlockedMissions: [1],
    completedMissions: [],
    unlockedAnimals: [],
    unlockedStickers: [],
    unlockedDecorations: [],
    stars: {},
    learningProgress: {},
    discoveries: [],
  };

  static defaultSettings: Settings = {
    sound: true,
    language: 'vi',
    ageMode: '1-2',
  };

  /**
   * Migrate v1 data to v2 seamlessly
   */
  private static async checkMigration(): Promise<void> {
    const version = await getPreference(keys.version);
    if (version === '2') {
      return;
    }

    // Read v1 keys
    const [unlockedLevelsRaw, completedLevelsRaw, stickersRaw] = await Promise.all([
      getPreference(keys.unlockedLevels),
      getPreference(keys.completedLevels),
      getPreference(keys.unlockedStickers),
    ]);

    const oldUnlocked = parseNumberList(unlockedLevelsRaw, [1]);
    const oldCompleted = parseNumberList(completedLevelsRaw, []);
    const oldStickers = parseStringList(stickersRaw, []);

    // Derive animals and decorations from old completed levels
    const unlockedAnimals = new Set<string>();
    const unlockedDecorations = new Set<string>();

    for (const lvlId of oldCompleted) {
      const mission = LevelManager.getMissionById(lvlId);
      if (mission?.reward.animalId) {
        unlockedAnimals.add(mission.reward.animalId);
      }
      if (mission?.reward.decorationId) {
        unlockedDecorations.add(mission.reward.decorationId);
      }
    }

    // Write v2 data
    await Promise.all([
      setPreference(keys.version, '2'),
      setPreference(keys.currentWorld, 'forest'),
      setPreference(keys.unlockedMissions, JSON.stringify(oldUnlocked)),
      setPreference(keys.completedMissions, JSON.stringify(oldCompleted)),
      setPreference(keys.unlockedAnimals, JSON.stringify([...unlockedAnimals])),
      setPreference(keys.unlockedDecorations, JSON.stringify([...unlockedDecorations])),
      setPreference(keys.unlockedStickers, JSON.stringify(oldStickers)),
    ]);
  }

  static async getProgress(): Promise<Progress> {
    await ProgressManager.checkMigration();

    const [
      worldRaw,
      unlockedMissionsRaw,
      completedMissionsRaw,
      animalsRaw,
      stickersRaw,
      decorationsRaw,
      starsRaw,
      learningRaw,
    ] = await Promise.all([
      getPreference(keys.currentWorld),
      getPreference(keys.unlockedMissions),
      getPreference(keys.completedMissions),
      getPreference(keys.unlockedAnimals),
      getPreference(keys.unlockedStickers),
      getPreference(keys.unlockedDecorations),
      getPreference(keys.stars),
      getPreference(keys.learningProgress),
    ]);

    const unlockedMissions = parseNumberList(unlockedMissionsRaw, [1]);
    const completedMissions = parseNumberList(completedMissionsRaw, []);
    const unlockedAnimals = parseStringList(animalsRaw, []);
    const unlockedStickers = parseStringList(stickersRaw, []);
    const unlockedDecorations = parseStringList(decorationsRaw, []);
    const stars = parseRecord(starsRaw, {});
    const learningProgress = parseRecord(learningRaw, {});

    return {
      version: 2,
      currentWorldId: worldRaw || 'forest',
      unlockedMissions: unlockedMissions.length > 0 ? unlockedMissions : [1],
      completedMissions,
      unlockedAnimals,
      unlockedStickers,
      unlockedDecorations,
      stars,
      learningProgress,
      // Legacy compatibility mapping
      unlockedLevels: unlockedMissions.length > 0 ? unlockedMissions : [1],
      completedLevels: completedMissions,
    };
  }

  static async saveProgress(progress: Progress): Promise<Progress> {
    const unlockedMissions = [...new Set(progress.unlockedMissions || progress.unlockedLevels)].sort((a, b) => a - b);
    const completedMissions = [...new Set(progress.completedMissions || progress.completedLevels)].sort((a, b) => a - b);
    const unlockedAnimals = [...new Set(progress.unlockedAnimals || [])];
    const unlockedStickers = [...new Set(progress.unlockedStickers)];
    const unlockedDecorations = [...new Set(progress.unlockedDecorations || [])];
    const stars = progress.stars || {};
    const learningProgress = progress.learningProgress || {};

    await Promise.all([
      setPreference(keys.version, '2'),
      setPreference(keys.currentWorld, progress.currentWorldId || 'forest'),
      setPreference(keys.unlockedMissions, JSON.stringify(unlockedMissions)),
      setPreference(keys.completedMissions, JSON.stringify(completedMissions)),
      setPreference(keys.unlockedAnimals, JSON.stringify(unlockedAnimals)),
      setPreference(keys.unlockedStickers, JSON.stringify(unlockedStickers)),
      setPreference(keys.unlockedDecorations, JSON.stringify(unlockedDecorations)),
      setPreference(keys.stars, JSON.stringify(stars)),
      setPreference(keys.learningProgress, JSON.stringify(learningProgress)),
      // Sync legacy keys
      setPreference(keys.unlockedLevels, JSON.stringify(unlockedMissions)),
      setPreference(keys.completedLevels, JSON.stringify(completedMissions)),
    ]);

    emit('progress-changed');

    return {
      version: 2,
      currentWorldId: progress.currentWorldId || 'forest',
      unlockedMissions,
      completedMissions,
      unlockedAnimals,
      unlockedStickers,
      unlockedDecorations,
      stars,
      learningProgress,
      unlockedLevels: unlockedMissions,
      completedLevels: completedMissions,
    };
  }

  static async completeMission(missionId: number, reward: MissionReward, skillsUsed: LearningSkill[] = []): Promise<Progress> {
    const current = await ProgressManager.getProgress();
    const nextMission = LevelManager.getNextMission(missionId);

    const newUnlocked = nextMission
      ? [...(current.unlockedMissions || []), nextMission.id]
      : current.unlockedMissions || [];

    const newCompleted = [...(current.completedMissions || []), missionId];

    const newAnimals = reward.animalId
      ? [...(current.unlockedAnimals || []), reward.animalId]
      : current.unlockedAnimals || [];

    const newStickers = reward.stickerId
      ? [...current.unlockedStickers, reward.stickerId]
      : current.unlockedStickers;

    const newDecorations = reward.decorationId
      ? [...(current.unlockedDecorations || []), reward.decorationId]
      : current.unlockedDecorations || [];

    const newStars = { ...(current.stars || {}), [missionId]: Math.max((current.stars || {})[missionId] || 0, reward.stars) };

    const newLearning = { ...(current.learningProgress || {}) };
    for (const skill of skillsUsed) {
      newLearning[skill] = (newLearning[skill] || 0) + 1;
    }

    return ProgressManager.saveProgress({
      ...current,
      unlockedMissions: newUnlocked,
      completedMissions: newCompleted,
      unlockedAnimals: newAnimals,
      unlockedStickers: newStickers,
      unlockedDecorations: newDecorations,
      stars: newStars,
      learningProgress: newLearning,
    });
  }

  /**
   * Compatibility method for legacy completeLevel calls
   */
  static async completeLevel(levelId: number): Promise<Progress> {
    const mission = LevelManager.getMissionById(levelId);
    if (mission) {
      return ProgressManager.completeMission(levelId, mission.reward, ['causeEffect', 'matching']);
    }
    // Fallback if legacy level data is queried
    const lvl = LevelManager.getLevelById(levelId);
    const reward: MissionReward = {
      stickerId: lvl?.rewardStickerId || 'sticker_rabbit_01',
      animalId: lvl?.animalId,
      stars: 3,
    };
    return ProgressManager.completeMission(levelId, reward, ['matching']);
  }

  static async recordSkillProgress(skill: LearningSkill): Promise<void> {
    const current = await ProgressManager.getProgress();
    const newLearning = { ...(current.learningProgress || {}) };
    newLearning[skill] = (newLearning[skill] || 0) + 1;
    await setPreference(keys.learningProgress, JSON.stringify(newLearning));
    emit('progress-changed');
  }

  static async resetProgress(): Promise<Progress> {
    await Promise.all([
      removePreference(keys.unlockedLevels),
      removePreference(keys.completedLevels),
      removePreference(keys.unlockedStickers),
      removePreference(keys.unlockedMissions),
      removePreference(keys.completedMissions),
      removePreference(keys.unlockedAnimals),
      removePreference(keys.unlockedDecorations),
      removePreference(keys.stars),
      removePreference(keys.learningProgress),
      setPreference(keys.version, '2'),
      setPreference(keys.currentWorld, 'forest'),
      setPreference(keys.unlockedMissions, JSON.stringify([1])),
      setPreference(keys.completedMissions, JSON.stringify([])),
    ]);

    emit('progress-changed');
    return ProgressManager.defaultProgress;
  }

  static async getSettings(): Promise<Settings> {
    const [soundRaw, languageRaw, ageModeRaw] = await Promise.all([
      getPreference(keys.sound),
      getPreference(keys.language),
      getPreference(keys.ageMode),
    ]);

    return {
      sound: soundRaw === null ? true : soundRaw === 'true',
      language: languageRaw === 'en' ? 'en' : 'vi',
      ageMode: ageModeRaw === '3-4' || ageModeRaw === '5-6' ? ageModeRaw : '1-2',
    };
  }

  static async saveSettings(settings: Settings): Promise<Settings> {
    const normalized: Settings = {
      sound: Boolean(settings.sound),
      language: settings.language === 'en' ? 'en' : 'vi',
      ageMode: settings.ageMode,
    };

    await Promise.all([
      setPreference(keys.sound, String(normalized.sound)),
      setPreference(keys.language, normalized.language),
      setPreference(keys.ageMode, normalized.ageMode),
    ]);

    emit('settings-changed');
    return normalized;
  }
}
