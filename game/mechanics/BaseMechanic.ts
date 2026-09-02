import * as Phaser from 'phaser';
import type { Language } from '../types';

export interface MechanicCallback {
  onSuccess: () => void;
  onFailAttempt: (attemptCount: number) => void;
}

export abstract class BaseMechanic {
  protected scene: Phaser.Scene;
  protected container: Phaser.GameObjects.Container;
  protected language: Language;
  protected callback: MechanicCallback;
  protected attempts = 0;
  protected isLocked = false;

  constructor(scene: Phaser.Scene, language: Language, callback: MechanicCallback) {
    this.scene = scene;
    this.language = language;
    this.callback = callback;
    this.container = scene.add.container(0, 0);
  }

  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  public setLanguage(lang: Language) {
    this.language = lang;
  }

  /**
   * Kích hoạt gợi ý thông minh cấp 1, 2, 3 tùy theo số lần chọn sai
   * level 1: rung nhẹ
   * level 2: nhấp nháy / nảy nhẹ đáp án đúng
   * level 3: viền vàng rực rỡ + bàn tay chỉ dẫn
   */
  public abstract applyHint(level: number): void;

  public destroy(): void {
    this.container.destroy(true);
  }
}
