import { AudioManager } from '../systems/AudioManager';
import * as Phaser from 'phaser';
import { BaseMechanic, type MechanicCallback } from './BaseMechanic';
import type { DragDropChallengeConfig, Language } from '../types';

export class DragDropMechanic extends BaseMechanic {
  private config: DragDropChallengeConfig;
  private draggableContainer!: Phaser.GameObjects.Container;
  private targetContainer!: Phaser.GameObjects.Container;
  private hintHand?: Phaser.GameObjects.Text;
  private targetGlow!: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    config: DragDropChallengeConfig,
    language: Language,
    callback: MechanicCallback,
  ) {
    super(scene, language, callback);
    this.config = config;
    this.render();
  }

  private render() {
    const { draggable, target } = this.config;

    // 1. Target Zone
    this.targetContainer = this.scene.add.container(target.targetPos.x, target.targetPos.y);

    const targetBg = this.scene.add.graphics();
    targetBg.fillStyle(0xffffff, 0.7);
    targetBg.lineStyle(5, 0x236b4c, 0.4);
    targetBg.fillCircle(0, 0, 130);
    targetBg.strokeCircle(0, 0, 130);

    this.targetGlow = this.scene.add.graphics().setVisible(false);
    this.targetGlow.lineStyle(8, 0xffd36a, 1);
    this.targetGlow.strokeCircle(0, 0, 140);

    const targetImg = this.scene.add.image(0, -10, target.assetKey).setScale(1.0);
    const targetLabel = this.scene.add
      .text(0, 80, (this.language === 'en' && target.labelEn) ? target.labelEn : target.label, {
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '26px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.targetContainer.add([this.targetGlow, targetBg, targetImg, targetLabel]);
    this.container.add(this.targetContainer);

    // 2. Draggable Object
    this.draggableContainer = this.scene.add.container(draggable.startPos.x, draggable.startPos.y);

    const dragBg = this.scene.add.graphics();
    dragBg.fillStyle(0xfffdf7, 0.95);
    dragBg.lineStyle(5, 0x236b4c, 0.35);
    dragBg.fillRoundedRect(-110, -95, 220, 190, 20);
    dragBg.strokeRoundedRect(-110, -95, 220, 190, 20);

    const dragImg = this.scene.add.image(0, -20, draggable.assetKey).setScale(0.85);
    const dragLabel = this.scene.add
      .text(0, 56, (this.language === 'en' && draggable.labelEn) ? draggable.labelEn : draggable.label, {
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '26px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.draggableContainer.add([dragBg, dragImg, dragLabel]);
    this.draggableContainer.setSize(220, 190);
    this.draggableContainer.setInteractive({
      draggable: true,
      useHandCursor: true,
    });

    this.container.add(this.draggableContainer);

    // 3. Drag & Tap Events (Toddler friendly: drag OR tap to complete!)
    let isDragging = false;
    let startPointerX = 0;
    let startPointerY = 0;

    this.draggableContainer.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isLocked) return;
      isDragging = false;
      startPointerX = pointer.x;
      startPointerY = pointer.y;
      AudioManager.playSound('tap');
    });

    this.draggableContainer.on('dragstart', () => {
      if (this.isLocked) return;
      isDragging = true;
      this.draggableContainer.setScale(1.18);
    });

    this.draggableContainer.on(
      'drag',
      (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (this.isLocked) return;
        isDragging = true;
        this.draggableContainer.x = dragX;
        this.draggableContainer.y = dragY;
      },
    );

    this.draggableContainer.on('dragend', () => {
      if (this.isLocked) return;
      this.draggableContainer.setScale(1);

      const targetRadius = 260;
      const dist = Phaser.Math.Distance.Between(
        this.draggableContainer.x,
        this.draggableContainer.y,
        target.targetPos.x,
        target.targetPos.y,
      );

      if (dist <= targetRadius) {
        this.handleSuccess();
      } else {
        this.handleMiss();
      }
    });

    // If toddler just taps the item without dragging, auto-glide to target!
    this.draggableContainer.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.isLocked) return;
      const moveDist = Phaser.Math.Distance.Between(pointer.x, pointer.y, startPointerX, startPointerY);
      if (!isDragging || moveDist < 25) {
        this.handleTapAutoMove();
      }
    });
  }

  private handleTapAutoMove() {
    if (this.isLocked) return;
    this.isLocked = true;
    this.draggableContainer.disableInteractive();
    AudioManager.playSound('drop');

    this.scene.tweens.add({
      targets: this.draggableContainer,
      x: this.config.target.targetPos.x,
      y: this.config.target.targetPos.y - 20,
      scale: 1.1,
      duration: 500,
      ease: 'Cubic.easeInOut',
      onComplete: () => {
        AudioManager.playSound('success');
        AudioManager.playSound('success');
        this.callback.onSuccess();
      },
    });
  }

  private handleSuccess() {
    this.isLocked = true;
    this.draggableContainer.disableInteractive();

    this.scene.tweens.add({
      targets: this.draggableContainer,
      x: this.config.target.targetPos.x,
      y: this.config.target.targetPos.y - 30,
      scale: 0.85,
      duration: 250,
      ease: 'Back.easeOut',
      onComplete: () => {
        AudioManager.playSound('success');
        this.callback.onSuccess();
      },
    });
  }

  private handleMiss() {
    AudioManager.playSound('wrong'); this.attempts += 1;
    this.scene.tweens.add({
      targets: this.draggableContainer,
      x: this.config.draggable.startPos.x,
      y: this.config.draggable.startPos.y,
      duration: 350,
      ease: 'Sine.easeOut',
    });
    this.callback.onFailAttempt(this.attempts);
  }

  public applyHint(level: number): void {
    if (level === 2) {
      this.targetGlow.setVisible(true);
      this.scene.tweens.add({
        targets: this.targetContainer,
        scale: 1.1,
        duration: 300,
        yoyo: true,
        repeat: 2,
      });
    } else if (level >= 3) {
      this.targetGlow.setVisible(true);
      if (!this.hintHand) {
        this.hintHand = this.scene.add
          .text(this.config.draggable.startPos.x, this.config.draggable.startPos.y - 50, '👆', {
            fontSize: '52px',
          })
          .setOrigin(0.5);
        this.container.add(this.hintHand);
      }
      this.hintHand.setVisible(true);
      this.scene.tweens.add({
        targets: this.hintHand,
        x: this.config.target.targetPos.x,
        y: this.config.target.targetPos.y - 30,
        duration: 900,
        repeat: -1,
      });
    }
  }
}
