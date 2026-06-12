import * as Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';
import { LevelManager } from '../systems/LevelManager';
import { ProgressManager } from '../systems/ProgressManager';
import { GAME_HEIGHT, GAME_WIDTH, optionScale } from '../systems/ResponsiveScale';
import type { Language, LevelData, LevelOption, LevelSceneInitData } from '../types';

type OptionView = {
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Graphics;
  option: LevelOption;
};

const successText = {
  en: 'Great job! You did it!',
  vi: 'Giỏi quá! Bạn đã làm được rồi!',
} as const;

const retryText = {
  en: 'Almost there, let us try again.',
  vi: 'Gần đúng rồi, mình thử lại nhé!',
} as const;

export class LevelScene extends Phaser.Scene {
  private attempts = 0;
  private language: Language = 'vi';
  private level: LevelData = LevelManager.getFirstLevel();
  private instructionLabel: Phaser.GameObjects.Text | null = null;
  private optionViews: OptionView[] = [];
  private inputLocked = false;

  constructor() {
    super('LevelScene');
  }

  init(data: LevelSceneInitData) {
    this.level = LevelManager.getLevelById(data.levelId) ?? LevelManager.getFirstLevel();
    this.attempts = 0;
    this.inputLocked = false;
    this.optionViews = [];
  }

  create() {
    void ProgressManager.getSettings().then((settings) => {
      this.language = settings.language;
      const text =
        settings.language === 'vi'
          ? this.level.instructionTextVi
          : this.level.instructionTextEn;
      this.instructionLabel?.setText(text);
      void AudioManager.play(this.level.instructionAudio, text, settings.language);
    });

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.level.backgroundKey);
    this.createTopButtons();
    this.createInstruction();
    this.createGoalScene();
    this.createOptions();
  }

  private createTopButtons() {
    this.createSmallButton(100, 76, 'Home', () => {
      window.location.href = '/';
    });
    this.createSmallButton(800, 76, 'Levels', () => {
      window.location.href = '/levels';
    });
  }

  private createSmallButton(x: number, y: number, label: string, onClick: () => void) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.86);
    bg.lineStyle(4, 0x236b4c, 1);
    bg.fillRoundedRect(-78, -30, 156, 60, 10);
    bg.strokeRoundedRect(-78, -30, 156, 60, 10);
    const text = this.add
      .text(0, 0, label, {
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    container.add([bg, text]);
    container.setSize(156, 60);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-78, -30, 156, 60),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on('pointerdown', onClick);
  }

  private createInstruction() {
    const text =
      this.language === 'vi' ? this.level.instructionTextVi : this.level.instructionTextEn;
    const panel = this.add.graphics();
    panel.fillStyle(0xfff9ec, 0.94);
    panel.lineStyle(5, 0x236b4c, 0.34);
    panel.fillRoundedRect(70, 132, 760, 188, 20);
    panel.strokeRoundedRect(70, 132, 760, 188, 20);

    this.instructionLabel = this.add
      .text(GAME_WIDTH / 2, 224, text, {
        align: 'center',
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '36px',
        fontStyle: 'bold',
        lineSpacing: 8,
        wordWrap: { width: 680 },
      })
      .setOrigin(0.5);
  }

  private createGoalScene() {
    const animal = LevelManager.getAnimalById(this.level.animalId);
    const animalKey = animal?.assetKey ?? this.level.animalId;
    const animalSprite = this.add.image(GAME_WIDTH / 2, 510, animalKey).setScale(1.08);
    animalSprite.setName('animal');

    this.tweens.add({
      targets: animalSprite,
      y: 492,
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    const goalPanel = this.add.graphics();
    goalPanel.fillStyle(0xffffff, 0.78);
    goalPanel.lineStyle(4, 0x236b4c, 0.24);
    goalPanel.fillRoundedRect(328, 650, 244, 180, 18);
    goalPanel.strokeRoundedRect(328, 650, 244, 180, 18);
    this.add.image(GAME_WIDTH / 2, 740, this.level.goalAssetKey).setScale(0.55);
  }

  private createOptions() {
    const scale = optionScale(this.level.options.length);
    for (const option of this.level.options) {
      const view = this.createOption(option, scale);
      this.optionViews.push(view);
    }
  }

  private createOption(option: LevelOption, scale: number): OptionView {
    const width = 270 * scale;
    const height = 250 * scale;
    const container = this.add.container(option.position.x, option.position.y);
    const glow = this.add.graphics().setVisible(false);
    const bg = this.add.graphics();
    bg.fillStyle(0xfffdf7, 0.96);
    bg.lineStyle(5, 0x236b4c, 0.3);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 18);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 18);

    const image = this.add.image(0, -26 * scale, option.assetKey).setScale(0.55 * scale);
    const label = this.add
      .text(0, 82 * scale, option.label, {
        align: 'center',
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: `${28 * scale}px`,
        fontStyle: 'bold',
        wordWrap: { width: width - 28 },
      })
      .setOrigin(0.5);

    container.add([glow, bg, image, label]);
    container.setSize(width, height);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on('pointerdown', () => this.handleOption(option, container));

    glow.lineStyle(8, 0xffd36a, 1);
    glow.strokeRoundedRect(-width / 2 - 8, -height / 2 - 8, width + 16, height + 16, 24);

    return { container, glow, option };
  }

  private handleOption(option: LevelOption, container: Phaser.GameObjects.Container) {
    if (this.inputLocked) {
      return;
    }

    if (option.isCorrect) {
      this.handleCorrect(option);
      return;
    }

    this.attempts += 1;
    this.tweens.add({
      targets: container,
      x: container.x + 12,
      duration: 70,
      ease: 'Sine.easeInOut',
      repeat: 3,
      yoyo: true,
    });
    void AudioManager.play(this.level.retryAudio, retryText[this.language], this.language);

    if (this.attempts >= 2) {
      this.optionViews
        .find((view) => view.option.isCorrect)
        ?.glow.setVisible(true);
    }
  }

  private handleCorrect(option: LevelOption) {
    this.inputLocked = true;
    for (const view of this.optionViews) {
      view.container.disableInteractive();
    }

    const animal = this.children.getByName('animal') as Phaser.GameObjects.Image | null;
    if (animal) {
      this.tweens.killTweensOf(animal);
      this.tweens.add({
        targets: animal,
        x: option.position.x,
        y: option.position.y - 118,
        scale: 0.72,
        duration: 700,
        ease: 'Back.easeInOut',
      });
    }

    this.showConfetti();
    void AudioManager.play(this.level.successAudio, successText[this.language], this.language);

    void ProgressManager.completeLevel(this.level.id).then(() => {
      this.time.delayedCall(1150, () => {
        this.scene.start('RewardScene', { levelId: this.level.id });
      });
    });
  }

  private showConfetti() {
    const colors = [0xffd36a, 0xee7566, 0x3d8ed8, 0x74c76b, 0xffffff];

    for (let i = 0; i < 42; i += 1) {
      const dot = this.add.circle(GAME_WIDTH / 2, 420, 8, colors[i % colors.length]);
      this.tweens.add({
        targets: dot,
        alpha: 0,
        angle: Phaser.Math.Between(0, 360),
        duration: Phaser.Math.Between(900, 1450),
        ease: 'Cubic.easeOut',
        x: GAME_WIDTH / 2 + Phaser.Math.Between(-360, 360),
        y: Phaser.Math.Between(120, 980),
        onComplete: () => dot.destroy(),
      });
    }
  }
}
