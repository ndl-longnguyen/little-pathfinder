import { LevelManager } from './LevelManager';
import type { Progress, Settings } from '../types';

type PreferenceValue = string | null;

const keys = {
  unlockedLevels: 'unlocked_levels',
  completedLevels: 'completed_levels',
  unlockedStickers: 'unlocked_stickers',
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
    // The web fallback below keeps the MVP runnable before native plugins load.
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
    // The web fallback below keeps the MVP runnable before native plugins load.
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
    // The web fallback below keeps the MVP runnable before native plugins load.
  }

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
}

function parseNumberList(value: PreferenceValue, fallback: number[]) {
  if (!value) {
    return fallback;
  }

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

function parseStringList(value: PreferenceValue, fallback: string[]) {
  if (!value) {
    return fallback;
  }

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

function emit(name: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(name));
  }
}

export class ProgressManager {
  static defaultProgress: Progress = {
    unlockedLevels: [1],
    completedLevels: [],
    unlockedStickers: [],
  };

  static defaultSettings: Settings = {
    sound: true,
    language: 'vi',
    ageMode: '1-2',
  };

  static async getProgress(): Promise<Progress> {
    const [unlockedRaw, completedRaw, stickersRaw] = await Promise.all([
      getPreference(keys.unlockedLevels),
      getPreference(keys.completedLevels),
      getPreference(keys.unlockedStickers),
    ]);

    const validLevelIds = new Set(LevelManager.getLevels().map((level) => level.id));
    const validStickerIds = new Set(LevelManager.getStickers().map((sticker) => sticker.id));
    const unlockedLevels = parseNumberList(
      unlockedRaw,
      ProgressManager.defaultProgress.unlockedLevels,
    ).filter((id) => validLevelIds.has(id));
    const completedLevels = parseNumberList(completedRaw, []).filter((id) =>
      validLevelIds.has(id),
    );
    const unlockedStickers = parseStringList(stickersRaw, []).filter((id) =>
      validStickerIds.has(id),
    );

    return {
      unlockedLevels: unlockedLevels.length > 0 ? unlockedLevels : [1],
      completedLevels,
      unlockedStickers,
    };
  }

  static async saveProgress(progress: Progress) {
    const normalized: Progress = {
      unlockedLevels: [...new Set(progress.unlockedLevels)].sort((a, b) => a - b),
      completedLevels: [...new Set(progress.completedLevels)].sort((a, b) => a - b),
      unlockedStickers: [...new Set(progress.unlockedStickers)],
    };

    await Promise.all([
      setPreference(keys.unlockedLevels, JSON.stringify(normalized.unlockedLevels)),
      setPreference(keys.completedLevels, JSON.stringify(normalized.completedLevels)),
      setPreference(keys.unlockedStickers, JSON.stringify(normalized.unlockedStickers)),
    ]);
    emit('progress-changed');

    return normalized;
  }

  static async completeLevel(levelId: number) {
    const level = LevelManager.getLevelById(levelId);
    if (!level) {
      return ProgressManager.getProgress();
    }

    const progress = await ProgressManager.getProgress();
    const nextLevel = LevelManager.getNextLevel(level.id);

    return ProgressManager.saveProgress({
      unlockedLevels: nextLevel
        ? [...progress.unlockedLevels, nextLevel.id]
        : progress.unlockedLevels,
      completedLevels: [...progress.completedLevels, level.id],
      unlockedStickers: [...progress.unlockedStickers, level.rewardStickerId],
    });
  }

  static async resetProgress() {
    await Promise.all([
      removePreference(keys.unlockedLevels),
      removePreference(keys.completedLevels),
      removePreference(keys.unlockedStickers),
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

  static async saveSettings(settings: Settings) {
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
