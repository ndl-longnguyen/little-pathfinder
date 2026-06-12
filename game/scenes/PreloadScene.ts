import * as Phaser from 'phaser';
import stickersJson from '@/data/stickers.json';
import type { LevelSceneInitData, StickerData } from '../types';
import { GAME_HEIGHT, GAME_WIDTH } from '../systems/ResponsiveScale';

const stickers = stickersJson as StickerData[];

const animalKeys = ['rabbit', 'duck', 'bear', 'monkey', 'panda'];
const backgroundKeys = [
  'bg_forest_01',
  'bg_river_01',
  'bg_mountain_01',
  'bg_farm_01',
  'bg_city_01',
];
const objectKeys = [
  'home_red',
  'home_blue',
  'home_green',
  'home_yellow',
  'home_brown',
  'carrot',
  'fish',
  'banana',
  'honey',
  'bamboo',
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
    const sky = key === 'bg_river_01' ? 0x9fd7f0 : 0xa8def2;
    const grass = key === 'bg_mountain_01' ? 0x8cc96b : 0x6fc46a;

    graphics.fillStyle(sky, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    graphics.fillStyle(0xffd36a, 1);
    graphics.fillCircle(126, 136, 74);
    graphics.fillStyle(grass, 1);
    graphics.fillRect(0, 880, GAME_WIDTH, 720);
    graphics.fillStyle(0x3e9658, 1);
    graphics.fillEllipse(720, 1040, 620, 260);
    graphics.fillStyle(0x2f8051, 1);
    graphics.fillEllipse(180, 1118, 520, 220);

    if (key === 'bg_river_01') {
      graphics.fillStyle(0x4da3d9, 1);
      graphics.fillRoundedRect(0, 1040, GAME_WIDTH, 190, 90);
      graphics.fillStyle(0xffffff, 0.58);
      graphics.fillRoundedRect(80, 1098, 260, 18, 9);
      graphics.fillRoundedRect(520, 1150, 240, 18, 9);
    }

    if (key === 'bg_mountain_01') {
      graphics.fillStyle(0x7aa18b, 1);
      graphics.fillTriangle(220, 850, 450, 280, 700, 850);
      graphics.fillStyle(0xe8f4ef, 1);
      graphics.fillTriangle(450, 280, 384, 440, 520, 440);
    }

    graphics.generateTexture(key, GAME_WIDTH, GAME_HEIGHT);
    graphics.destroy();
  }

  private createAnimal(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const graphics = this.add.graphics();
    const colors: Record<string, number> = {
      bear: 0x9b6a3f,
      duck: 0xffd66f,
      monkey: 0xa66b43,
      panda: 0xffffff,
      rabbit: 0xffffff,
    };
    const outline = key === 'duck' ? 0xd59634 : 0x6a513e;

    graphics.fillStyle(colors[key] ?? 0xffffff, 1);
    graphics.lineStyle(8, outline, 1);

    if (key === 'duck') {
      graphics.fillEllipse(170, 170, 250, 190);
      graphics.strokeEllipse(170, 170, 250, 190);
      graphics.fillEllipse(260, 126, 126, 104);
      graphics.strokeEllipse(260, 126, 126, 104);
      graphics.fillStyle(0xf19943, 1);
      graphics.fillTriangle(322, 124, 396, 148, 322, 172);
    } else {
      graphics.fillEllipse(200, 184, 252, 210);
      graphics.strokeEllipse(200, 184, 252, 210);
    }

    if (key === 'rabbit') {
      graphics.fillStyle(0xffffff, 1);
      graphics.fillEllipse(132, 50, 54, 132);
      graphics.strokeEllipse(132, 50, 54, 132);
      graphics.fillEllipse(252, 50, 54, 132);
      graphics.strokeEllipse(252, 50, 54, 132);
      graphics.fillStyle(0xf4a7b8, 1);
      graphics.fillEllipse(132, 58, 22, 86);
      graphics.fillEllipse(252, 58, 22, 86);
    }

    if (key === 'bear') {
      graphics.fillCircle(104, 88, 46);
      graphics.fillCircle(292, 88, 46);
      graphics.strokeCircle(104, 88, 46);
      graphics.strokeCircle(292, 88, 46);
    }

    if (key === 'monkey') {
      graphics.fillCircle(104, 120, 38);
      graphics.fillCircle(296, 120, 38);
      graphics.strokeCircle(104, 120, 38);
      graphics.strokeCircle(296, 120, 38);
      graphics.fillStyle(0xf0c69d, 1);
      graphics.fillEllipse(200, 204, 132, 96);
    }

    if (key === 'panda') {
      graphics.fillStyle(0x222222, 1);
      graphics.fillCircle(104, 96, 48);
      graphics.fillCircle(296, 96, 48);
      graphics.fillEllipse(154, 158, 58, 46);
      graphics.fillEllipse(246, 158, 58, 46);
    }

    graphics.fillStyle(0x1f2933, 1);
    graphics.fillCircle(154, 154, 12);
    graphics.fillCircle(246, 154, 12);
    graphics.fillEllipse(200, 190, 18, 14);
    graphics.lineStyle(5, 0x1f2933, 1);
    graphics.beginPath();
    graphics.arc(184, 208, 18, 0, Math.PI, false);
    graphics.arc(216, 208, 18, 0, Math.PI, false);
    graphics.strokePath();

    graphics.generateTexture(key, 400, 320);
    graphics.destroy();
  }

  private createObject(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const graphics = this.add.graphics();
    graphics.lineStyle(7, 0x385241, 1);

    if (key.startsWith('home_')) {
      const fillByKey: Record<string, number> = {
        home_blue: 0x4f9cdf,
        home_brown: 0xb78155,
        home_green: 0x69bf75,
        home_red: 0xee7566,
        home_yellow: 0xffd36a,
      };
      graphics.fillStyle(fillByKey[key] ?? 0xee7566, 1);
      graphics.fillRoundedRect(54, 90, 172, 148, 12);
      graphics.strokeRoundedRect(54, 90, 172, 148, 12);
      graphics.fillStyle(0x914338, 1);
      graphics.fillTriangle(30, 98, 140, 18, 250, 98);
      graphics.fillStyle(0xfff4db, 1);
      graphics.fillRoundedRect(122, 162, 44, 76, 8);
    } else if (key === 'carrot') {
      graphics.fillStyle(0x55ad5c, 1);
      graphics.fillTriangle(116, 72, 160, 16, 172, 94);
      graphics.fillTriangle(150, 72, 208, 16, 196, 94);
      graphics.fillStyle(0xf38b35, 1);
      graphics.fillTriangle(92, 86, 230, 94, 138, 238);
    } else if (key === 'fish') {
      graphics.fillStyle(0x4f9cdf, 1);
      graphics.fillEllipse(146, 144, 168, 92);
      graphics.fillTriangle(228, 144, 292, 92, 292, 196);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(96, 130, 13);
      graphics.fillStyle(0x1f2933, 1);
      graphics.fillCircle(98, 130, 6);
    } else if (key === 'banana') {
      graphics.lineStyle(28, 0xffd36a, 1);
      graphics.beginPath();
      graphics.arc(154, 112, 96, 0.32, 2.5, false);
      graphics.strokePath();
      graphics.lineStyle(7, 0x8d6a2d, 1);
      graphics.beginPath();
      graphics.arc(154, 112, 96, 0.32, 2.5, false);
      graphics.strokePath();
    } else if (key === 'honey') {
      graphics.fillStyle(0xc9812f, 1);
      graphics.fillRoundedRect(92, 74, 136, 154, 22);
      graphics.strokeRoundedRect(92, 74, 136, 154, 22);
      graphics.fillStyle(0xffd36a, 1);
      graphics.fillRoundedRect(112, 112, 96, 54, 12);
    } else if (key === 'bamboo') {
      graphics.fillStyle(0x55ad5c, 1);
      graphics.fillRoundedRect(128, 34, 42, 220, 18);
      graphics.fillRoundedRect(176, 54, 42, 188, 18);
      graphics.lineStyle(5, 0x2c7849, 1);
      graphics.lineBetween(128, 98, 170, 98);
      graphics.lineBetween(128, 168, 170, 168);
      graphics.lineBetween(176, 122, 218, 122);
      graphics.lineBetween(176, 190, 218, 190);
    } else if (key === 'boat') {
      graphics.fillStyle(0xb78155, 1);
      graphics.fillTriangle(44, 156, 276, 156, 222, 226);
      graphics.fillTriangle(44, 156, 98, 226, 222, 226);
      graphics.strokeTriangle(44, 156, 276, 156, 222, 226);
      graphics.lineStyle(6, 0x385241, 1);
      graphics.lineBetween(160, 60, 160, 156);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillTriangle(164, 64, 164, 146, 230, 146);
    } else if (key.startsWith('bridge_')) {
      const fill = key === 'bridge_stone' ? 0x9aa8a8 : key === 'bridge_rope' ? 0xc9812f : 0xb78155;
      graphics.fillStyle(fill, 1);
      graphics.fillRoundedRect(36, 132, 248, 72, 18);
      graphics.strokeRoundedRect(36, 132, 248, 72, 18);
      graphics.lineStyle(5, 0x385241, 1);
      graphics.lineBetween(74, 132, 74, 204);
      graphics.lineBetween(132, 132, 132, 204);
      graphics.lineBetween(190, 132, 190, 204);
      graphics.lineBetween(248, 132, 248, 204);
    } else {
      const fillByKey: Record<string, number> = {
        path_bamboo: 0x70bd5f,
        path_cave: 0x8d7568,
        path_flowers: 0xf2a6b4,
        path_mud: 0x8a6848,
        path_pond: 0x4da3d9,
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

    graphics.generateTexture(key, 320, 280);
    graphics.destroy();
  }

  private createSticker(key: string) {
    if (this.textures.exists(key)) {
      return;
    }

    const graphics = this.add.graphics();
    graphics.fillStyle(0xffd36a, 1);
    graphics.fillCircle(120, 120, 104);
    graphics.lineStyle(8, 0xc9812f, 1);
    graphics.strokeCircle(120, 120, 104);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillEllipse(120, 118, 126, 94);
    graphics.lineStyle(6, 0x6a513e, 1);
    graphics.strokeEllipse(120, 118, 126, 94);
    graphics.fillStyle(0x1f2933, 1);
    graphics.fillCircle(96, 112, 7);
    graphics.fillCircle(144, 112, 7);
    graphics.fillEllipse(120, 134, 10, 8);
    graphics.generateTexture(key, 240, 240);
    graphics.destroy();
  }
}
