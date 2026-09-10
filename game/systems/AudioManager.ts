import { ProgressManager } from './ProgressManager';
import type { Language } from '../types';

export class AudioManager {
  private static audioCtx: AudioContext | null = null;

  private static getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!AudioManager.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        AudioManager.audioCtx = new AudioCtxClass();
      }
    }
    if (AudioManager.audioCtx && AudioManager.audioCtx.state === 'suspended') {
      void AudioManager.audioCtx.resume();
    }
    return AudioManager.audioCtx;
  }

  /**
   * Play instant tactile sound effects for children
   */
  static playSound(type: 'tap' | 'success' | 'cheer' | 'pop' | 'drop' | 'wrong'): void {
    try {
      const ctx = AudioManager.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tap' || type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'drop') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        // Cheerful ascending chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, now + idx * 0.08);
          g.gain.setValueAtTime(0.18, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.2);
        });
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'cheer') {
        const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        fanfare.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.07);
          g.gain.setValueAtTime(0.2, now + idx * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + idx * 0.07);
          o.stop(now + idx * 0.07 + 0.28);
        });
      }
    } catch {
      // AudioContext fallback ignored safely
    }
  }

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
