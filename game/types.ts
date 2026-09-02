export type PuzzleType =
  | 'choose_path'
  | 'choose_food'
  | 'choose_bridge'
  | 'choose_color_home';

export type AgeMode = '1-2' | '3-4' | '5-6';

export type Language = 'vi' | 'en';

export type LocalizedText = {
  vi: string;
  en: string;
};

export type LearningSkill =
  | 'color'
  | 'counting'
  | 'matching'
  | 'animalRecognition'
  | 'observation'
  | 'causeEffect'
  | 'fineMotor'
  | 'shape'
  | 'pattern';

export type LevelOption = {
  id: string;
  label: string;
  assetKey: string;
  isCorrect: boolean;
  position: { x: number; y: number };
};

export type StoryConfig = {
  introText: LocalizedText;
  introAudio?: string;
  successText: LocalizedText;
  successAudio?: string;
};

export type ChooseChallengeConfig = {
  id: string;
  mechanic: 'choose';
  skills: LearningSkill[];
  prompt: LocalizedText;
  instructionAudio?: string;
  targetAssetKey?: string;
  options: Array<{
    id: string;
    label: string;
    assetKey: string;
    isCorrect: boolean;
    position?: { x: number; y: number };
  }>;
};

export type DragDropChallengeConfig = {
  id: string;
  mechanic: 'drag_drop';
  skills: LearningSkill[];
  prompt: LocalizedText;
  instructionAudio?: string;
  draggable: {
    id: string;
    label: string;
    assetKey: string;
    startPos: { x: number; y: number };
  };
  target: {
    id: string;
    label: string;
    assetKey: string;
    targetPos: { x: number; y: number };
    radius?: number;
  };
};

export type FindObjectChallengeConfig = {
  id: string;
  mechanic: 'find_object';
  skills: LearningSkill[];
  prompt: LocalizedText;
  instructionAudio?: string;
  targets: Array<{
    id: string;
    label: string;
    assetKey: string;
    position: { x: number; y: number };
    isTarget: boolean;
  }>;
};

export type CountingChallengeConfig = {
  id: string;
  mechanic: 'counting';
  skills: LearningSkill[];
  prompt: LocalizedText;
  instructionAudio?: string;
  itemAssetKey: string;
  count: number;
  options: Array<{
    value: number;
    label: string;
    isCorrect: boolean;
  }>;
};

export type ChallengeConfig =
  | ChooseChallengeConfig
  | DragDropChallengeConfig
  | FindObjectChallengeConfig
  | CountingChallengeConfig;

export type MissionReward = {
  stickerId: string;
  animalId?: string;
  decorationId?: string;
  stars: number;
};

export type MissionConfig = {
  id: number;
  worldId: string;
  title: LocalizedText;
  animalId: string;
  backgroundKey: string;
  story: StoryConfig;
  challenges: ChallengeConfig[];
  reward: MissionReward;
  map: {
    x: number;
    y: number;
    chapter?: number;
  };
};

export type WorldConfig = {
  id: string;
  name: LocalizedText;
  theme: string;
  status: 'active' | 'coming_soon';
  missionCount: number;
  icon: string;
  description: LocalizedText;
};

export type DecorationData = {
  id: string;
  name: LocalizedText;
  assetKey: string;
  worldId: string;
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
  personalityVi?: string;
  personalityEn?: string;
  funFactVi?: string;
  funFactEn?: string;
};

export type StickerData = {
  id: string;
  name: string;
  category: 'animals' | 'trees' | 'flowers' | 'houses' | 'bridges' | 'food';
  assetKey: string;
  factVi?: string;
  factEn?: string;
};

export type Progress = {
  version?: number;
  currentWorldId?: string;
  unlockedLevels: number[];
  completedLevels: number[];
  unlockedStickers: string[];
  unlockedMissions?: number[];
  completedMissions?: number[];
  unlockedAnimals?: string[];
  unlockedDecorations?: string[];
  stars?: Record<number, number>;
  learningProgress?: Record<string, number>;
  discoveries?: string[];
};

export type Settings = {
  sound: boolean;
  language: Language;
  ageMode: AgeMode;
};

export type LevelSceneInitData = {
  levelId: number;
};
