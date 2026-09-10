'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { AudioManager } from '@/game/systems/AudioManager';
import { LevelManager } from '@/game/systems/LevelManager';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { AnimalData, Progress, Settings } from '@/game/types';

export default function AnimalHomePage() {
  const [progress, setProgress] = useState<Progress>(ProgressManager.defaultProgress);
  const [settings, setSettings] = useState<Settings>(ProgressManager.defaultSettings);
  const [activeAnimal, setActiveAnimal] = useState<AnimalData | null>(null);
  const [bounceId, setBounceId] = useState<string | null>(null);

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

    return () => {
      alive = false;
      window.removeEventListener('progress-changed', load);
    };
  }, []);

  const allAnimals = LevelManager.getAnimals();
  const allDecorations = LevelManager.getDecorations();
  const unlockedAnimals = progress.unlockedAnimals || [];
  const unlockedDecorations = progress.unlockedDecorations || [];

  const animalEmojis: Record<string, string> = {
    rabbit: '🐰',
    duck: '🦆',
    bear: '🐻',
    monkey: '🐵',
    panda: '🐼',
    dolphin: '🐬',
    turtle: '🐢',
    octopus: '🐙',
    crab: '🦀',
    whale: '🐳',
  };

  const decEmojis: Record<string, string> = {
    dec_red_flower: '🌺',
    dec_pond: '💧',
    dec_wood_bridge: '🪵',
    dec_bamboo_garden: '🎋',
    dec_honey_pot: '🍯',
    dec_rainbow_home: '🌈',
    dec_coral_pink: '🪸',
    dec_sea_shell: '🐚',
    dec_pearl_bubble: '🫧',
    dec_starfish: '⭐',
    dec_sea_castle: '🏰',
    dec_yellow_flower: '🌼',
    dec_green_flower: '🌱',
    dec_brown_house: '🏚️',
    dec_flower_pot: '🪴',
    dec_farm_flag: '🎏',
  };

  function handleAnimalTap(animal: AnimalData, isUnlocked: boolean) {
    if (!isUnlocked) {
      AudioManager.speak(
        settings.language === 'vi'
          ? `Bạn ${animal.nameVi} đang chờ bé đến cứu ở các màn chơi nhé!`
          : `${animal.nameEn} is waiting for you to rescue them in adventure missions!`,
        settings.language,
      );
      return;
    }

    setBounceId(animal.id);
    setActiveAnimal(animal);
    setTimeout(() => setBounceId(null), 500);

    const greeting =
      settings.language === 'vi'
        ? `Xin chào bé! Tớ là ${animal.nameVi}. ${animal.funFactVi ?? ''}`
        : `Hello! I am ${animal.nameEn}. ${animal.funFactEn ?? ''}`;

    AudioManager.speak(greeting, settings.language);
  }

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />

        <div className="page-title-row">
          <div>
            <h1>Ngôi Nhà Động Vật</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontWeight: 800 }}>
              Khu vườn bình yên nơi các bạn thú đã được cứu cùng sum vầy sinh sống!
            </p>
          </div>
          <span className="compact-status">
            Đã đón về: {unlockedAnimals.length}/{allAnimals.length} bạn thú
          </span>
        </div>

        {/* Rescued Animals Garden */}
        <section aria-label="Khu vườn động vật" className="animal-home-garden">
          {allAnimals.map((animal) => {
            const isUnlocked = unlockedAnimals.includes(animal.id);
            const isBouncing = bounceId === animal.id;

            return (
              <div
                className={`animal-card ${isUnlocked ? 'unlocked-animal' : 'locked-animal'}`}
                key={animal.id}
                onClick={() => handleAnimalTap(animal, isUnlocked)}
              >
                <div
                  className="animal-avatar"
                  style={{
                    transform: isBouncing ? 'scale(1.28) translateY(-18px)' : 'scale(1)',
                    transition: 'transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                >
                  <span className="animal-avatar-emoji">{animalEmojis[animal.id] ?? '🐾'}</span>
                </div>

                <h2 style={{ margin: '0 0 6px', color: 'var(--leaf-deep)', fontSize: '1.4rem' }}>
                  {settings.language === 'vi' ? animal.nameVi : animal.nameEn}
                </h2>

                <p style={{ margin: '0 0 10px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  {isUnlocked
                    ? settings.language === 'vi'
                      ? animal.personalityVi
                      : animal.personalityEn
                    : 'Đang chờ được cứu...'}
                </p>

                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    background: isUnlocked ? '#dcf5e3' : '#e2e7e7',
                    color: isUnlocked ? '#236b4c' : '#718086',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                  }}
                >
                  {isUnlocked ? 'Đã về nhà 🏡' : 'Chưa cứu 🔒'}
                </span>
              </div>
            );
          })}
        </section>

        {/* Selected Animal Fun Fact Dialogue Bubble */}
        {activeAnimal && (
          <section
            style={{
              border: '4px solid var(--sun)',
              borderRadius: '16px',
              padding: '18px 24px',
              background: '#fffdf7',
              boxShadow: 'var(--shadow)',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '5rem', lineHeight: 1, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.15))' }}>{animalEmojis[activeAnimal.id]}</div>
            <div>
              <h3 style={{ margin: '0 0 4px', color: 'var(--leaf-deep)' }}>
                {settings.language === 'vi' ? activeAnimal.nameVi : activeAnimal.nameEn} trò chuyện:
              </h3>
              <p style={{ margin: 0, color: '#1f2933', fontWeight: 800, fontSize: '1.05rem' }}>
                {settings.language === 'vi' ? activeAnimal.funFactVi : activeAnimal.funFactEn}
              </p>
            </div>
          </section>
        )}

        {/* Unlocked Decorations Shelf */}
        <section aria-label="Đồ trang trí khu rừng đã mở khóa">
          <h2 style={{ color: 'var(--leaf-deep)', margin: '24px 0 14px', fontSize: '1.5rem' }}>
            Vật Phẩm Trang Trí Khu Rừng ({unlockedDecorations.length}/{allDecorations.length})
          </h2>
          <div className="decorations-grid">
            {allDecorations.map((dec) => {
              const isUnlocked = unlockedDecorations.includes(dec.id);
              const emoji = decEmojis[dec.id] ?? '✨';

              return (
                <div
                  className="dec-item"
                  key={dec.id}
                  style={{ opacity: isUnlocked ? 1 : 0.45 }}
                >
                  <span style={{ fontSize: '3.2rem', lineHeight: 1, display: 'block', marginBottom: '6px' }}>{isUnlocked ? emoji : '🔒'}</span>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--leaf-deep)', fontSize: '0.95rem' }}>
                      {dec.name[settings.language] || dec.name.vi}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 800 }}>
                      {isUnlocked ? 'Đã trang trí' : 'Khóa'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
