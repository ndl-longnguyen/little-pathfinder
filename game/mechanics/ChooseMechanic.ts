import * as Phaser from 'phaser';
import { BaseMechanic, type MechanicCallback } from './BaseMechanic';
import type { ChooseChallengeConfig, Language } from '../types';
import { optionScale } from '../systems/ResponsiveScale';

type OptionView = {
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Graphics;
  handHint?: Phaser.GameObjects.Text;
  isCorrect: boolean;
};

export class ChooseMechanic extends BaseMechanic {
  private config: ChooseChallengeConfig;
  private optionViews: OptionView[] = [];

  constructor(
    scene: Phaser.Scene,
    config: ChooseChallengeConfig,
    language: Language,
    callback: MechanicCallback,
  ) {
    super(scene, language, callback);
    this.config = config;
    this.render();
  }

  private render() {
    const scale = optionScale(this.config.options.length);
    const count = this.config.options.length;

    // Calculate dynamic positions if not pre-configured
    const positions = this.config.options.map((opt, index) => {
      if (opt.position) {
        return opt.position;
      }
      if (count === 2) {
        return { x: index === 0 ? 260 : 640, y: 1080 };
      }
      if (count === 3) {
        const xs = [200, 450, 700];
        return { x: xs[index], y: 1080 };
      }
      // 4 options
      const xs = [145, 350, 555, 760];
      return { x: xs[index], y: 1080 };
    });

    for (let i = 0; i < this.config.options.length; i += 1) {
      const option = this.config.options[i];
      const pos = positions[i];
      const view = this.createOption(option, pos.x, pos.y, scale);
      this.optionViews.push(view);
      this.container.add(view.container);
    }
  }

  private createOption(
    option: ChooseChallengeConfig['options'][0],
    x: number,
    y: number,
    scale: number,
  ): OptionView {
    const width = 270 * scale;
    const height = 250 * scale;
    const container = this.scene.add.container(x, y);

    const glow = this.scene.add.graphics().setVisible(false);
    glow.lineStyle(8, 0xffd36a, 1);
    glow.strokeRoundedRect(-width / 2 - 8, -height / 2 - 8, width + 16, height + 16, 24);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0xfffdf7, 0.96);
    bg.lineStyle(5, 0x236b4c, 0.3);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 18);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 18);

    const image = this.scene.add
      .image(0, -26 * scale, option.assetKey)
      .setScale(0.72 * scale);

    const label = this.scene.add
      .text(0, 82 * scale, option.label, {
        align: 'center',
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: `${28 * scale}px`,
        fontStyle: 'bold',
        wordWrap: { width: width - 28 },
      })
      .setOrigin(0.5);

    const handHint = this.scene.add
      .text(0, height / 2 + 10, '👆', {
        fontSize: '44px',
      })
      .setOrigin(0.5, 0)
      .setVisible(false);

    container.add([glow, bg, image, label, handHint]);
    container.setSize(width, height);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains,
    );

    container.on('pointerdown', () => this.handleSelect(option, container));

    return { container, glow, handHint, isCorrect: option.isCorrect };
  }

  private handleSelect(
    option: ChooseChallengeConfig['options'][0],
    container: Phaser.GameObjects.Container,
  ) {
    if (this.isLocked) {
      return;
    }

    if (option.isCorrect) {
      this.isLocked = true;
      for (const view of this.optionViews) {
        view.container.disableInteractive();
      }
      this.scene.tweens.add({
        targets: container,
        scale: 1.1,
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
        ease: 'Sine.easeInOut',
        repeat: 3,
        yoyo: true,
      });
      this.callback.onFailAttempt(this.attempts);
    }
  }

  public applyHint(level: number): void {
    const correctView = this.optionViews.find((v) => v.isCorrect);
    if (!correctView) {
      return;
    }

    if (level === 2) {
      this.scene.tweens.add({
        targets: correctView.container,
        y: correctView.container.y - 15,
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
