import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor(private readonly levelId: number) {
    super('BootScene');
  }

  create() {
    this.scene.start('PreloadScene', { levelId: this.levelId });
  }
}
