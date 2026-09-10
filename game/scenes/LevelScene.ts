import * as Phaser from 'phaser';
import { BaseMechanic } from '../mechanics/BaseMechanic';
import { MechanicFactory } from '../mechanics/MechanicFactory';
import { AudioManager } from '../systems/AudioManager';
import { LevelManager } from '../systems/LevelManager';
import { ProgressManager } from '../systems/ProgressManager';
import { GAME_HEIGHT, GAME_WIDTH } from '../systems/ResponsiveScale';
import type { Language, LevelSceneInitData, MissionConfig } from '../types';

const successEncouragements = {
  vi: ['Giỏi quá!', 'Đúng rồi, tuyệt vời!', 'Bé giỏi lắm!'],
  en: ['Great job!', 'You did it!', 'Awesome!'],
} as const;

const animalEmojiMap: Record<string, string> = {
  rabbit: '🐰',
  duck: '🦆',
  bear: '🐻',
  monkey: '🐵',
  panda: '🐼',
  dolphin: '🐬',
  turtle: '🐢',
  octopus: '🐙',
  crab: '🦀',
  whale: '🐋',
};

const retryPhrases = {
  vi: 'Gần đúng rồi, mình thử lại nhé!',
  en: 'Almost there, let us try again!',
} as const;

export class LevelScene extends Phaser.Scene {
  private mission: MissionConfig = LevelManager.getFirstMission();
  private challengeIndex = 0;
  private language: Language = 'vi';
  private currentMechanic: BaseMechanic | null = null;
  private instructionLabel: Phaser.GameObjects.Text | null = null;
  private progressLabel: Phaser.GameObjects.Text | null = null;
  private animalSprite: Phaser.GameObjects.Image | null = null;
  private storyModalContainer: Phaser.GameObjects.Container | null = null;
  private attempts = 0;

  constructor() {
    super('LevelScene');
  }

  init(data: LevelSceneInitData) {
    const found = LevelManager.getMissionById(data.levelId);
    this.mission = found ?? LevelManager.getFirstMission();
    this.challengeIndex = 0;
    this.attempts = 0;
    this.currentMechanic = null;
  }

  create() {
    // 1. Render Background
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.mission.backgroundKey);

    // 2. Top Navigation Bar
    this.createTopBar();

    // 3. Instruction Panel
    this.createInstructionPanel();

    // 4. Animal Companion
    this.createAnimalCompanion();

    // 5. Load Settings & Story Intro
    void ProgressManager.getSettings().then((settings) => {
      this.language = settings.language;
      this.showStoryIntro();
    });
  }

  private createTopBar() {
    // Home / Back Button
    this.createIconButton(110, 76, '🗺️ Bản Đồ', () => {
      AudioManager.stop();
      window.location.href = '/levels';
    });

    // Progress Badge
    const badgeBg = this.add.graphics();
    badgeBg.fillStyle(0xffffff, 0.9);
    badgeBg.lineStyle(4, 0x236b4c, 0.4);
    badgeBg.fillRoundedRect(320, 48, 260, 56, 14);
    badgeBg.strokeRoundedRect(320, 48, 260, 56, 14);

    this.progressLabel = this.add
      .text(450, 76, '', {
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.updateProgressLabel();

    // Sound Speaker Toggle
    this.createIconButton(790, 76, '🏠 Trang Chủ', () => {
      AudioManager.stop();
      window.location.href = '/';
    });
  }

  private createIconButton(x: number, y: number, label: string, onClick: () => void) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.92);
    bg.lineStyle(4, 0x236b4c, 0.8);
    bg.fillRoundedRect(-80, -28, 160, 56, 12);
    bg.strokeRoundedRect(-80, -28, 160, 56, 12);

    const text = this.add
      .text(0, 0, label, {
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(160, 56);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-80, -28, 160, 56),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on('pointerdown', onClick);
  }

  private createInstructionPanel() {
    const panel = this.add.graphics();
    panel.fillStyle(0xfff9ec, 0.96);
    panel.lineStyle(5, 0x236b4c, 0.35);
    panel.fillRoundedRect(60, 130, 780, 170, 22);
    panel.strokeRoundedRect(60, 130, 780, 170, 22);

    this.instructionLabel = this.add
      .text(GAME_WIDTH / 2, 215, '', {
        align: 'center',
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '32px',
        fontStyle: 'bold',
        lineSpacing: 6,
        wordWrap: { width: 720 },
      })
      .setOrigin(0.5);
  }

  private createAnimalCompanion() {
    const animal = LevelManager.getAnimalById(this.mission.animalId);
    const animalKey = animal?.assetKey ?? this.mission.animalId;

    this.animalSprite = this.add.image(GAME_WIDTH / 2, 490, animalKey).setScale(1.25);

    // Idle breathing & gentle bounce animation
    this.tweens.add({
      targets: this.animalSprite,
      y: 476,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private showStoryIntro() {
    const story = this.mission.story;
    const text = story.introText[this.language];

    this.storyModalContainer = this.add.container(0, 0);

    // Dim background
    const overlay = this.add.graphics();
    overlay.fillStyle(0x0f2d25, 0.65);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Modal Box
    const box = this.add.graphics();
    box.fillStyle(0xfff9ec, 0.98);
    box.lineStyle(6, 0x236b4c, 0.5);
    box.fillRoundedRect(70, 320, 760, 800, 30);
    box.strokeRoundedRect(70, 320, 760, 800, 30);

    // Title
    const missionTitle = `${animalEmojiMap[this.mission.animalId] ?? '🐾'} ${this.mission.title[this.language]}`;
    const titleText = this.add
      .text(GAME_WIDTH / 2, 400, missionTitle, {
        align: 'center',
        color: '#174c39',
        fontFamily: 'Arial',
        fontSize: '44px',
        fontStyle: 'bold',
        wordWrap: { width: 680 },
      })
      .setOrigin(0.5);

    // Animal Illustration in modal
    const animal = LevelManager.getAnimalById(this.mission.animalId);
    const emoji = animalEmojiMap[this.mission.animalId] ?? '🐾';
    const modalImg = this.add.image(GAME_WIDTH / 2, 570, animal?.assetKey ?? 'rabbit').setScale(1.35);

    // Story Text
    const storyText = this.add
      .text(GAME_WIDTH / 2, 770, text, {
        align: 'center',
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '32px',
        fontStyle: 'bold',
        lineSpacing: 10,
        wordWrap: { width: 660 },
      })
      .setOrigin(0.5);

    // Start Mission CTA Button
    const btnLabel = this.language === 'vi' ? 'BẮT ĐẦU NGAY 🚀' : 'START NOW 🚀';
    const btnContainer = this.add.container(GAME_WIDTH / 2, 990);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffd36a, 1);
    btnBg.lineStyle(6, 0xc9812f, 1);
    btnBg.fillRoundedRect(-170, -48, 340, 96, 18);
    btnBg.strokeRoundedRect(-170, -48, 340, 96, 18);

    const btnText = this.add
      .text(0, 0, btnLabel, {
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '38px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    btnContainer.add([btnBg, btnText]);
    btnContainer.setSize(340, 96);
    btnContainer.setInteractive(
      new Phaser.Geom.Rectangle(-170, -48, 340, 96),
      Phaser.Geom.Rectangle.Contains,
    );

    btnContainer.on('pointerdown', () => {
      this.tweens.add({
        targets: this.storyModalContainer,
        alpha: 0,
        scale: 0.95,
        duration: 250,
        onComplete: () => {
          this.storyModalContainer?.destroy();
          this.storyModalContainer = null;
          this.startChallenge(0);
        },
      });
    });

    this.storyModalContainer.add([overlay, box, titleText, modalImg, storyText, btnContainer]);

    // Speak story intro voice
    void AudioManager.play(story.introAudio, text, this.language);
  }

  private updateProgressLabel() {
    const total = this.mission.challenges.length;
    const current = Math.min(this.challengeIndex + 1, total);
    const label =
      this.language === 'vi' ? `🎯 Thử thách ${current}/${total}` : `🎯 Challenge ${current}/${total}`;
    this.progressLabel?.setText(label);
  }

  private startChallenge(index: number) {
    this.challengeIndex = index;
    this.attempts = 0;
    this.updateProgressLabel();

    if (this.currentMechanic) {
      this.currentMechanic.destroy();
      this.currentMechanic = null;
    }

    const challenge = this.mission.challenges[index];
    if (!challenge) {
      this.handleMissionVictory();
      return;
    }

    // Set instruction text & voice
    const emoji = animalEmojiMap[this.mission.animalId] ?? '🐾';
    const promptText = challenge.prompt[this.language];
    this.instructionLabel?.setText(`${emoji} ${promptText}`);
    void AudioManager.play(challenge.instructionAudio, promptText, this.language);

    // Create mechanic
    this.currentMechanic = MechanicFactory.create(
      this,
      challenge,
      this.language,
      {
        onSuccess: () => this.handleChallengeSuccess(),
        onFailAttempt: (attemptCount) => this.handleChallengeFail(attemptCount),
      },
    );
  }

  private handleChallengeSuccess() {
    // Happy reaction from animal companion
    if (this.animalSprite) {
      this.tweens.add({
        targets: this.animalSprite,
        y: '-=50',
        scale: 1.25,
        duration: 200,
        yoyo: true,
        ease: 'Back.easeOut',
      });
    }

    this.showMiniConfetti();

    // Voice praise
    const phrases = successEncouragements[this.language];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    void AudioManager.play(undefined, phrase, this.language);

    // Record learning progress
    const challenge = this.mission.challenges[this.challengeIndex];
    if (challenge?.skills) {
      for (const skill of challenge.skills) {
        void ProgressManager.recordSkillProgress(skill);
      }
    }

    const nextIndex = this.challengeIndex + 1;
    if (nextIndex < this.mission.challenges.length) {
      this.time.delayedCall(1100, () => {
        this.startChallenge(nextIndex);
      });
    } else {
      this.time.delayedCall(1200, () => {
        this.handleMissionVictory();
      });
    }
  }

  private handleChallengeFail(attemptCount: number) {
    this.attempts = attemptCount;
    void AudioManager.play(undefined, retryPhrases[this.language], this.language);

    if (this.attempts >= 3) {
      this.currentMechanic?.applyHint(3);
    } else if (this.attempts >= 2) {
      this.currentMechanic?.applyHint(2);
    }
  }

  private handleMissionVictory() {
    if (this.currentMechanic) {
      this.currentMechanic.destroy();
      this.currentMechanic = null;
    }

    this.showGrandCelebration();

    const successText = this.mission.story.successText[this.language];
    this.instructionLabel?.setText(successText);
    void AudioManager.play(this.mission.story.successAudio, successText, this.language);

    const allSkills = this.mission.challenges.flatMap((c) => c.skills);
    void ProgressManager.completeMission(this.mission.id, this.mission.reward, allSkills).then(() => {
      this.time.delayedCall(1600, () => {
        this.scene.start('RewardScene', { levelId: this.mission.id });
      });
    });
  }

  private showMiniConfetti() {
    const colors = [0xffd36a, 0xee7566, 0x3d8ed8, 0x74c76b];
    for (let i = 0; i < 20; i += 1) {
      const dot = this.add.circle(GAME_WIDTH / 2, 460, 9, colors[i % colors.length]);
      this.tweens.add({
        targets: dot,
        alpha: 0,
        x: GAME_WIDTH / 2 + Phaser.Math.Between(-280, 280),
        y: Phaser.Math.Between(260, 700),
        duration: 900,
        ease: 'Cubic.easeOut',
        onComplete: () => dot.destroy(),
      });
    }
  }

  private showGrandCelebration() {
    const colors = [0xffd36a, 0xee7566, 0x3d8ed8, 0x74c76b, 0xffffff];
    for (let i = 0; i < 50; i += 1) {
      const dot = this.add.circle(GAME_WIDTH / 2, 450, 10, colors[i % colors.length]);
      this.tweens.add({
        targets: dot,
        alpha: 0,
        angle: Phaser.Math.Between(0, 360),
        duration: Phaser.Math.Between(1100, 1600),
        ease: 'Cubic.easeOut',
        x: GAME_WIDTH / 2 + Phaser.Math.Between(-400, 400),
        y: Phaser.Math.Between(150, 1100),
        onComplete: () => dot.destroy(),
      });
    }
  }
}
