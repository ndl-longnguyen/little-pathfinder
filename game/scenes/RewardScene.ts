import * as Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';
import { LevelManager } from '../systems/LevelManager';
import { ProgressManager } from '../systems/ProgressManager';
import { GAME_HEIGHT, GAME_WIDTH } from '../systems/ResponsiveScale';
import type { Language, LevelSceneInitData } from '../types';

const rewardText = {
  en: 'You got a new sticker!',
  vi: 'Con nhận được một sticker mới!',
} as const;

export class RewardScene extends Phaser.Scene {
  private levelId = 1;
  private language: Language = 'vi';

  constructor() {
    super('RewardScene');
  }

  init(data: LevelSceneInitData) {
    this.levelId = data.levelId;
  }

  create() {
    const level = LevelManager.getLevelById(this.levelId) ?? LevelManager.getFirstLevel();
    const sticker = LevelManager.getStickerById(level.rewardStickerId);

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, level.backgroundKey);

    const panel = this.add.graphics();
    panel.fillStyle(0xfff9ec, 0.96);
    panel.lineStyle(6, 0x236b4c, 0.42);
    panel.fillRoundedRect(74, 190, 752, 940, 28);
    panel.strokeRoundedRect(74, 190, 752, 940, 28);

    const title = this.add
      .text(GAME_WIDTH / 2, 302, rewardText.vi, {
        align: 'center',
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '50px',
        fontStyle: 'bold',
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5);

    void ProgressManager.getSettings().then((settings) => {
      this.language = settings.language;
      title.setText(rewardText[settings.language]);
      void AudioManager.play(
        '/audio/vi/reward_01.mp3',
        rewardText[settings.language],
        settings.language,
      );
    });

    this.add
      .image(GAME_WIDTH / 2, 560, sticker?.assetKey ?? level.rewardStickerId)
      .setScale(1.42);

    this.add
      .text(GAME_WIDTH / 2, 770, sticker?.name ?? 'Forest Sticker', {
        align: 'center',
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '42px',
        fontStyle: 'bold',
        wordWrap: { width: 620 },
      })
      .setOrigin(0.5);

    const nextLevel = LevelManager.getNextLevel(this.levelId);
    if (nextLevel) {
      this.createButton(GAME_WIDTH / 2, 940, 'Next', () => {
        window.location.href = `/game?level=${nextLevel.id}`;
      });
    }

    this.createButton(288, 1060, 'Stickers', () => {
      window.location.href = '/stickers';
    });
    this.createButton(612, 1060, 'Levels', () => {
      window.location.href = '/levels';
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xffd36a, 1);
    bg.lineStyle(6, 0xc9812f, 1);
    bg.fillRoundedRect(-128, -44, 256, 88, 12);
    bg.strokeRoundedRect(-128, -44, 256, 88, 12);
    const text = this.add
      .text(0, 0, label, {
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '34px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(256, 88);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-128, -44, 256, 88),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on('pointerdown', onClick);
  }
}
