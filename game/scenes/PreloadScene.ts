import * as Phaser from 'phaser';
import stickersJson from '@/data/stickers.json';
import type { LevelSceneInitData, StickerData } from '../types';
import { GAME_HEIGHT, GAME_WIDTH } from '../systems/ResponsiveScale';

const stickers = stickersJson as StickerData[];

const animalKeys = [
  'rabbit',
  'duck',
  'bear',
  'monkey',
  'panda',
  'dolphin',
  'turtle',
  'octopus',
  'crab',
  'whale',
];

const backgroundKeys = [
  'bg_forest_01',
  'bg_river_01',
  'bg_mountain_01',
  'bg_farm_01',
  'bg_city_01',
  'bg_ocean_01',
  'bg_ocean_02',
  'bg_ocean_03',
];

const objectKeys = [
  'home_red',
  'home_blue',
  'home_green',
  'home_yellow',
  'home_brown',
  'home_coral_blue',
  'home_coral_red',
  'home_coral_reef',
  'carrot',
  'fish',
  'banana',
  'honey',
  'bamboo',
  'seaweed',
  'seashell',
  'pearl',
  'plastic_bottle',
  'trash_bin',
  'starfish',
  'bubble_shield',
  'bridge_wood',
  'bridge_stone',
  'bridge_rope',
  'boat',
  'path_flowers',
  'path_mud',
  'path_stones',
  'path_tree',
  'path_cave',
  'path_pond',
  'path_bamboo',
  'path_sand',
  'coral_pink',
  'coral_blue',
  'star_gold',
  'heart_pink',
];

export class PreloadScene extends Phaser.Scene {
  private levelId = 1;

  constructor() {
    super('PreloadScene');
  }

  init(data: LevelSceneInitData) {
    this.levelId = data.levelId;
  }

  create() {
    for (const key of backgroundKeys) {
      this.createBackground(key);
    }

    for (const key of animalKeys) {
      this.createAnimal(key);
    }

    for (const key of objectKeys) {
      this.createObject(key);
    }

    for (const sticker of stickers) {
      this.createSticker(sticker.assetKey);
    }

    this.scene.start('LevelScene', { levelId: this.levelId });
  }

  private createBackground(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const graphics = this.add.graphics();

    if (key.startsWith('bg_ocean_')) {
      this.drawOceanBackground(graphics, key);
    } else {
      this.drawLandBackground(graphics, key);
    }

    graphics.generateTexture(key, GAME_WIDTH, GAME_HEIGHT);
    graphics.destroy();
  }

  private drawLandBackground(graphics: Phaser.GameObjects.Graphics, key: string) {
    const sky = key === 'bg_river_01' ? 0x8ed1fc : key === 'bg_mountain_01' ? 0x9be2f7 : 0x78d2f7;
    const grass = key === 'bg_mountain_01' ? 0x8cc96b : 0x67c262;

    // Sky
    graphics.fillStyle(sky, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Warm Sun
    graphics.fillStyle(0xfff3a8, 0.4);
    graphics.fillCircle(140, 150, 100);
    graphics.fillStyle(0xffd34d, 1);
    graphics.fillCircle(140, 150, 68);

    // Fluffy Clouds
    graphics.fillStyle(0xffffff, 0.85);
    graphics.fillCircle(620, 130, 48);
    graphics.fillCircle(665, 120, 58);
    graphics.fillCircle(710, 130, 48);
    graphics.fillRoundedRect(600, 140, 130, 36, 18);

    graphics.fillCircle(300, 210, 36);
    graphics.fillCircle(335, 200, 44);
    graphics.fillCircle(370, 210, 36);
    graphics.fillRoundedRect(280, 220, 110, 28, 14);

    // Distant Hills
    graphics.fillStyle(0x4aa66b, 0.7);
    graphics.fillEllipse(680, 840, 780, 320);
    graphics.fillStyle(0x3e9658, 0.8);
    graphics.fillEllipse(220, 890, 720, 300);

    // Mountain peak if mountain bg
    if (key === 'bg_mountain_01') {
      graphics.fillStyle(0x648f76, 1);
      graphics.fillTriangle(220, 850, 450, 260, 700, 850);
      graphics.fillStyle(0xf1f8f5, 1);
      graphics.fillTriangle(450, 260, 380, 430, 520, 430);
    }

    // Main Foreground Grassy Hill
    graphics.fillStyle(grass, 1);
    graphics.fillRect(0, 920, GAME_WIDTH, 680);
    graphics.fillStyle(0x2f8051, 1);
    graphics.fillEllipse(180, 1120, 560, 240);
    graphics.fillEllipse(740, 1080, 640, 280);

    // River if river bg
    if (key === 'bg_river_01') {
      graphics.fillStyle(0x38a3e8, 1);
      graphics.fillRoundedRect(0, 1050, GAME_WIDTH, 210, 80);
      graphics.fillStyle(0xffffff, 0.6);
      graphics.fillRoundedRect(70, 1100, 240, 16, 8);
      graphics.fillRoundedRect(480, 1150, 280, 16, 8);
      graphics.fillRoundedRect(260, 1200, 200, 14, 7);
    }

    // Little Wildflowers on grass
    const flowerColors = [0xf472b6, 0xfacc15, 0xffffff, 0x60a5fa];
    const flowerPositions = [
      [90, 980],
      [140, 1020],
      [760, 960],
      [820, 1010],
      [420, 1340],
      [490, 1370],
      [120, 1420],
      [780, 1400],
    ];
    for (let i = 0; i < flowerPositions.length; i += 1) {
      const [fx, fy] = flowerPositions[i];
      const col = flowerColors[i % flowerColors.length];
      graphics.fillStyle(col, 0.95);
      graphics.fillCircle(fx, fy, 10);
      graphics.fillStyle(0xfde047, 1);
      graphics.fillCircle(fx, fy, 4);
    }
  }

  private drawOceanBackground(graphics: Phaser.GameObjects.Graphics, key: string) {
    // Gradient layers: from sunlit surface down to ocean floor
    if (key === 'bg_ocean_01') {
      graphics.fillStyle(0x38bdf8, 1); // Shallow sunlit aqua
      graphics.fillRect(0, 0, GAME_WIDTH, 450);
      graphics.fillStyle(0x0284c7, 1); // Mid azure
      graphics.fillRect(0, 450, GAME_WIDTH, 500);
      graphics.fillStyle(0x0369a1, 1); // Deep reef
      graphics.fillRect(0, 950, GAME_WIDTH, 650);
    } else if (key === 'bg_ocean_02') {
      graphics.fillStyle(0x0ea5e9, 1); // Mid aqua
      graphics.fillRect(0, 0, GAME_WIDTH, 450);
      graphics.fillStyle(0x0369a1, 1); // Sapphire
      graphics.fillRect(0, 450, GAME_WIDTH, 500);
      graphics.fillStyle(0x0c4a6e, 1); // Grotto deep
      graphics.fillRect(0, 950, GAME_WIDTH, 650);
    } else {
      graphics.fillStyle(0x0284c7, 1); // Deep royal blue
      graphics.fillRect(0, 0, GAME_WIDTH, 450);
      graphics.fillStyle(0x075985, 1); // Ocean abyss
      graphics.fillRect(0, 450, GAME_WIDTH, 500);
      graphics.fillStyle(0x0f172a, 1); // Midnight sea
      graphics.fillRect(0, 950, GAME_WIDTH, 650);
    }

    // Angled Sunbeams cutting through water
    graphics.fillStyle(0xffffff, 0.12);
    graphics.fillTriangle(100, 0, 360, 0, 520, 1100);
    graphics.fillTriangle(480, 0, 720, 0, 880, 1100);
    graphics.fillStyle(0xffffff, 0.08);
    graphics.fillTriangle(260, 0, 420, 0, 200, 1000);

    // Floating translucent bubbles
    const bubbleCoords = [
      [80, 240, 16],
      [120, 520, 22],
      [210, 380, 12],
      [310, 700, 18],
      [420, 300, 24],
      [560, 620, 14],
      [680, 440, 26],
      [740, 800, 18],
      [810, 280, 20],
      [160, 920, 16],
      [620, 960, 22],
      [840, 680, 14],
    ];
    for (const [bx, by, br] of bubbleCoords) {
      graphics.fillStyle(0xffffff, 0.25);
      graphics.fillCircle(bx, by, br);
      graphics.lineStyle(2, 0xffffff, 0.5);
      graphics.strokeCircle(bx, by, br);
      graphics.fillStyle(0xffffff, 0.7);
      graphics.fillCircle(bx - br * 0.3, by - br * 0.3, br * 0.28);
    }

    // Golden sandy seafloor dunes
    graphics.fillStyle(0xfde047, 1);
    graphics.fillRect(0, 1250, GAME_WIDTH, 350);
    graphics.fillStyle(0xfacc15, 1);
    graphics.fillEllipse(260, 1260, 640, 160);
    graphics.fillEllipse(700, 1280, 600, 180);
    graphics.fillStyle(0xeab308, 0.7);
    graphics.fillEllipse(450, 1380, 700, 140);

    // Colorful Coral Reefs along the bottom
    // Coral 1 (Left - Pink Antler)
    graphics.fillStyle(0xf43f5e, 0.95);
    graphics.fillRoundedRect(70, 1130, 28, 140, 14);
    graphics.fillRoundedRect(50, 1160, 70, 22, 11);
    graphics.fillRoundedRect(40, 1100, 24, 70, 12);
    graphics.fillRoundedRect(84, 1080, 26, 80, 13);

    // Coral 2 (Left - Seaweed forest)
    graphics.fillStyle(0x10b981, 0.9);
    graphics.fillEllipse(180, 1150, 36, 210);
    graphics.fillEllipse(215, 1170, 32, 170);
    graphics.fillStyle(0x059669, 0.9);
    graphics.fillEllipse(195, 1190, 30, 140);

    // Coral 3 (Right - Purple & Cyan fan)
    graphics.fillStyle(0xa855f7, 0.95);
    graphics.fillRoundedRect(760, 1140, 30, 130, 15);
    graphics.fillRoundedRect(730, 1170, 80, 22, 11);
    graphics.fillRoundedRect(720, 1110, 26, 70, 13);
    graphics.fillRoundedRect(785, 1090, 26, 80, 13);

    graphics.fillStyle(0x06b6d4, 0.9);
    graphics.fillEllipse(670, 1180, 32, 160);
    graphics.fillEllipse(700, 1195, 28, 130);

    // Decorative mini starfishes on sand
    graphics.fillStyle(0xf97316, 0.9);
    graphics.fillCircle(380, 1340, 12);
    graphics.fillCircle(380, 1324, 6);
    graphics.fillCircle(380, 1356, 6);
    graphics.fillCircle(364, 1340, 6);
    graphics.fillCircle(396, 1340, 6);

    graphics.fillStyle(0xec4899, 0.9);
    graphics.fillCircle(580, 1360, 10);
    graphics.fillCircle(580, 1346, 5);
    graphics.fillCircle(580, 1374, 5);
    graphics.fillCircle(566, 1360, 5);
    graphics.fillCircle(594, 1360, 5);
  }

  private createAnimal(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const animalEmojiMap: Record<string, string> = {
      rabbit: '🐰',
      duck: '🦆',
      bear: '🐻',
      monkey: '🐵',
      panda: '🐼',
      dolphin: '🐬',
      turtle: '🐢',
      octopus: '🐙',
      crab: '🦀',
      whale: '🐳',
    };

    const emoji = animalEmojiMap[key] ?? '🐾';
    const canvas = this.textures.createCanvas(key, 400, 320);
    if (canvas) {
      const ctx = canvas.getContext();

      // Soft circular glow background for the avatar
      const grad = ctx.createRadialGradient(200, 160, 20, 200, 160, 140);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.55)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(200, 160, 140, 0, Math.PI * 2);
      ctx.fill();

      // Shadow for emoji pop
      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 12;

      // Draw Giant, Beautiful Emoji
      ctx.font = '220px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 200, 168);

      canvas.refresh();
    }
  }

  private createObject(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const objectEmojiMap: Record<string, { emoji: string; bg?: string; borderColor?: string }> = {
      carrot: { emoji: '🥕' },
      fish: { emoji: '🐟' },
      banana: { emoji: '🍌' },
      honey: { emoji: '🍯' },
      bamboo: { emoji: '🎋' },
      seaweed: { emoji: '🌿' },
      seashell: { emoji: '🐚' },
      pearl: { emoji: '🦪' },
      plastic_bottle: { emoji: '🧴' },
      trash_bin: { emoji: '🗑️' },
      starfish: { emoji: '⭐' },
      bubble_shield: { emoji: '🫧' },
      boat: { emoji: '⛵' },
      bridge_wood: { emoji: '🪵' },
      bridge_stone: { emoji: '🪨' },
      bridge_rope: { emoji: '🪢' },
      star_gold: { emoji: '⭐' },
      heart_pink: { emoji: '💖' },

      // Color homes with clear thematic backgrounds for color-matching puzzles
      home_red: { emoji: '🏠', bg: '#fee2e2', borderColor: '#ef4444' },
      home_blue: { emoji: '🏠', bg: '#e0f2fe', borderColor: '#0284c7' },
      home_green: { emoji: '🏡', bg: '#dcfce7', borderColor: '#16a34a' },
      home_yellow: { emoji: '🏰', bg: '#fef9c3', borderColor: '#eab308' },
      home_brown: { emoji: '🛖', bg: '#fef3c7', borderColor: '#b45309' },
      home_coral_red: { emoji: '🪸', bg: '#ffe4e6', borderColor: '#f43f5e' },
      home_coral_blue: { emoji: '🪸', bg: '#e0f2fe', borderColor: '#0ea5e9' },
      home_coral_reef: { emoji: '🏰', bg: '#f3e8ff', borderColor: '#a855f7' },

      // Path objects
      path_flowers: { emoji: '🌸' },
      path_mud: { emoji: '🍂' },
      path_stones: { emoji: '🪨' },
      path_tree: { emoji: '🌲' },
      path_cave: { emoji: '⛰️' },
      path_pond: { emoji: '💧' },
      path_bamboo: { emoji: '🎍' },
      path_sand: { emoji: '🏖️' },
      coral_pink: { emoji: '🪸' },
      coral_blue: { emoji: '🪸' },
    };

    const item = objectEmojiMap[key] ?? { emoji: '✨' };
    const canvas = this.textures.createCanvas(key, 320, 280);
    if (canvas) {
      const ctx = canvas.getContext();

      // If it has a colored background card (e.g. colored houses for color-matching missions)
      if (item.bg) {
        ctx.fillStyle = item.bg;
        ctx.beginPath();
        // Standard round rect
        const x = 32;
        const y = 20;
        const w = 256;
        const h = 240;
        const r = 36;
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        ctx.lineWidth = 8;
        ctx.strokeStyle = item.borderColor ?? '#236b4c';
        ctx.stroke();

        // Inner glowing white circle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(160, 140, 85, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Soft round translucent glow backing for standalone items
        const grad = ctx.createRadialGradient(160, 140, 15, 160, 140, 110);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
        grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(160, 140, 110, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shadow for emoji pop
      ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 8;

      // Draw Giant, Crisp Emoji
      const fontSize = item.bg ? 160 : 190;
      ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.emoji, 160, 142);

      canvas.refresh();
    }
  }

  private createSticker(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const stickerEmojiMap: Record<string, string> = {
      sticker_rabbit_01: '🐰',
      sticker_carrot_01: '🥕',
      sticker_duck_01: '🦆',
      sticker_banana_01: '🍌',
      sticker_bridge_01: '🌉',
      sticker_blue_home_01: '🏠',
      sticker_bamboo_01: '🎋',
      sticker_flower_path_01: '🌸',
      sticker_tree_path_01: '🌲',
      sticker_honey_01: '🍯',
      sticker_green_home_01: '🏡',
      sticker_fish_01: '🐟',
      sticker_wood_bridge_01: '🪵',
      sticker_yellow_home_01: '🏰',
      sticker_cave_path_01: '🪨',
      sticker_panda_bridge_01: '🐼',
      sticker_pond_path_01: '💧',
      sticker_rope_bridge_01: '🪢',
      sticker_bamboo_path_01: '🎍',
      sticker_brown_home_01: '🛖',
      sticker_dolphin_01: '🐬',
      sticker_turtle_01: '🐢',
      sticker_octopus_01: '🐙',
      sticker_crab_01: '🦀',
      sticker_whale_01: '🐋',
      sticker_seashell_01: '🐚',
    };

    const emoji = stickerEmojiMap[key] ?? '⭐';
    const canvas = this.textures.createCanvas(key, 240, 240);
    if (canvas) {
      const ctx = canvas.getContext();

      // Outer Golden Circle
      ctx.fillStyle = '#ffd36a';
      ctx.beginPath();
      ctx.arc(120, 120, 106, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#c9812f';
      ctx.stroke();

      // Inner White Badge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(120, 120, 86, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(106, 81, 62, 0.2)';
      ctx.stroke();

      // Giant crisp emoji inside sticker badge
      ctx.font = '106px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 120, 126);

      canvas.refresh();
    }
  }
}
