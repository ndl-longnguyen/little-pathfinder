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

    const graphics = this.add.graphics();

    if (key === 'rabbit') {
      this.drawRabbit(graphics);
    } else if (key === 'duck') {
      this.drawDuck(graphics);
    } else if (key === 'bear') {
      this.drawBear(graphics);
    } else if (key === 'monkey') {
      this.drawMonkey(graphics);
    } else if (key === 'panda') {
      this.drawPanda(graphics);
    } else if (key === 'dolphin') {
      this.drawDolphin(graphics);
    } else if (key === 'turtle') {
      this.drawTurtle(graphics);
    } else if (key === 'octopus') {
      this.drawOctopus(graphics);
    } else if (key === 'crab') {
      this.drawCrab(graphics);
    } else if (key === 'whale') {
      this.drawWhale(graphics);
    }

    graphics.generateTexture(key, 400, 320);
    graphics.destroy();
  }

  private drawKawaiiEyes(
    graphics: Phaser.GameObjects.Graphics,
    lx: number,
    ly: number,
    rx: number,
    ry: number,
    r: number = 15,
  ) {
    // Sclera white rim for extra pop
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(lx, ly, r + 2);
    graphics.fillCircle(rx, ry, r + 2);
    graphics.lineStyle(2, 0x0f172a, 0.4);
    graphics.strokeCircle(lx, ly, r + 2);
    graphics.strokeCircle(rx, ry, r + 2);

    // Deep slate/black iris
    graphics.fillStyle(0x0f172a, 1);
    graphics.fillCircle(lx, ly, r);
    graphics.fillCircle(rx, ry, r);

    // Large glossy top-left glint
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(lx - r * 0.3, ly - r * 0.3, r * 0.46);
    graphics.fillCircle(rx - r * 0.3, ry - r * 0.3, r * 0.46);

    // Medium bottom-right glint
    graphics.fillCircle(lx + r * 0.32, ly + r * 0.32, r * 0.22);
    graphics.fillCircle(rx + r * 0.32, ry + r * 0.32, r * 0.22);

    // Subtle side glint
    graphics.fillCircle(lx - r * 0.35, ly + r * 0.2, r * 0.12);
    graphics.fillCircle(rx - r * 0.35, ry + r * 0.2, r * 0.12);
  }

  private drawCheeks(
    graphics: Phaser.GameObjects.Graphics,
    lx: number,
    ly: number,
    rx: number,
    ry: number,
    w: number = 32,
    h: number = 20,
  ) {
    // Soft blush halo
    graphics.fillStyle(0xf472b6, 0.55);
    graphics.fillEllipse(lx, ly, w, h);
    graphics.fillEllipse(rx, ry, w, h);

    // Cute inner glow
    graphics.fillStyle(0xfb7185, 0.35);
    graphics.fillEllipse(lx, ly, w * 0.55, h * 0.55);
    graphics.fillEllipse(rx, ry, w * 0.55, h * 0.55);
  }

  private drawRabbit(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x5b3e2b, 1);

    // Fluffy cotton-tail on side
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(86, 226, 24);
    graphics.strokeCircle(86, 226, 24);
    graphics.fillStyle(0xf1f5f9, 1);
    graphics.fillCircle(84, 224, 14);

    // Chubby Pear-shaped Body (sitting down)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillEllipse(200, 218, 195, 140);
    graphics.strokeEllipse(200, 218, 195, 140);

    // Soft pinkish-white tummy patch
    graphics.fillStyle(0xfdf2f8, 1);
    graphics.fillEllipse(200, 225, 125, 96);

    // Cute hind feet with pink toe pads at bottom
    // Left foot
    graphics.fillStyle(0xffffff, 1);
    graphics.fillEllipse(128, 275, 68, 38);
    graphics.strokeEllipse(128, 275, 68, 38);
    graphics.fillStyle(0xf9a8d4, 1);
    graphics.fillEllipse(128, 275, 34, 18);
    graphics.fillCircle(110, 265, 6);
    graphics.fillCircle(122, 260, 6);
    graphics.fillCircle(134, 262, 6);

    // Right foot
    graphics.fillStyle(0xffffff, 1);
    graphics.fillEllipse(272, 275, 68, 38);
    graphics.strokeEllipse(272, 275, 68, 38);
    graphics.fillStyle(0xf9a8d4, 1);
    graphics.fillEllipse(272, 275, 34, 18);
    graphics.fillCircle(254, 262, 6);
    graphics.fillCircle(266, 260, 6);
    graphics.fillCircle(278, 265, 6);

    // Big Chubby Head
    graphics.fillStyle(0xffffff, 1);
    graphics.fillEllipse(200, 142, 224, 178);
    graphics.strokeEllipse(200, 142, 224, 178);

    // Soft Cheek Fur Tufts
    graphics.fillTriangle(84, 140, 94, 125, 94, 155);
    graphics.fillTriangle(316, 140, 306, 125, 306, 155);

    // Long perky ears with inner gradient pink
    // Left ear (perky)
    graphics.fillEllipse(140, 52, 48, 118);
    graphics.strokeEllipse(140, 52, 48, 118);
    graphics.fillStyle(0xf9a8d4, 1);
    graphics.fillEllipse(140, 56, 25, 82);

    // Right ear (cute slight whimsical tilt)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillEllipse(262, 54, 48, 118);
    graphics.strokeEllipse(262, 54, 48, 118);
    graphics.fillStyle(0xf9a8d4, 1);
    graphics.fillEllipse(262, 58, 25, 82);

    // Sweet Flower hairpin on right ear
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillCircle(282, 98, 13);
    graphics.fillStyle(0xfde047, 1);
    graphics.fillCircle(282, 98, 5.5);

    // Kawaii Sparkling Eyes & Rosy Cheeks
    this.drawKawaiiEyes(graphics, 155, 128, 245, 128, 14);
    this.drawCheeks(graphics, 120, 156, 280, 156, 32, 20);

    // Cute pink heart-shaped nose
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillTriangle(190, 152, 210, 152, 200, 164);

    // Open happy smiling mouth with pink tongue and buck teeth
    graphics.fillStyle(0x1e293b, 1);
    graphics.beginPath();
    graphics.arc(200, 175, 16, 0, Math.PI, false);
    graphics.fillPath();

    // Sweet pink tongue
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillCircle(200, 186, 8.5);

    // Two cute white buck teeth
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRoundedRect(194, 168, 12, 8, 3);
    graphics.lineStyle(1.5, 0x1e293b, 1);
    graphics.lineBetween(200, 168, 200, 176);

    // Whiskers
    graphics.lineStyle(3, 0xa8a29e, 0.9);
    graphics.lineBetween(106, 148, 132, 154);
    graphics.lineBetween(104, 162, 132, 162);
    graphics.lineBetween(294, 154, 268, 148);
    graphics.lineBetween(296, 162, 268, 162);

    // Two little front paws hugging tummy
    graphics.fillStyle(0xffffff, 1);
    graphics.lineStyle(5, 0x5b3e2b, 1);
    graphics.fillCircle(172, 198, 18);
    graphics.strokeCircle(172, 198, 18);
    graphics.fillCircle(228, 198, 18);
    graphics.strokeCircle(228, 198, 18);
  }

  private drawDuck(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0xd97706, 1);

    // Water ripple at bottom
    graphics.lineStyle(5, 0x38bdf8, 0.85);
    graphics.beginPath();
    graphics.arc(195, 275, 125, 0.25, Math.PI - 0.25, false);
    graphics.strokePath();
    graphics.lineStyle(3, 0x7dd3fc, 0.6);
    graphics.beginPath();
    graphics.arc(195, 288, 90, 0.3, Math.PI - 0.3, false);
    graphics.strokePath();

    // Two cute orange webbed waddling feet
    graphics.fillStyle(0xf97316, 1);
    graphics.lineStyle(5, 0xc2410c, 1);
    graphics.fillRoundedRect(138, 262, 46, 22, 9);
    graphics.strokeRoundedRect(138, 262, 46, 22, 9);
    graphics.fillRoundedRect(208, 262, 46, 22, 9);
    graphics.strokeRoundedRect(208, 262, 46, 22, 9);

    // Upturned cute tail feathers at rear
    graphics.fillStyle(0xfacc15, 1);
    graphics.lineStyle(7, 0xd97706, 1);
    graphics.fillTriangle(68, 172, 118, 155, 108, 208);
    graphics.strokeTriangle(68, 172, 118, 155, 108, 208);
    graphics.fillTriangle(58, 182, 105, 170, 95, 218);
    graphics.strokeTriangle(58, 182, 105, 170, 95, 218);

    // Chubby sunny yellow body
    graphics.fillStyle(0xfacc15, 1);
    graphics.fillEllipse(185, 192, 215, 160);
    graphics.strokeEllipse(185, 192, 215, 160);

    // Fluffy Layered Wing with feather scallops
    graphics.fillStyle(0xfde047, 1);
    graphics.fillEllipse(145, 190, 116, 82);
    graphics.strokeEllipse(145, 190, 116, 82);
    graphics.lineStyle(4, 0xd97706, 0.7);
    graphics.beginPath();
    graphics.arc(148, 190, 24, 0.2, Math.PI - 0.2, false);
    graphics.arc(172, 192, 22, 0.2, Math.PI - 0.2, false);
    graphics.strokePath();

    // Round head
    graphics.fillStyle(0xfde047, 1);
    graphics.lineStyle(7, 0xd97706, 1);
    graphics.fillEllipse(262, 125, 134, 118);
    graphics.strokeEllipse(262, 125, 134, 118);

    // Feather head tuft (3 bouncing crest feathers)
    graphics.fillStyle(0xfacc15, 1);
    graphics.fillCircle(254, 62, 16);
    graphics.strokeCircle(254, 62, 16);
    graphics.fillCircle(268, 56, 14);
    graphics.strokeCircle(268, 56, 14);
    graphics.fillCircle(282, 64, 12);
    graphics.strokeCircle(282, 64, 12);

    // Cute green leaf accessory on head tuft
    graphics.fillStyle(0x22c55e, 1);
    graphics.fillEllipse(270, 74, 22, 11);

    // Kawaii Eye & Rosy Cheek
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(282, 112, 16);
    graphics.lineStyle(2, 0x0f172a, 0.4);
    graphics.strokeCircle(282, 112, 16);

    graphics.fillStyle(0x0f172a, 1);
    graphics.fillCircle(282, 112, 13.5);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(278, 107, 6.2);
    graphics.fillCircle(286, 117, 3);
    graphics.fillCircle(276, 116, 1.8);

    graphics.fillStyle(0xfb7185, 0.65);
    graphics.fillEllipse(252, 138, 28, 18);

    // Glossy smiling orange bill with open smile & tongue
    graphics.fillStyle(0xf97316, 1);
    graphics.lineStyle(6, 0xc2410c, 1);
    graphics.fillRoundedRect(316, 120, 72, 38, 18);
    graphics.strokeRoundedRect(316, 120, 72, 38, 18);

    // Mouth smile crease & cute nostril
    graphics.fillStyle(0x9a3412, 1);
    graphics.fillCircle(338, 130, 3.5);

    // Sweet open tongue
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillCircle(358, 142, 6);
  }

  private drawBear(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x5b2909, 1);

    // Big cuddly teddy bear body
    graphics.fillStyle(0x92400e, 1);
    graphics.fillEllipse(200, 220, 215, 150);
    graphics.strokeEllipse(200, 220, 215, 150);

    // Honey-cream tummy bib with sweet heart emblem
    graphics.fillStyle(0xfef3c7, 1);
    graphics.fillEllipse(200, 226, 132, 106);
    graphics.fillStyle(0xfde68a, 1);
    graphics.fillCircle(200, 225, 20);

    // Round paws with honey-tan toe beans at bottom
    // Left foot
    graphics.fillStyle(0x92400e, 1);
    graphics.fillEllipse(120, 276, 72, 42);
    graphics.strokeEllipse(120, 276, 72, 42);
    graphics.fillStyle(0xfde68a, 1);
    graphics.fillEllipse(120, 276, 36, 22);
    graphics.fillCircle(102, 264, 6.5);
    graphics.fillCircle(116, 258, 6.5);
    graphics.fillCircle(130, 260, 6.5);

    // Right foot
    graphics.fillStyle(0x92400e, 1);
    graphics.fillEllipse(280, 276, 72, 42);
    graphics.strokeEllipse(280, 276, 72, 42);
    graphics.fillStyle(0xfde68a, 1);
    graphics.fillEllipse(280, 276, 36, 22);
    graphics.fillCircle(262, 260, 6.5);
    graphics.fillCircle(276, 258, 6.5);
    graphics.fillCircle(290, 264, 6.5);

    // Left arm waving hello warmly!
    graphics.fillStyle(0x92400e, 1);
    graphics.fillEllipse(96, 175, 52, 76);
    graphics.strokeEllipse(96, 175, 52, 76);
    graphics.fillStyle(0xfde68a, 1);
    graphics.fillCircle(85, 160, 16);

    // Right arm resting gently
    graphics.fillStyle(0x92400e, 1);
    graphics.fillEllipse(300, 206, 52, 76);
    graphics.strokeEllipse(300, 206, 52, 76);

    // Big Head
    graphics.fillStyle(0x92400e, 1);
    graphics.fillEllipse(200, 135, 230, 176);
    graphics.strokeEllipse(200, 135, 230, 176);

    // Fluffy fur cheeks
    graphics.fillTriangle(84, 135, 94, 120, 94, 150);
    graphics.fillTriangle(316, 135, 306, 120, 306, 150);

    // Round teddy ears
    graphics.fillCircle(108, 58, 46);
    graphics.strokeCircle(108, 58, 46);
    graphics.fillCircle(292, 58, 46);
    graphics.strokeCircle(292, 58, 46);

    // Honey-cream inner ears
    graphics.fillStyle(0xfde68a, 1);
    graphics.fillCircle(108, 58, 25);
    graphics.fillCircle(292, 58, 25);

    // Cute little honeybee on left ear
    graphics.fillStyle(0xfde047, 1);
    graphics.fillEllipse(100, 40, 18, 13);
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(108, 40, 4);
    graphics.fillStyle(0xffffff, 0.85);
    graphics.fillEllipse(96, 32, 10, 6);

    // Cream muzzle
    graphics.fillStyle(0xfef3c7, 1);
    graphics.fillEllipse(200, 152, 120, 84);

    // Glossy chocolate button nose with bright highlight
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillEllipse(200, 136, 36, 24);
    graphics.fillStyle(0xffffff, 0.85);
    graphics.fillCircle(195, 132, 5.5);

    // Open joyful smile with tongue
    graphics.fillStyle(0x1e293b, 1);
    graphics.beginPath();
    graphics.arc(200, 158, 16, 0.1, Math.PI - 0.1, false);
    graphics.fillPath();
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillCircle(200, 168, 8.5);

    // Kawaii eyes & Rosy cheeks
    this.drawKawaiiEyes(graphics, 152, 116, 248, 116, 14);
    this.drawCheeks(graphics, 118, 146, 282, 146, 32, 20);
  }

  private drawMonkey(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x451a03, 1);

    // Long Playful Curly Spiral Tail sweeping behind
    graphics.lineStyle(14, 0x78350f, 1);
    graphics.beginPath();
    graphics.arc(75, 195, 52, 0.4, Math.PI * 1.85, false);
    graphics.strokePath();
    graphics.fillStyle(0x78350f, 1);
    graphics.fillCircle(62, 148, 11);

    // Body
    graphics.fillStyle(0x78350f, 1);
    graphics.lineStyle(7, 0x451a03, 1);
    graphics.fillEllipse(200, 222, 190, 142);
    graphics.strokeEllipse(200, 222, 190, 142);

    // Peach tummy patch
    graphics.fillStyle(0xffedd5, 1);
    graphics.fillEllipse(200, 226, 114, 92);

    // Cute feet at bottom with peach toes
    // Left foot
    graphics.fillStyle(0x78350f, 1);
    graphics.fillEllipse(138, 276, 62, 36);
    graphics.strokeEllipse(138, 276, 62, 36);
    graphics.fillStyle(0xfed7aa, 1);
    graphics.fillCircle(122, 268, 6);
    graphics.fillCircle(134, 264, 6);
    graphics.fillCircle(146, 266, 6);

    // Right foot
    graphics.fillStyle(0x78350f, 1);
    graphics.fillEllipse(262, 276, 62, 36);
    graphics.strokeEllipse(262, 276, 62, 36);
    graphics.fillStyle(0xfed7aa, 1);
    graphics.fillCircle(248, 266, 6);
    graphics.fillCircle(260, 264, 6);
    graphics.fillCircle(272, 268, 6);

    // Monkey holding sweet banana in hands
    graphics.fillStyle(0xfacc15, 1);
    graphics.lineStyle(4, 0xca8a04, 1);
    graphics.fillRoundedRect(215, 185, 48, 18, 9);
    graphics.strokeRoundedRect(215, 185, 48, 18, 9);
    graphics.fillStyle(0x713f12, 1);
    graphics.fillCircle(215, 194, 4);

    // Paws
    graphics.fillStyle(0x78350f, 1);
    graphics.lineStyle(5, 0x451a03, 1);
    graphics.fillCircle(168, 202, 18);
    graphics.strokeCircle(168, 202, 18);
    graphics.fillCircle(232, 202, 18);
    graphics.strokeCircle(232, 202, 18);

    // Big cupped ears
    graphics.lineStyle(7, 0x451a03, 1);
    graphics.fillCircle(92, 115, 42);
    graphics.strokeCircle(92, 115, 42);
    graphics.fillCircle(308, 115, 42);
    graphics.strokeCircle(308, 115, 42);

    graphics.fillStyle(0xfed7aa, 1);
    graphics.fillCircle(92, 115, 25);
    graphics.fillCircle(308, 115, 25);

    // Head
    graphics.fillStyle(0x78350f, 1);
    graphics.fillEllipse(200, 135, 218, 172);
    graphics.strokeEllipse(200, 135, 218, 172);

    // Cute hair curl + jungle leaf
    graphics.fillStyle(0x78350f, 1);
    graphics.fillCircle(200, 46, 17);
    graphics.strokeCircle(200, 46, 17);
    graphics.fillStyle(0x22c55e, 1);
    graphics.fillEllipse(218, 44, 22, 12);

    // Heart-shaped peach face mask
    graphics.fillStyle(0xffedd5, 1);
    graphics.fillCircle(164, 118, 48);
    graphics.fillCircle(236, 118, 48);
    graphics.fillEllipse(200, 155, 132, 92);

    // Kawaii eyes & Cheeks
    this.drawKawaiiEyes(graphics, 154, 114, 246, 114, 13.5);
    this.drawCheeks(graphics, 124, 145, 276, 145, 28, 18);

    // Tiny nostrils & big laughing open mouth
    graphics.fillStyle(0x78350f, 1);
    graphics.fillCircle(195, 142, 4);
    graphics.fillCircle(205, 142, 4);

    graphics.fillStyle(0x1e293b, 1);
    graphics.beginPath();
    graphics.arc(200, 162, 20, 0, Math.PI, false);
    graphics.fillPath();

    // Sweet pink tongue
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillCircle(200, 176, 10.5);
  }

  private drawPanda(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x1e293b, 1);

    // Dumpling White Body
    graphics.fillStyle(0xffffff, 1);
    graphics.fillEllipse(200, 224, 205, 146);
    graphics.strokeEllipse(200, 224, 205, 146);

    // Classic black shoulder vest
    graphics.fillStyle(0x0f172a, 1);
    graphics.fillRoundedRect(95, 172, 210, 44, 20);

    // Feet with pink paw pads at bottom
    // Left foot
    graphics.fillEllipse(124, 278, 68, 40);
    graphics.fillStyle(0xf472b6, 1);
    graphics.fillEllipse(124, 278, 34, 20);
    graphics.fillCircle(106, 268, 6);
    graphics.fillCircle(118, 263, 6);
    graphics.fillCircle(130, 265, 6);

    // Right foot
    graphics.fillStyle(0x0f172a, 1);
    graphics.fillEllipse(276, 278, 68, 40);
    graphics.fillStyle(0xf472b6, 1);
    graphics.fillEllipse(276, 278, 34, 20);
    graphics.fillCircle(262, 265, 6);
    graphics.fillCircle(274, 263, 6);
    graphics.fillCircle(286, 268, 6);

    // Holding fresh bamboo stalk
    graphics.fillStyle(0x22c55e, 1);
    graphics.fillRoundedRect(76, 155, 18, 95, 9);
    graphics.fillEllipse(70, 150, 32, 15);
    graphics.fillEllipse(100, 165, 32, 15);
    graphics.fillEllipse(66, 195, 30, 14);

    // Chubby black paws holding the stalk
    graphics.fillStyle(0x0f172a, 1);
    graphics.fillCircle(92, 195, 18);
    graphics.fillCircle(150, 210, 18);

    // Big Chubby White Panda Head
    graphics.fillStyle(0xffffff, 1);
    graphics.lineStyle(7, 0x1e293b, 1);
    graphics.fillEllipse(200, 135, 234, 176);
    graphics.strokeEllipse(200, 135, 234, 176);

    // Fluffy cheek tufts
    graphics.fillTriangle(82, 135, 92, 120, 92, 150);
    graphics.fillTriangle(318, 135, 308, 120, 308, 150);

    // Round fuzzy black ears
    graphics.fillStyle(0x0f172a, 1);
    graphics.fillCircle(102, 56, 48);
    graphics.strokeCircle(102, 56, 48);
    graphics.fillCircle(298, 56, 48);
    graphics.strokeCircle(298, 56, 48);

    // Inner ear gray highlight
    graphics.fillStyle(0x334155, 1);
    graphics.fillCircle(102, 56, 24);
    graphics.fillCircle(298, 56, 24);

    // Cute red flower hairpin on left ear
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillCircle(96, 42, 13);
    graphics.fillStyle(0xfde047, 1);
    graphics.fillCircle(96, 42, 5.5);

    // Iconic tilted black eye patches
    graphics.fillStyle(0x0f172a, 1);
    graphics.fillEllipse(148, 124, 76, 58);
    graphics.fillEllipse(252, 124, 76, 58);

    // Ultra-kawaii anime eyes inside black patches
    this.drawKawaiiEyes(graphics, 150, 124, 250, 124, 15);

    // Rosy pink blush cheeks
    this.drawCheeks(graphics, 114, 156, 286, 156, 32, 20);

    // Black button nose & sweet cat-smile :3
    graphics.fillStyle(0x0f172a, 1);
    graphics.fillEllipse(200, 146, 28, 18);
    graphics.fillStyle(0xffffff, 0.85);
    graphics.fillCircle(196, 143, 4.5);

    // Sweet smile with tongue
    graphics.fillStyle(0x1e293b, 1);
    graphics.beginPath();
    graphics.arc(200, 164, 16, 0.1, Math.PI - 0.1, false);
    graphics.fillPath();
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillCircle(200, 174, 8.5);
  }
  private drawDolphin(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x0369a1, 1);

    // Tail Fluke
    graphics.fillStyle(0x0ea5e9, 1);
    graphics.fillTriangle(50, 150, 90, 205, 45, 235);
    graphics.strokeTriangle(50, 150, 90, 205, 45, 235);

    // Dorsal Fin
    graphics.fillTriangle(190, 70, 240, 130, 170, 130);
    graphics.strokeTriangle(190, 70, 240, 130, 170, 130);

    // Main leaping body (aqua turquoise)
    graphics.fillStyle(0x38bdf8, 1);
    graphics.fillEllipse(205, 175, 255, 170);
    graphics.strokeEllipse(205, 175, 255, 170);

    // Pearl-white belly curve
    graphics.fillStyle(0xf0fdfa, 1);
    graphics.fillEllipse(220, 210, 190, 95);

    // Pectoral flipper
    graphics.fillStyle(0x0284c7, 1);
    graphics.fillEllipse(220, 215, 65, 34);
    graphics.strokeEllipse(220, 215, 65, 34);

    // Snout / Beak
    graphics.fillStyle(0x38bdf8, 1);
    graphics.fillRoundedRect(310, 155, 68, 38, 18);
    graphics.strokeRoundedRect(310, 155, 68, 38, 18);

    // Cute smiling mouth
    graphics.lineStyle(5, 0x0369a1, 1);
    graphics.beginPath();
    graphics.arc(330, 170, 16, 0.2, Math.PI - 0.2, false);
    graphics.strokePath();

    // Kawaii Eye & Cheek
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(276, 142, 14);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(272, 138, 6);
    graphics.fillCircle(280, 146, 3);
    graphics.fillStyle(0xf472b6, 0.6);
    graphics.fillEllipse(252, 166, 28, 18);

    // Water bubbles from blowhole
    graphics.fillStyle(0xbae6fd, 0.8);
    graphics.fillCircle(240, 75, 12);
    graphics.fillCircle(256, 52, 9);
    graphics.fillCircle(270, 36, 6);
  }

  private drawTurtle(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x064e3b, 1);

    // 4 Swimming Flippers
    graphics.fillStyle(0x10b981, 1);
    // Front paddles
    graphics.fillEllipse(150, 110, 80, 46);
    graphics.strokeEllipse(150, 110, 80, 46);
    graphics.fillEllipse(150, 240, 80, 46);
    graphics.strokeEllipse(150, 240, 80, 46);
    // Rear flippers
    graphics.fillEllipse(90, 140, 50, 34);
    graphics.strokeEllipse(90, 140, 50, 34);
    graphics.fillEllipse(90, 210, 50, 34);
    graphics.strokeEllipse(90, 210, 50, 34);

    // Domed Emerald Shell
    graphics.fillStyle(0x059669, 1);
    graphics.fillEllipse(185, 175, 210, 175);
    graphics.strokeEllipse(185, 175, 210, 175);

    // Lime hexagonal patterns on shell
    graphics.fillStyle(0x84cc16, 1);
    graphics.lineStyle(4, 0x064e3b, 0.8);
    graphics.fillCircle(185, 175, 34);
    graphics.strokeCircle(185, 175, 34);
    graphics.fillCircle(145, 145, 24);
    graphics.strokeCircle(145, 145, 24);
    graphics.fillCircle(225, 145, 24);
    graphics.strokeCircle(225, 145, 24);
    graphics.fillCircle(145, 205, 24);
    graphics.strokeCircle(145, 205, 24);
    graphics.fillCircle(225, 205, 24);
    graphics.strokeCircle(225, 205, 24);

    // Cheerful Head
    graphics.fillStyle(0x34d399, 1);
    graphics.lineStyle(7, 0x064e3b, 1);
    graphics.fillEllipse(295, 175, 110, 94);
    graphics.strokeEllipse(295, 175, 110, 94);

    // Kawaii Eye & Cheek
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(315, 160, 13);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(312, 156, 5);
    graphics.fillCircle(318, 164, 2.5);
    graphics.fillStyle(0xf472b6, 0.6);
    graphics.fillEllipse(295, 185, 26, 16);

    // Smiling mouth
    graphics.lineStyle(5, 0x064e3b, 1);
    graphics.beginPath();
    graphics.arc(326, 178, 14, 0.2, Math.PI - 0.2, false);
    graphics.strokePath();
  }

  private drawOctopus(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x6b21a8, 1);

    // 8 Curly Tentacles with suction cups
    graphics.fillStyle(0xa855f7, 1);
    const tentacleXs = [105, 135, 165, 195, 225, 255, 285];
    for (let i = 0; i < tentacleXs.length; i += 1) {
      const tx = tentacleXs[i];
      const ty = 230 + (i % 2 === 0 ? 20 : 5);
      graphics.fillRoundedRect(tx - 16, 200, 32, 70, 16);
      graphics.strokeRoundedRect(tx - 16, 200, 32, 70, 16);
      // Suction cup
      graphics.fillStyle(0xf472b6, 1);
      graphics.fillCircle(tx, ty, 8);
      graphics.fillStyle(0xa855f7, 1);
    }

    // Chubby Bulbous Head
    graphics.fillStyle(0xc084fc, 1);
    graphics.fillEllipse(200, 155, 220, 190);
    graphics.strokeEllipse(200, 155, 220, 190);

    // Kawaii Big Anime Eyes
    this.drawKawaiiEyes(graphics, 155, 145, 245, 145, 16);

    // Soft Blush Cheeks
    this.drawCheeks(graphics, 126, 180, 274, 180, 30, 20);

    // Open happy 'O' mouth
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(200, 182, 12);
    graphics.fillStyle(0xf43f5e, 1);
    graphics.fillCircle(200, 185, 7);

    // Tiny head bubble
    graphics.fillStyle(0xbae6fd, 0.7);
    graphics.fillCircle(250, 65, 12);
    graphics.fillCircle(265, 45, 8);
  }

  private drawCrab(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x991b1b, 1);

    // 4 Walking Legs
    graphics.fillStyle(0xf97316, 1);
    graphics.fillRoundedRect(100, 210, 24, 60, 12);
    graphics.strokeRoundedRect(100, 210, 24, 60, 12);
    graphics.fillRoundedRect(135, 225, 24, 55, 12);
    graphics.strokeRoundedRect(135, 225, 24, 55, 12);
    graphics.fillRoundedRect(240, 225, 24, 55, 12);
    graphics.strokeRoundedRect(240, 225, 24, 55, 12);
    graphics.fillRoundedRect(275, 210, 24, 60, 12);
    graphics.strokeRoundedRect(275, 210, 24, 60, 12);

    // Two big waving pincers
    graphics.fillStyle(0xef4444, 1);
    // Left claw
    graphics.fillEllipse(85, 105, 70, 70);
    graphics.strokeEllipse(85, 105, 70, 70);
    graphics.fillTriangle(60, 95, 105, 70, 90, 115);
    // Right claw
    graphics.fillEllipse(315, 105, 70, 70);
    graphics.strokeEllipse(315, 105, 70, 70);
    graphics.fillTriangle(340, 95, 295, 70, 310, 115);

    // Main red rounded carapace (body)
    graphics.fillStyle(0xf97316, 1);
    graphics.fillEllipse(200, 185, 210, 145);
    graphics.strokeEllipse(200, 185, 210, 145);

    // Periscope eyes on stalks
    graphics.fillStyle(0xf97316, 1);
    graphics.fillRoundedRect(154, 90, 18, 42, 9);
    graphics.strokeRoundedRect(154, 90, 18, 42, 9);
    graphics.fillRoundedRect(228, 90, 18, 42, 9);
    graphics.strokeRoundedRect(228, 90, 18, 42, 9);

    // White eye globes with huge black anime pupils
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(163, 90, 22);
    graphics.strokeCircle(163, 90, 22);
    graphics.fillCircle(237, 90, 22);
    graphics.strokeCircle(237, 90, 22);

    this.drawKawaiiEyes(graphics, 163, 90, 237, 90, 13);
    this.drawCheeks(graphics, 136, 182, 264, 182, 26, 16);

    // Broad friendly smile
    graphics.lineStyle(5, 0x1e293b, 1);
    graphics.beginPath();
    graphics.arc(200, 192, 20, 0.1, Math.PI - 0.1, false);
    graphics.strokePath();
  }

  private drawWhale(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0x075985, 1);

    // Tail fluke
    graphics.fillStyle(0x0284c7, 1);
    graphics.fillTriangle(50, 130, 95, 185, 45, 225);
    graphics.strokeTriangle(50, 130, 95, 185, 45, 225);

    // Main giant blue whale body
    graphics.fillStyle(0x0284c7, 1);
    graphics.fillEllipse(215, 175, 255, 170);
    graphics.strokeEllipse(215, 175, 255, 170);

    // Ribbed sky-blue belly
    graphics.fillStyle(0xbae6fd, 1);
    graphics.fillEllipse(230, 215, 195, 85);

    // Rib grooves on belly
    graphics.lineStyle(4, 0x38bdf8, 0.8);
    graphics.lineBetween(170, 220, 170, 250);
    graphics.lineBetween(205, 215, 205, 255);
    graphics.lineBetween(240, 215, 240, 255);
    graphics.lineBetween(275, 218, 275, 252);
    graphics.lineBetween(310, 222, 310, 248);

    // Pectoral flipper
    graphics.fillStyle(0x0369a1, 1);
    graphics.lineStyle(6, 0x075985, 1);
    graphics.fillEllipse(215, 215, 60, 32);
    graphics.strokeEllipse(215, 215, 60, 32);

    // Kawaii Eye & Rosy Cheek
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(285, 155, 13);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(281, 151, 5.5);
    graphics.fillCircle(288, 159, 2.5);
    graphics.fillStyle(0xf472b6, 0.6);
    graphics.fillEllipse(260, 180, 28, 18);

    // Joyful curved smile
    graphics.lineStyle(5, 0x075985, 1);
    graphics.beginPath();
    graphics.arc(295, 185, 22, 0.1, Math.PI - 0.2, false);
    graphics.strokePath();

    // High fountain spout with water droplets
    graphics.fillStyle(0x38bdf8, 0.85);
    graphics.fillRoundedRect(228, 55, 18, 55, 9);
    graphics.fillCircle(220, 48, 14);
    graphics.fillCircle(254, 48, 14);
    graphics.fillCircle(237, 30, 16);
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillCircle(205, 36, 8);
    graphics.fillCircle(270, 36, 8);
  }

  private createObject(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const graphics = this.add.graphics();
    graphics.lineStyle(7, 0x385241, 1);

    if (key.startsWith('home_')) {
      this.drawHomeObject(graphics, key);
    } else if (key === 'carrot') {
      this.drawCarrot(graphics);
    } else if (key === 'fish') {
      this.drawFish(graphics);
    } else if (key === 'banana') {
      this.drawBanana(graphics);
    } else if (key === 'honey') {
      this.drawHoney(graphics);
    } else if (key === 'bamboo') {
      this.drawBamboo(graphics);
    } else if (key === 'seaweed') {
      this.drawSeaweed(graphics);
    } else if (key === 'seashell') {
      this.drawSeashell(graphics);
    } else if (key === 'pearl') {
      this.drawPearl(graphics);
    } else if (key === 'plastic_bottle') {
      this.drawPlasticBottle(graphics);
    } else if (key === 'trash_bin') {
      this.drawTrashBin(graphics);
    } else if (key === 'starfish') {
      this.drawStarfish(graphics);
    } else if (key === 'bubble_shield') {
      this.drawBubbleShield(graphics);
    } else if (key === 'boat') {
      this.drawBoat(graphics);
    } else if (key.startsWith('bridge_')) {
      this.drawBridge(graphics, key);
    } else if (key === 'star_gold') {
      this.drawStarGold(graphics);
    } else if (key === 'heart_pink') {
      this.drawHeartPink(graphics);
    } else if (key === 'coral_pink' || key === 'coral_blue') {
      this.drawCoral(graphics, key);
    } else {
      this.drawPathObject(graphics, key);
    }

    graphics.generateTexture(key, 320, 280);
    graphics.destroy();
  }

  private drawHomeObject(graphics: Phaser.GameObjects.Graphics, key: string) {
    if (key === 'home_coral_blue' || key === 'home_coral_red' || key === 'home_coral_reef') {
      const isRed = key === 'home_coral_red';
      const isReef = key === 'home_coral_reef';
      const baseCol = isReef ? 0xc084fc : isRed ? 0xf43f5e : 0x0ea5e9;
      const roofCol = isReef ? 0xfacc15 : isRed ? 0xef4444 : 0x38bdf8;

      graphics.fillStyle(baseCol, 1);
      graphics.fillRoundedRect(60, 95, 200, 145, 24);
      graphics.lineStyle(7, 0x0c4a6e, 1);
      graphics.strokeRoundedRect(60, 95, 200, 145, 24);

      // Spires / Shell Dome Roof
      graphics.fillStyle(roofCol, 1);
      graphics.fillCircle(160, 85, 75);
      graphics.strokeCircle(160, 85, 75);

      // Coral Spire accents
      graphics.fillRoundedRect(95, 45, 24, 60, 12);
      graphics.fillRoundedRect(200, 45, 24, 60, 12);

      // Glowing Pearl Door
      graphics.fillStyle(0xfffbeb, 1);
      graphics.fillRoundedRect(132, 160, 56, 80, 16);
      graphics.fillStyle(0xfde047, 1);
      graphics.fillCircle(172, 200, 6);

      // Bubble Windows
      graphics.fillStyle(0xbae6fd, 0.9);
      graphics.fillCircle(100, 140, 20);
      graphics.fillCircle(220, 140, 20);
      return;
    }

    const fillByKey: Record<string, number> = {
      home_blue: 0x4f9cdf,
      home_brown: 0xb78155,
      home_green: 0x69bf75,
      home_red: 0xee7566,
      home_yellow: 0xffd36a,
    };
    graphics.fillStyle(fillByKey[key] ?? 0xee7566, 1);
    graphics.fillRoundedRect(54, 90, 172, 148, 16);
    graphics.strokeRoundedRect(54, 90, 172, 148, 16);

    graphics.fillStyle(0x914338, 1);
    graphics.fillTriangle(30, 98, 140, 18, 250, 98);
    graphics.strokeTriangle(30, 98, 140, 18, 250, 98);

    graphics.fillStyle(0xfff4db, 1);
    graphics.fillRoundedRect(122, 162, 44, 76, 8);
    graphics.fillStyle(0xffd36a, 1);
    graphics.fillCircle(154, 200, 4);

    // Cozy Window
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillRoundedRect(72, 122, 40, 40, 8);
    graphics.lineStyle(3, 0x914338, 1);
    graphics.lineBetween(92, 122, 92, 162);
    graphics.lineBetween(72, 142, 112, 142);
  }

  private drawCarrot(graphics: Phaser.GameObjects.Graphics) {
    // Green leaves
    graphics.fillStyle(0x22c55e, 1);
    graphics.fillTriangle(116, 72, 160, 16, 172, 94);
    graphics.fillTriangle(150, 72, 208, 16, 196, 94);
    graphics.fillTriangle(130, 60, 170, 8, 180, 80);

    // Orange carrot body
    graphics.fillStyle(0xf97316, 1);
    graphics.lineStyle(7, 0xc2410c, 1);
    graphics.fillTriangle(92, 86, 230, 94, 150, 248);
    graphics.strokeTriangle(92, 86, 230, 94, 150, 248);

    // Carrot stripes
    graphics.lineStyle(4, 0xea580c, 1);
    graphics.lineBetween(120, 130, 170, 130);
    graphics.lineBetween(130, 170, 165, 170);
    graphics.lineBetween(140, 205, 160, 205);
  }

  private drawFish(graphics: Phaser.GameObjects.Graphics) {
    // Fish tail
    graphics.fillStyle(0x0284c7, 1);
    graphics.lineStyle(6, 0x0369a1, 1);
    graphics.fillTriangle(215, 140, 290, 85, 290, 195);
    graphics.strokeTriangle(215, 140, 290, 85, 290, 195);

    // Fish body
    graphics.fillStyle(0x38bdf8, 1);
    graphics.fillEllipse(155, 140, 175, 100);
    graphics.strokeEllipse(155, 140, 175, 100);

    // Belly highlight
    graphics.fillStyle(0xf0fdfa, 1);
    graphics.fillEllipse(165, 165, 120, 45);

    // Scales
    graphics.lineStyle(4, 0x0ea5e9, 0.6);
    graphics.beginPath();
    graphics.arc(160, 135, 16, 0, Math.PI, false);
    graphics.arc(190, 135, 16, 0, Math.PI, false);
    graphics.strokePath();

    // Kawaii Fish Eye
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(105, 126, 12);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(101, 122, 5);
    graphics.fillCircle(108, 129, 2.5);

    // Sweet smiling mouth
    graphics.lineStyle(4, 0x0369a1, 1);
    graphics.beginPath();
    graphics.arc(82, 142, 8, 0, Math.PI, false);
    graphics.strokePath();
  }

  private drawBanana(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(34, 0xfacc15, 1);
    graphics.beginPath();
    graphics.arc(154, 112, 100, 0.32, 2.5, false);
    graphics.strokePath();

    graphics.lineStyle(7, 0x854d0e, 1);
    graphics.beginPath();
    graphics.arc(154, 112, 100, 0.32, 2.5, false);
    graphics.strokePath();

    // Tips
    graphics.fillStyle(0x713f12, 1);
    graphics.fillCircle(72, 168, 10);
    graphics.fillCircle(236, 168, 10);
  }

  private drawHoney(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0xb45309, 1);
    graphics.lineStyle(7, 0x78350f, 1);
    graphics.fillRoundedRect(92, 74, 136, 154, 26);
    graphics.strokeRoundedRect(92, 74, 136, 154, 26);

    // Glowing honey dripping label
    graphics.fillStyle(0xfde047, 1);
    graphics.fillRoundedRect(112, 110, 96, 58, 16);
    graphics.fillStyle(0x92400e, 1);
    graphics.fillCircle(160, 139, 14);
  }

  private drawBamboo(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0x22c55e, 1);
    graphics.lineStyle(6, 0x15803d, 1);
    graphics.fillRoundedRect(120, 30, 44, 226, 18);
    graphics.strokeRoundedRect(120, 30, 44, 226, 18);
    graphics.fillRoundedRect(174, 50, 44, 196, 18);
    graphics.strokeRoundedRect(174, 50, 44, 196, 18);

    // Nodes
    graphics.lineStyle(6, 0x14532d, 1);
    graphics.lineBetween(120, 95, 164, 95);
    graphics.lineBetween(120, 165, 164, 165);
    graphics.lineBetween(174, 115, 218, 115);
    graphics.lineBetween(174, 185, 218, 185);

    // Leaves
    graphics.fillStyle(0x4ade80, 1);
    graphics.fillEllipse(100, 90, 40, 16);
    graphics.fillEllipse(235, 110, 40, 16);
  }

  private drawSeaweed(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0x10b981, 1);
    graphics.lineStyle(6, 0x064e3b, 1);

    // Wavy Kelp fronds
    graphics.fillEllipse(120, 150, 38, 200);
    graphics.strokeEllipse(120, 150, 38, 200);

    graphics.fillStyle(0x34d399, 1);
    graphics.fillEllipse(165, 130, 42, 230);
    graphics.strokeEllipse(165, 130, 42, 230);

    graphics.fillStyle(0x059669, 1);
    graphics.fillEllipse(210, 160, 38, 190);
    graphics.strokeEllipse(210, 160, 38, 190);

    // Tiny oxygen bubbles
    graphics.fillStyle(0xffffff, 0.85);
    graphics.fillCircle(145, 90, 6);
    graphics.fillCircle(185, 60, 8);
    graphics.fillCircle(195, 110, 5);
  }

  private drawSeashell(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(7, 0xbe185d, 1);
    graphics.fillStyle(0xfbcfe8, 1);

    // Scalloped fan shape
    graphics.fillCircle(160, 145, 95);
    graphics.strokeCircle(160, 145, 95);

    // Gold radiating ridges
    graphics.lineStyle(5, 0xf472b6, 1);
    graphics.lineBetween(160, 230, 100, 90);
    graphics.lineBetween(160, 230, 130, 65);
    graphics.lineBetween(160, 230, 160, 55);
    graphics.lineBetween(160, 230, 190, 65);
    graphics.lineBetween(160, 230, 220, 90);

    // Bottom shell hinge
    graphics.fillStyle(0xf472b6, 1);
    graphics.fillRoundedRect(125, 215, 70, 28, 12);
  }

  private drawPearl(graphics: Phaser.GameObjects.Graphics) {
    // Luminous aura
    graphics.fillStyle(0x38bdf8, 0.35);
    graphics.fillCircle(160, 140, 90);

    // Iridescent Pearl
    graphics.fillStyle(0xffffff, 1);
    graphics.lineStyle(7, 0x0284c7, 1);
    graphics.fillCircle(160, 140, 68);
    graphics.strokeCircle(160, 140, 68);

    // Shading & Sparkles
    graphics.fillStyle(0xe0f2fe, 0.7);
    graphics.fillCircle(172, 150, 48);

    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(142, 122, 20);
    graphics.fillCircle(156, 110, 10);

    // 4-point star sparkle
    graphics.fillStyle(0xfde047, 1);
    graphics.fillTriangle(220, 80, 230, 80, 225, 70);
    graphics.fillTriangle(220, 80, 230, 80, 225, 90);
    graphics.fillTriangle(225, 75, 225, 85, 215, 80);
    graphics.fillTriangle(225, 75, 225, 85, 235, 80);
  }

  private drawPlasticBottle(graphics: Phaser.GameObjects.Graphics) {
    // Clear blue bottle body
    graphics.fillStyle(0x7dd3fc, 0.75);
    graphics.lineStyle(6, 0x0284c7, 1);
    graphics.fillRoundedRect(120, 90, 80, 130, 18);
    graphics.strokeRoundedRect(120, 90, 80, 130, 18);

    // Bottle neck & Red Cap
    graphics.fillRoundedRect(144, 60, 32, 35, 8);
    graphics.fillStyle(0xef4444, 1);
    graphics.fillRoundedRect(140, 44, 40, 22, 6);

    // Label with recycling waves
    graphics.fillStyle(0xffffff, 0.85);
    graphics.fillRoundedRect(124, 130, 72, 45, 6);
    graphics.lineStyle(3, 0x0284c7, 1);
    graphics.lineBetween(132, 152, 188, 152);
  }

  private drawTrashBin(graphics: Phaser.GameObjects.Graphics) {
    // Recycling bin
    graphics.fillStyle(0x22c55e, 1);
    graphics.lineStyle(7, 0x14532d, 1);
    graphics.fillRoundedRect(100, 80, 120, 150, 18);
    graphics.strokeRoundedRect(100, 80, 120, 150, 18);

    // Lid
    graphics.fillRoundedRect(85, 60, 150, 28, 10);
    graphics.strokeRoundedRect(85, 60, 150, 28, 10);

    // White recycling arrows circle
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(160, 155, 30);
    graphics.fillStyle(0x22c55e, 1);
    graphics.fillCircle(160, 155, 18);
  }

  private drawStarfish(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0xf59e0b, 1);
    graphics.lineStyle(7, 0xb45309, 1);

    const points: Phaser.Math.Vector2[] = [];
    const cx = 160;
    const cy = 140;
    const outer = 95;
    const inner = 45;
    for (let i = 0; i < 10; i += 1) {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      points.push(new Phaser.Math.Vector2(cx + r * Math.cos(angle), cy + r * Math.sin(angle)));
    }
    graphics.fillPoints(points, true);
    graphics.strokePoints(points, true);

    // Kawaii smiling face in center
    this.drawKawaiiEyes(graphics, 142, 132, 178, 132, 9);
    this.drawCheeks(graphics, 128, 146, 192, 146, 18, 12);

    graphics.lineStyle(4, 0x1e293b, 1);
    graphics.beginPath();
    graphics.arc(160, 150, 10, 0.1, Math.PI - 0.1, false);
    graphics.strokePath();
  }

  private drawBubbleShield(graphics: Phaser.GameObjects.Graphics) {
    // Iridescent shield
    graphics.fillStyle(0x38bdf8, 0.35);
    graphics.fillCircle(160, 140, 100);

    // Rainbow rim
    graphics.lineStyle(8, 0xa855f7, 0.8);
    graphics.strokeCircle(160, 140, 100);
    graphics.lineStyle(4, 0x38bdf8, 0.9);
    graphics.strokeCircle(160, 140, 94);

    // White reflection arc
    graphics.lineStyle(9, 0xffffff, 0.85);
    graphics.beginPath();
    graphics.arc(160, 140, 80, -2.4, -1.0, false);
    graphics.strokePath();
  }

  private drawBoat(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0xb78155, 1);
    graphics.fillTriangle(44, 156, 276, 156, 222, 226);
    graphics.fillTriangle(44, 156, 98, 226, 222, 226);
    graphics.strokeTriangle(44, 156, 276, 156, 222, 226);

    graphics.lineStyle(6, 0x385241, 1);
    graphics.lineBetween(160, 50, 160, 156);

    // White Sail with Red Flag
    graphics.fillStyle(0xffffff, 1);
    graphics.fillTriangle(164, 55, 164, 146, 240, 146);
    graphics.fillStyle(0xef4444, 1);
    graphics.fillTriangle(160, 48, 160, 68, 130, 58);
  }

  private drawBridge(graphics: Phaser.GameObjects.Graphics, key: string) {
    const fill = key === 'bridge_stone' ? 0x9aa8a8 : key === 'bridge_rope' ? 0xc9812f : 0xb78155;
    graphics.fillStyle(fill, 1);
    graphics.fillRoundedRect(36, 132, 248, 72, 18);
    graphics.strokeRoundedRect(36, 132, 248, 72, 18);
    graphics.lineStyle(5, 0x385241, 1);
    graphics.lineBetween(74, 132, 74, 204);
    graphics.lineBetween(132, 132, 132, 204);
    graphics.lineBetween(190, 132, 190, 204);
  }

  private drawStarGold(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0xffd36a, 1);
    graphics.lineStyle(6, 0xc9812f, 1);
    const points: Phaser.Math.Vector2[] = [];
    const cx = 160;
    const cy = 140;
    const outer = 80;
    const inner = 38;
    for (let i = 0; i < 10; i += 1) {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      points.push(new Phaser.Math.Vector2(cx + r * Math.cos(angle), cy + r * Math.sin(angle)));
    }
    graphics.fillPoints(points, true);
    graphics.strokePoints(points, true);
  }

  private drawHeartPink(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0xf472b6, 1);
    graphics.lineStyle(6, 0xdb2777, 1);
    graphics.fillCircle(125, 115, 45);
    graphics.fillCircle(195, 115, 45);
    graphics.fillTriangle(84, 130, 236, 130, 160, 220);
    graphics.strokeCircle(125, 115, 45);
    graphics.strokeCircle(195, 115, 45);
    graphics.strokeTriangle(84, 130, 236, 130, 160, 220);
  }

  private drawCoral(graphics: Phaser.GameObjects.Graphics, key: string) {
    const isPink = key === 'coral_pink';
    const col = isPink ? 0xf43f5e : 0x06b6d4;
    graphics.fillStyle(col, 1);
    graphics.lineStyle(7, 0x0f172a, 0.4);

    graphics.fillRoundedRect(144, 90, 32, 130, 16);
    graphics.strokeRoundedRect(144, 90, 32, 130, 16);

    graphics.fillRoundedRect(95, 120, 80, 26, 13);
    graphics.fillRoundedRect(85, 65, 28, 70, 14);

    graphics.fillRoundedRect(145, 140, 85, 26, 13);
    graphics.fillRoundedRect(205, 85, 28, 70, 14);
  }

  private drawPathObject(graphics: Phaser.GameObjects.Graphics, key: string) {
    const fillByKey: Record<string, number> = {
      path_bamboo: 0x70bd5f,
      path_cave: 0x8d7568,
      path_flowers: 0xf2a6b4,
      path_mud: 0x8a6848,
      path_pond: 0x4da3d9,
      path_sand: 0xfde047,
      path_stones: 0xaab7b7,
      path_tree: 0x56a760,
    };
    graphics.fillStyle(fillByKey[key] ?? 0xb78155, 1);
    graphics.fillRoundedRect(58, 72, 204, 156, 78);
    graphics.strokeRoundedRect(58, 72, 204, 156, 78);

    graphics.fillStyle(0xffffff, 0.68);
    graphics.fillCircle(120, 134, 14);
    graphics.fillCircle(172, 166, 12);
    graphics.fillCircle(214, 126, 10);
  }

  private createSticker(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const graphics = this.add.graphics();
    // Golden outer sticker border
    graphics.fillStyle(0xffd36a, 1);
    graphics.fillCircle(120, 120, 104);
    graphics.lineStyle(8, 0xc9812f, 1);
    graphics.strokeCircle(120, 120, 104);

    // Inner White badge
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(120, 120, 86);
    graphics.lineStyle(5, 0x6a513e, 0.3);
    graphics.strokeCircle(120, 120, 86);

    // Star icon inside sticker
    graphics.fillStyle(0xf59e0b, 1);
    graphics.fillCircle(120, 120, 36);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(110, 110, 10);

    graphics.generateTexture(key, 240, 240);
    graphics.destroy();
  }
}
