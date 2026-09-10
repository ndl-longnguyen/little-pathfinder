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
  const [selectedWorldId, setSelectedWorldId] = useState<string>('forest');

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

        const next = LevelManager.getNextPlayableMission(savedProgress);
        if (next && next.worldId) {
          setSelectedWorldId(next.worldId);
        }
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

  const allMissions = LevelManager.getMissions();
  const worlds = LevelManager.getWorlds();
  const activeWorlds = worlds.filter((w) => w.status === 'active');
  const unlockedMissions = progress.unlockedMissions || progress.unlockedLevels || [1];
  const completedMissions = progress.completedMissions || progress.completedLevels || [];
  const nextPlayable = LevelManager.getNextPlayableMission(progress);

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
    whale: '🐋',
  };

  const displayedMissions =
    selectedWorldId === 'all'
      ? allMissions
      : allMissions.filter((m) => m.worldId === selectedWorldId);

  const selectedWorld = worlds.find((w) => w.id === selectedWorldId);

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />

        <div className="page-title-row">
          <div>
            <h1>Bản Đồ Thám Hiểm</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontWeight: 800 }}>
              Chạm vào màn chơi để giải cứu các bạn động vật đáng yêu!
            </p>
          </div>
          <span className="compact-status">
            Đã hoàn thành: {completedMissions.length}/{allMissions.length}
          </span>
        </div>

        {/* World Selection Tabs */}
        <div className="world-tabs-row" role="tablist" aria-label="Chọn thế giới thám hiểm">
          {activeWorlds.map((w) => {
            const worldMissions = allMissions.filter((m) => m.worldId === w.id);
            const doneCount = worldMissions.filter((m) => completedMissions.includes(m.id)).length;
            const isOcean = w.id === 'ocean';

            return (
              <button
                key={w.id}
                role="tab"
                aria-selected={selectedWorldId === w.id}
                onClick={() => setSelectedWorldId(w.id)}
                className={`world-tab-btn ${isOcean ? 'ocean' : ''} ${
                  selectedWorldId === w.id ? 'active' : ''
                }`}
              >
                <span>{w.icon}</span>
                <span>{w.name[settings.language] || w.name.vi}</span>
                <span className="world-tab-count">
                  {doneCount}/{worldMissions.length}
                </span>
              </button>
            );
          })}

          <button
            role="tab"
            aria-selected={selectedWorldId === 'all'}
            onClick={() => setSelectedWorldId('all')}
            className={`world-tab-btn ${selectedWorldId === 'all' ? 'active' : ''}`}
          >
            <span>🌟</span>
            <span>{settings.language === 'vi' ? 'Tất Cả Màn Chơi' : 'All Worlds'}</span>
            <span className="world-tab-count">
              {completedMissions.length}/{allMissions.length}
            </span>
          </button>
        </div>

        {/* World Map Section */}
        <section
          className={`world-map-card ${selectedWorldId === 'ocean' ? 'ocean-theme' : ''}`}
          aria-label={selectedWorld ? selectedWorld.name.vi : 'Bản đồ thế giới'}
        >
          <div className="world-map-header">
            <div className={`world-badge ${selectedWorldId === 'ocean' ? 'ocean' : ''}`}>
              <span style={{ fontSize: '1.4rem' }}>{selectedWorld?.icon ?? '🗺️'}</span>
              <span>
                {selectedWorld
                  ? selectedWorld.name[settings.language] || selectedWorld.name.vi
                  : settings.language === 'vi'
                  ? 'Tất Cả Các Màn Chơi'
                  : 'All Adventure Missions'}
              </span>
            </div>

            {selectedWorld && (
              <p
                style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  color: selectedWorldId === 'ocean' ? '#0369a1' : 'var(--leaf-deep)',
                  fontWeight: 800,
                  maxWidth: '520px',
                }}
              >
                {selectedWorld.description[settings.language] || selectedWorld.description.vi}
              </p>
            )}
          </div>

          <div className="map-nodes-container">
            {displayedMissions.map((mission) => {
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
                        ? `Đã giải cứu bạn thú! ${'⭐'.repeat(stars)}`
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
