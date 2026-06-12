import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { LevelScene } from './scenes/LevelScene';
import { PreloadScene } from './scenes/PreloadScene';
import { RewardScene } from './scenes/RewardScene';
import { GAME_HEIGHT, GAME_WIDTH } from './systems/ResponsiveScale';

export function createPhaserGame(parent: HTMLElement, levelId: number) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: '#a8def2',
    input: {
      activePointers: 4,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
      new BootScene(levelId),
      new PreloadScene(),
      new LevelScene(),
      new RewardScene(),
    ],
  });

  return {
    destroy() {
      game.destroy(true);
    },
  };
}
