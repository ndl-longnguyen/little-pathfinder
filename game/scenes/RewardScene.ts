import * as Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';
import { LevelManager } from '../systems/LevelManager';
import { ProgressManager } from '../systems/ProgressManager';
import { GAME_HEIGHT, GAME_WIDTH } from '../systems/ResponsiveScale';
import type { Language, LevelSceneInitData } from '../types';

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
    const mission = LevelManager.getMissionById(this.levelId) ?? LevelManager.getFirstMission();
    const sticker = LevelManager.getStickerById(mission.reward.stickerId);
    const animal = mission.reward.animalId ? LevelManager.getAnimalById(mission.reward.animalId) : null;
    const decoration = mission.reward.decorationId ? LevelManager.getDecorationById(mission.reward.decorationId) : null;

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, mission.backgroundKey);

    // Dim background overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x0a221b, 0.55);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Main Reward Card Panel
    const panel = this.add.graphics();
    panel.fillStyle(0xfff9ec, 0.98);
    panel.lineStyle(6, 0x236b4c, 0.45);
    panel.fillRoundedRect(64, 150, 772, 1080, 32);
    panel.strokeRoundedRect(64, 150, 772, 1080, 32);

    // Title text
    const title = this.add
      .text(GAME_WIDTH / 2, 230, 'CHIẾN THẮNG RỰC RỠ! 🎉', {
        align: 'center',
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '46px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Subtitle text (Animal rescued or World restored)
    const subtitle = this.add
      .text(GAME_WIDTH / 2, 296, '', {
        align: 'center',
        color: '#225b45',
        fontFamily: 'Arial',
        fontSize: '28px',
        fontStyle: 'bold',
        wordWrap: { width: 680 },
      })
      .setOrigin(0.5);

    // Rescued Animal dancing
    const animalKey = animal?.assetKey ?? 'rabbit';
    const animalSprite = this.add.image(GAME_WIDTH / 2, 450, animalKey).setScale(1.35);
    this.tweens.add({
      targets: animalSprite,
      y: 430,
      scale: 1.28,
      duration: 550,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 3 Golden Stars
    for (let i = 0; i < 3; i += 1) {
      const star = this.add.image(310 + i * 140, 590, 'star_gold').setScale(0.7);
      this.tweens.add({
        targets: star,
        scale: 0.8,
        duration: 400 + i * 100,
        yoyo: true,
        repeat: -1,
      });
    }

    // Unlocked Rewards Badge Container
    const rewardBox = this.add.graphics();
    rewardBox.fillStyle(0xffffff, 0.9);
    rewardBox.lineStyle(4, 0x236b4c, 0.25);
    rewardBox.fillRoundedRect(100, 660, 700, 260, 20);
    rewardBox.strokeRoundedRect(100, 660, 700, 260, 20);

    // Sticker Image & Label
    const stickerImg = this.add.image(240, 780, sticker?.assetKey ?? 'sticker_rabbit_01').setScale(0.95);
    const stickerName = this.add
      .text(240, 875, sticker?.name ?? 'Sticker', {
        align: 'center',
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '22px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Decoration Image & Label (if any)
    if (decoration) {
      this.add.image(660, 780, decoration.assetKey).setScale(0.65);
      this.add
        .text(660, 875, decoration.name.vi, {
          align: 'center',
          color: '#1f2933',
          fontFamily: 'Arial',
          fontSize: '22px',
          fontStyle: 'bold',
        })
        .setName('decText')
        .setOrigin(0.5);
    }

    // Audio & Settings Voice
    void ProgressManager.getSettings().then((settings) => {
      this.language = settings.language;
      const sub =
        settings.language === 'vi'
          ? `Bé đã giải cứu bạn ${animal?.nameVi ?? 'thú'} và nhận thêm quà!`
          : `You rescued ${animal?.nameEn ?? 'friend'} and earned new gifts!`;
      subtitle.setText(sub);

      if (decoration) {
        const decText = this.children.getByName('decText') as Phaser.GameObjects.Text | null;
        decText?.setText(decoration.name[settings.language]);
      }

      title.setText(settings.language === 'vi' ? 'CHIẾN THẮNG RỰC RỠ! 🎉' : 'RESCUE COMPLETE! 🎉');

      void AudioManager.play('/audio/vi/reward_01.mp3', sub, settings.language);
    });

    // Buttons
    const nextMission = LevelManager.getNextMission(this.levelId);
    if (nextMission) {
      this.createBigButton(GAME_WIDTH / 2, 980, 'Tiếp Tục 🚀', () => {
        AudioManager.stop();
        window.location.href = `/game?level=${nextMission.id}`;
      });
    }

    this.createSmallButton(260, 1120, '🏡 Đảo Rừng', () => {
      AudioManager.stop();
      window.location.href = '/animal-home';
    });

    this.createSmallButton(640, 1120, '🗺️ Bản Đồ', () => {
      AudioManager.stop();
      window.location.href = '/levels';
    });
  }

  private createBigButton(x: number, y: number, label: string, onClick: () => void) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xffd36a, 1);
    bg.lineStyle(6, 0xc9812f, 1);
    bg.fillRoundedRect(-180, -46, 360, 92, 16);
    bg.strokeRoundedRect(-180, -46, 360, 92, 16);

    const text = this.add
      .text(0, 0, label, {
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '36px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(360, 92);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-220, -55, 440, 110),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on('pointerdown', onClick);
  }

  private createSmallButton(x: number, y: number, label: string, onClick: () => void) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.92);
    bg.lineStyle(5, 0x236b4c, 0.8);
    bg.fillRoundedRect(-140, -36, 280, 72, 14);
    bg.strokeRoundedRect(-140, -36, 280, 72, 14);

    const text = this.add
      .text(0, 0, label, {
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '26px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(280, 72);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-170, -45, 340, 90),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on('pointerdown', onClick);
  }
}
