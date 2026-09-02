'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { LevelManager } from '@/game/systems/LevelManager';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Progress, Settings } from '@/game/types';

export default function WorldMapPage() {
  const [progress, setProgress] = useState<Progress>(ProgressManager.defaultProgress);
  const [settings, setSettings] = useState<Settings>(ProgressManager.defaultSettings);

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

  const missions = LevelManager.getMissions();
  const worlds = LevelManager.getWorlds();
  const unlockedMissions = progress.unlockedMissions || progress.unlockedLevels || [1];
  const completedMissions = progress.completedMissions || progress.completedLevels || [];
  const nextPlayable = LevelManager.getNextPlayableMission(progress);

  const animalEmojis: Record<string, string> = {
    rabbit: '🐰',
    duck: '🦆',
    bear: '🐻',
    monkey: '🐵',
    panda: '🐼',
  };

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />

        <div className="page-title-row">
          <div>
            <h1>Bản Đồ Thế Giới</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontWeight: 800 }}>
              Chạm vào nhiệm vụ để bắt đầu giải cứu các bạn thú!
            </p>
          </div>
          <span className="compact-status">
            Đã hoàn thành: {completedMissions.length}/{missions.length}
          </span>
        </div>

        {/* Active World 1: Happy Forest Map */}
        <section className="world-map-card" aria-label="Bản đồ Rừng Vui Vẻ">
          <div className="world-map-header">
            <div className="world-badge">
              <span style={{ fontSize: '1.4rem' }}>🌲</span>
              <span>Thế Giới 1: Rừng Vui Vẻ (Happy Forest)</span>
            </div>
            {completedMissions.length === missions.length && (
              <span className="world-badge" style={{ background: '#ffd36a', borderColor: '#c9812f' }}>
                🎉 ĐÃ KHÔI PHỤC TOÀN BỘ RỪNG!
              </span>
            )}
          </div>

          <div className="map-nodes-container">
            {missions.map((mission) => {
              const isCompleted = completedMissions.includes(mission.id);
              const isUnlocked = unlockedMissions.includes(mission.id);
              const isCurrent = mission.id === nextPlayable.id && !isCompleted;
              const emoji = animalEmojis[mission.animalId] || '🐾';
              const stars = progress.stars?.[mission.id] || (isCompleted ? 3 : 0);

              const cardContent = (
                <div
                  className={`map-node-card ${
                    isCompleted ? 'completed' : isCurrent ? 'current' : isUnlocked ? 'unlocked' : 'locked'
                  }`}
                >
                  <div className="node-icon-circle">
                    {isCompleted ? '⭐' : isUnlocked ? emoji : '🔒'}
                  </div>
                  <div className="node-info">
                    <h3>
                      Màn {mission.id}: {mission.title[settings.language] || mission.title.vi}
                    </h3>
                    <p>
                      {isCompleted
                        ? `Đã cứu bạn thú! ${'⭐'.repeat(stars)}`
                        : isCurrent
                        ? 'Nhiệm vụ tiếp theo cần bạn giúp!'
                        : isUnlocked
                        ? 'Sẵn sàng giải cứu'
                        : 'Chưa mở khóa'}
                    </p>
                  </div>
                  <div>
                    {isCompleted ? (
                      <span className="node-status-tag done">Chơi lại ↺</span>
                    ) : isCurrent ? (
                      <span className="node-status-tag play">CHƠI NGAY 🚀</span>
                    ) : isUnlocked ? (
                      <span className="node-status-tag play">Bắt đầu</span>
                    ) : (
                      <span className="node-status-tag lock">Khóa</span>
                    )}
                  </div>
                </div>
              );

              if (isUnlocked) {
                return (
                  <Link
                    href={`/game?level=${mission.id}`}
                    key={mission.id}
                    style={{ textDecoration: 'none' }}
                  >
                    {cardContent}
                  </Link>
                );
              }

              return <div key={mission.id}>{cardContent}</div>;
            })}
          </div>
        </section>

        {/* Future Worlds Preview */}
        <section aria-label="Các thế giới tiếp theo">
          <h2 style={{ color: 'var(--leaf-deep)', margin: '24px 0 16px', fontSize: '1.6rem' }}>
            Các Thế Giới Tương Lai (Coming Soon)
          </h2>
          <div className="future-worlds-grid">
            {worlds
              .filter((w) => w.status === 'coming_soon')
              .map((w) => (
                <div className="future-card" key={w.id}>
                  <div className="future-icon">{w.icon}</div>
                  <h3 style={{ margin: '0 0 6px', color: 'var(--leaf-deep)' }}>
                    {w.name[settings.language] || w.name.vi}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {w.description[settings.language] || w.description.vi}
                  </p>
                  <span className="future-badge">Sắp ra mắt</span>
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
