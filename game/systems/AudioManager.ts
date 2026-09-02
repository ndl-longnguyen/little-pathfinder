import { ProgressManager } from './ProgressManager';
import type { Language } from '../types';

export class AudioManager {
  private static currentAudio: HTMLAudioElement | null = null;
  private static isSpeaking = false;

  static stop() {
    if (AudioManager.currentAudio) {
      AudioManager.currentAudio.pause();
      AudioManager.currentAudio.currentTime = 0;
      AudioManager.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      AudioManager.isSpeaking = false;
    }
  }

  static async play(path: string | undefined, fallbackText: string, language: Language): Promise<void> {
    const settings = await ProgressManager.getSettings();
    if (!settings.sound) {
      return;
    }

    AudioManager.stop();

    if (!path || typeof window === 'undefined') {
      AudioManager.speak(fallbackText, language);
      return;
    }

    let usedFallback = false;
    const useFallback = () => {
      if (!usedFallback) {
        usedFallback = true;
        AudioManager.speak(fallbackText, language);
      }
    };

    try {
      const audio = new Audio(path);
      AudioManager.currentAudio = audio;

      audio.onended = () => {
        if (AudioManager.currentAudio === audio) {
          AudioManager.currentAudio = null;
        }
      };

      audio.onerror = () => {
        useFallback();
      };

      await audio.play();
    } catch {
      useFallback();
    }
  }

  static speak(text: string, language: Language): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
      utterance.rate = 0.88;
      utterance.pitch = 1.1;

      utterance.onend = () => {
        AudioManager.isSpeaking = false;
      };

      utterance.onerror = () => {
        AudioManager.isSpeaking = false;
      };

      AudioManager.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    } catch {
      AudioManager.isSpeaking = false;
    }
  }

  /**
   * Safe check if browser audio is unlocked
   */
  static isSpeechActive(): boolean {
    return AudioManager.isSpeaking;
  }
}
