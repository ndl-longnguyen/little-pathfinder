import { ProgressManager } from './ProgressManager';
import type { Language } from '../types';

export class AudioManager {
  private static currentAudio: HTMLAudioElement | null = null;

  static stop() {
    if (AudioManager.currentAudio) {
      AudioManager.currentAudio.pause();
      AudioManager.currentAudio.currentTime = 0;
      AudioManager.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  static async play(path: string | undefined, fallbackText: string, language: Language) {
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

    const audio = new Audio(path);
    AudioManager.currentAudio = audio;
    audio.onended = () => {
      if (AudioManager.currentAudio === audio) {
        AudioManager.currentAudio = null;
      }
    };
    audio.onerror = useFallback;

    try {
      await audio.play();
    } catch {
      useFallback();
    }
  }

  private static speak(text: string, language: Language) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = 0.86;
    utterance.pitch = 1.12;
    window.speechSynthesis.speak(utterance);
  }
}
