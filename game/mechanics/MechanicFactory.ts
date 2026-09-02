import * as Phaser from 'phaser';
import type { ChallengeConfig, Language } from '../types';
import { BaseMechanic, type MechanicCallback } from './BaseMechanic';
import { ChooseMechanic } from './ChooseMechanic';
import { DragDropMechanic } from './DragDropMechanic';
import { FindObjectMechanic } from './FindObjectMechanic';
import { CountingMechanic } from './CountingMechanic';

export class MechanicFactory {
  static create(
    scene: Phaser.Scene,
    challenge: ChallengeConfig,
    language: Language,
    callback: MechanicCallback,
  ): BaseMechanic {
    switch (challenge.mechanic) {
      case 'choose':
        return new ChooseMechanic(scene, challenge, language, callback);
      case 'drag_drop':
        return new DragDropMechanic(scene, challenge, language, callback);
      case 'find_object':
        return new FindObjectMechanic(scene, challenge, language, callback);
      case 'counting':
        return new CountingMechanic(scene, challenge, language, callback);
      default:
        // Fallback to choose mechanic for safety
        return new ChooseMechanic(scene, challenge as any, language, callback);
    }
  }
}
