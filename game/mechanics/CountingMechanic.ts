import * as Phaser from 'phaser';
import { BaseMechanic, type MechanicCallback } from './BaseMechanic';
import type { CountingChallengeConfig, Language } from '../types';

type OptionButtonView = {
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Graphics;
  handHint?: Phaser.GameObjects.Text;
  isCorrect: boolean;
};

export class CountingMechanic extends BaseMechanic {
  private config: CountingChallengeConfig;
  private items: Phaser.GameObjects.Image[] = [];
  private optionViews: OptionButtonView[] = [];

  constructor(
    scene: Phaser.Scene,
    config: CountingChallengeConfig,
    language: Language,
    callback: MechanicCallback,
  ) {
    super(scene, language, callback);
    this.config = config;
    this.render();
  }

  private render() {
    // 1. Items Display Tray
    const tray = this.scene.add.graphics();
    tray.fillStyle(0xffffff, 0.85);
    tray.lineStyle(5, 0x236b4c, 0.3);
    tray.fillRoundedRect(150, 420, 600, 240, 24);
    tray.strokeRoundedRect(150, 420, 600, 240, 24);
    this.container.add(tray);

    const count = this.config.count;
    const spacing = 500 / (count + 1);

    for (let i = 0; i < count; i += 1) {
      const itemX = 200 + spacing * (i + 1);
      const itemY = 540;
      const img = this.scene.add.image(itemX, itemY, this.config.itemAssetKey).setScale(0.8);
      this.items.push(img);
      this.container.add(img);

      // Subtle float animation for items
      this.scene.tweens.add({
        targets: img,
        y: itemY - 14,
        duration: 800 + i * 150,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // 2. Number Options
    const optCount = this.config.options.length;
    const startX = 450 - ((optCount - 1) * 220) / 2;

    for (let i = 0; i < optCount; i += 1) {
      const opt = this.config.options[i];
      const posX = startX + i * 220;
      const posY = 1060;
      const view = this.createOption(opt, posX, posY);
      this.optionViews.push(view);
      this.container.add(view.container);
    }
  }

  private createOption(
    opt: CountingChallengeConfig['options'][0],
    x: number,
    y: number,
  ): OptionButtonView {
    const container = this.scene.add.container(x, y);

    const glow = this.scene.add.graphics().setVisible(false);
    glow.lineStyle(8, 0xffd36a, 1);
    glow.strokeCircle(0, 0, 84);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0xfffdf7, 0.96);
    bg.lineStyle(5, 0x236b4c, 0.35);
    bg.fillCircle(0, 0, 72);
    bg.strokeCircle(0, 0, 72);

    const numText = this.scene.add
      .text(0, 0, opt.label, {
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '56px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const handHint = this.scene.add
      .text(0, 80, '👆', { fontSize: '42px' })
      .setOrigin(0.5, 0)
      .setVisible(false);

    container.add([glow, bg, numText, handHint]);
    container.setSize(144, 144);
    container.setInteractive(
      new Phaser.Geom.Circle(0, 0, 72),
      Phaser.Geom.Circle.Contains,
    );

    container.on('pointerdown', () => this.handleSelect(opt, container));

    return { container, glow, handHint, isCorrect: opt.isCorrect };
  }

  private handleSelect(
    opt: CountingChallengeConfig['options'][0],
    container: Phaser.GameObjects.Container,
  ) {
    if (this.isLocked) return;

    if (opt.isCorrect) {
      this.isLocked = true;
      for (const view of this.optionViews) {
        view.container.disableInteractive();
      }

      // Celebrate with items jumping together
      this.scene.tweens.add({
        targets: this.items,
        y: '-=40',
        duration: 200,
        yoyo: true,
        repeat: 1,
      });

      this.scene.tweens.add({
        targets: container,
        scale: 1.2,
        duration: 180,
        yoyo: true,
        onComplete: () => {
          this.callback.onSuccess();
        },
      });
    } else {
      this.attempts += 1;
      this.scene.tweens.add({
        targets: container,
        x: container.x + 12,
        duration: 70,
        repeat: 3,
        yoyo: true,
      });
      this.callback.onFailAttempt(this.attempts);
    }
  }

  public applyHint(level: number): void {
    const correctView = this.optionViews.find((v) => v.isCorrect);
    if (!correctView) return;

    if (level === 2) {
      this.scene.tweens.add({
        targets: correctView.container,
        scale: 1.15,
        duration: 250,
        yoyo: true,
        repeat: 2,
      });
    } else if (level >= 3) {
      correctView.glow.setVisible(true);
      if (correctView.handHint) {
        correctView.handHint.setVisible(true);
        this.scene.tweens.add({
          targets: correctView.handHint,
          y: correctView.handHint.y - 12,
          duration: 350,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }
}
