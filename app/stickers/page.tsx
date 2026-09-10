'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import stickers from '@/data/stickers.json';
import { AudioManager } from '@/game/systems/AudioManager';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Progress, Settings, StickerData } from '@/game/types';
import { pick, STICKERS } from '@/lib/i18n';

const allStickers = stickers as StickerData[];
const stickerEmojis: Record<string, string> = {
  sticker_rabbit_01: '🐰',
  sticker_carrot_01: '🥕',
  sticker_duck_01: '🦆',
  sticker_banana_01: '🍌',
  sticker_bridge_01: '🌉',
  sticker_blue_home_01: '🏠',
  sticker_bamboo_01: '🎋',
  sticker_flower_path_01: '🌸',
  sticker_tree_path_01: '🌲',
  sticker_honey_01: '🍯',
  sticker_green_home_01: '🏡',
  sticker_fish_01: '🐟',
  sticker_wood_bridge_01: '🪵',
  sticker_yellow_home_01: '🏰',
  sticker_cave_path_01: '🪨',
  sticker_panda_bridge_01: '🐼',
  sticker_pond_path_01: '💧',
  sticker_rope_bridge_01: '🪢',
  sticker_bamboo_path_01: '🎍',
  sticker_brown_home_01: '🛖',
  sticker_dolphin_01: '🐬',
  sticker_turtle_01: '🐢',
  sticker_octopus_01: '🐙',
  sticker_crab_01: '🦀',
  sticker_whale_01: '🐳',
  sticker_seashell_01: '🐚',
};


export default function StickersPage() {
  const [progress, setProgress] = useState<Progress>(ProgressManager.defaultProgress);
  const [settings, setSettings] = useState<Settings>(ProgressManager.defaultSettings);
  const [selectedSticker, setSelectedSticker] = useState<StickerData | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      const [savedProgress, savedSettings] = await Promise.all([
        ProgressManager.getProgress(),
        ProgressManager.getSettings(),
      ]);

      if (alive) {
        setProgress(savedProgress);
        setSettings(savedSettings);
      }
    }

    void load();
    window.addEventListener('progress-changed', load);
    window.addEventListener('settings-changed', load);

    return () => {
      alive = false;
      window.removeEventListener('progress-changed', load);
      window.removeEventListener('settings-changed', load);
    };
  }, []);

  function handleStickerTap(sticker: StickerData, isUnlocked: boolean) {
    if (!isUnlocked) {
      AudioManager.speak(
        settings.language === 'vi'
          ? 'Huy hiệu này đang được giấu kín. Hãy hoàn thành nhiệm vụ để mở khóa nhé!'
          : 'This sticker is locked. Complete rescue missions to discover it!',
        settings.language,
      );
      return;
    }

    setSelectedSticker(sticker);
    const fact =
      settings.language === 'vi'
        ? `${sticker.name}! ${sticker.factVi ?? ''}`
        : `${sticker.name}! ${sticker.factEn ?? ''}`;

    AudioManager.speak(fact, settings.language);
  }

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />

        <div className="page-title-row">
          <div>
            <h1>Bộ Sưu Tập Sticker</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontWeight: 800 }}>
              Chạm vào huy hiệu đã thu thập để nghe sự thật kỳ diệu!
            </p>
          </div>
          <span className="compact-status">
            Đã sưu tầm: {progress.unlockedStickers.length}/{allStickers.length}
          </span>
        </div>

        {/* Selected Sticker Detail Preview Card */}
        {selectedSticker && (
          <section
            style={{
              border: '4px solid var(--sun)',
              borderRadius: '20px',
              padding: '20px 24px',
              background: '#fffdf7',
              boxShadow: 'var(--shadow)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '18px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="sticker-art" style={{ width: '96px', height: '96px', margin: 0 }}><span style={{ fontSize: '4.8rem', lineHeight: 1 }}>{stickerEmojis[selectedSticker.id] ?? "⭐"}</span></div>
              <div>
                <h3 style={{ margin: '0 0 4px', color: 'var(--leaf-deep)', fontSize: '1.4rem' }}>
                  {selectedSticker.name}
                </h3>
                <p style={{ margin: 0, color: '#1f2933', fontWeight: 800, fontSize: '1.05rem' }}>
                  {settings.language === 'vi' ? selectedSticker.factVi : selectedSticker.factEn}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="kid-button secondary"
              onClick={() => setSelectedSticker(null)}
              style={{ minHeight: '44px', padding: '8px 16px' }}
            >
              Đóng ✕
            </button>
          </section>
        )}

        {/* Sticker Grid */}
        <section className="sticker-grid" aria-label="Danh sách sticker">
          {allStickers.map((sticker) => {
            const unlocked = progress.unlockedStickers.includes(sticker.id);
            return (
              <article
                className={`sticker-card ${unlocked ? 'unlocked' : 'locked'}`}
                key={sticker.id}
                onClick={() => handleStickerTap(sticker, unlocked)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <div aria-hidden="true" className="sticker-art"><span className="sticker-emoji">{unlocked ? (stickerEmojis[sticker.id] ?? "⭐") : "🔒"}</span></div>
                  <h2>{unlocked ? sticker.name : 'Bí Mật'}</h2>
                  <p>{unlocked ? sticker.category : 'Vượt qua thử thách'}</p>
                </div>
                <span className="compact-status">
                  {unlocked ? 'Đã sưu tầm ✨' : 'Chưa mở 🔒'}
                </span>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
