export type PuzzleType =
  | 'choose_path'
  | 'choose_food'
  | 'choose_bridge'
  | 'choose_color_home';

export type AgeMode = '1-2' | '3-4' | '5-6';

export type Language = 'vi' | 'en';

export type LevelOption = {
  id: string;
  label: string;
  assetKey: string;
  isCorrect: boolean;
  position: { x: number; y: number };
};

export type LevelData = {
  id: number;
  worldId: string;
  title: string;
  ageMode: AgeMode;
  puzzleType: PuzzleType;
  animalId: string;
  backgroundKey: string;
  goalAssetKey: string;
  instructionAudio: string;
  successAudio: string;
  retryAudio: string;
  instructionTextVi: string;
  instructionTextEn: string;
  options: LevelOption[];
  rewardStickerId: string;
};

export type AnimalData = {
  id: string;
  nameVi: string;
  nameEn: string;
  assetKey: string;
  favoriteAssetKey: string;
};

export type StickerData = {
  id: string;
  name: string;
  category: 'animals' | 'trees' | 'flowers' | 'houses' | 'bridges' | 'food';
  assetKey: string;
};

export type Progress = {
  unlockedLevels: number[];
  completedLevels: number[];
  unlockedStickers: string[];
};

export type Settings = {
  sound: boolean;
  language: Language;
  ageMode: AgeMode;
};

export type LevelSceneInitData = {
  levelId: number;
};
