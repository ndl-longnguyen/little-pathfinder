import { AudioManager } from '../systems/AudioManager';
import * as Phaser from 'phaser';
import { BaseMechanic, type MechanicCallback } from './BaseMechanic';
import type { FindObjectChallengeConfig, Language } from '../types';

type TargetView = {
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Graphics;
  handHint?: Phaser.GameObjects.Text;
  isTarget: boolean;
};

export class FindObjectMechanic extends BaseMechanic {
  private config: FindObjectChallengeConfig;
  private targetViews: TargetView[] = [];

  constructor(
    scene: Phaser.Scene,
    config: FindObjectChallengeConfig,
    language: Language,
    callback: MechanicCallback,
  ) {
    super(scene, language, callback);
    this.config = config;
    this.render();
  }

  private render() {
    for (const item of this.config.targets) {
      const view = this.createTarget(item);
      this.targetViews.push(view);
      this.container.add(view.container);
    }
  }

  private createTarget(item: FindObjectChallengeConfig['targets'][0]): TargetView {
    const container = this.scene.add.container(item.position.x, item.position.y);

    const glow = this.scene.add.graphics().setVisible(false);
    glow.lineStyle(8, 0xffd36a, 1);
    glow.strokeCircle(0, 0, 110);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0xffffff, 0.9);
    bg.lineStyle(4, 0x236b4c, 0.3);
    bg.fillCircle(0, 0, 95);
    bg.strokeCircle(0, 0, 95);

    const img = this.scene.add.image(0, -10, item.assetKey).setScale(0.85);
    const label = this.scene.add
      .text(0, 58, item.label, {
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const handHint = this.scene.add
      .text(0, 85, '👆', { fontSize: '42px' })
      .setOrigin(0.5, 0)
      .setVisible(false);

    container.add([glow, bg, img, label, handHint]);
    container.setSize(190, 190);
    container.setInteractive(
      new Phaser.Geom.Circle(0, 0, 125),
      Phaser.Geom.Circle.Contains,
    );

    container.on('pointerdown', () => {
      AudioManager.playSound('tap');
      this.handleTap(item, container);
    });

    return { container, glow, handHint, isTarget: item.isTarget };
  }

  private handleTap(
    item: FindObjectChallengeConfig['targets'][0],
    container: Phaser.GameObjects.Container,
  ) {
    if (this.isLocked) return;

    if (item.isTarget) {
      this.isLocked = true;
      for (const view of this.targetViews) {
        view.container.disableInteractive();
      }

      this.scene.tweens.add({
        targets: container,
        scale: 1.25,
        duration: 250,
        yoyo: true,
        ease: 'Back.easeOut',
        onComplete: () => {
          AudioManager.playSound('success'); this.callback.onSuccess();
        },
      });
    } else {
      AudioManager.playSound('wrong'); this.attempts += 1;
      this.scene.tweens.add({
        targets: container,
        angle: 15,
        duration: 80,
        yoyo: true,
        repeat: 3,
      });
      this.callback.onFailAttempt(this.attempts);
    }
  }

  public applyHint(level: number): void {
    const targetView = this.targetViews.find((v) => v.isTarget);
    if (!targetView) return;

    if (level === 2) {
      this.scene.tweens.add({
        targets: targetView.container,
        y: targetView.container.y - 20,
        duration: 220,
        yoyo: true,
        repeat: 2,
      });
    } else if (level >= 3) {
      targetView.glow.setVisible(true);
      if (targetView.handHint) {
        targetView.handHint.setVisible(true);
        this.scene.tweens.add({
          targets: targetView.handHint,
          y: targetView.handHint.y - 12,
          duration: 350,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }
}
