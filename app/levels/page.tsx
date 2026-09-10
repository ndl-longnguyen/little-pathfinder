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
  const [freeMode, setFreeMode] = useState<boolean>(false);

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
    whale: '🐳',
    cow: '🐄',
    hen: '🐓',
    sheep: '🐑',
    pig: '🐷',
    bee: '🐝',
    farm_party: '🌻',
  };

  const missionTargetEmojis: Record<number, string> = {
    1: '🥕',
    2: '⛵',
    3: '🍯',
    4: '🍌',
    5: '🎋',
    6: '🏡',
    7: '🫧',
    8: '🌿',
    9: '🦪',
    10: '🧴',
    11: '🐳',
    12: '🏰',
    13: '🥛',
    14: '🪺',
    15: '🌾',
    16: '🌽',
    17: '🍯',
    18: '🌻',
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
            <h1>Bản Đồ Thám Hiểm 🗺️</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontWeight: 800, fontSize: '1.05rem' }}>
              Chạm vào bất kỳ màn chơi nào để giải cứu các bạn thú đáng yêu!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="compact-status">
              ⭐ Đã hoàn thành: {completedMissions.length}/{allMissions.length}
            </span>
            <button
              onClick={() => setFreeMode(!freeMode)}
              style={{
                background: freeMode ? '#dcfce7' : '#ffffff',
                border: freeMode ? '2px solid #16a34a' : '2px dashed rgba(35, 107, 76, 0.4)',
                color: freeMode ? '#15803d' : 'var(--leaf-deep)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
              title="Bật/tắt mở khóa tự do tất cả các màn để trải nghiệm nhanh"
            >
              <span>{freeMode ? '🔓' : '🗝️'}</span>
              <span>{freeMode ? 'Chế độ mở tất cả màn: BẬT' : 'Mở tất cả màn để trải nghiệm'}</span>
            </button>
          </div>
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
                <span style={{ fontSize: '1.25rem' }}>{w.icon}</span>
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
            <span style={{ fontSize: '1.25rem' }}>🌟</span>
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
              const isUnlocked = freeMode || unlockedMissions.includes(mission.id);
              const isCurrent = mission.id === nextPlayable.id && !isCompleted;
              const emoji = animalEmojis[mission.animalId] || '🐾';
              const targetEmoji = missionTargetEmojis[mission.id] || '✨';
              const stars = progress.stars?.[mission.id] || (isCompleted ? 3 : 0);

              const cardContent = (
                <div
                  className={`map-node-card ${
                    isCompleted ? 'completed' : isCurrent ? 'current' : isUnlocked ? 'unlocked' : 'locked'
                  }`}
                >
                  <div className="node-icon-circle" style={{ position: 'relative' }}>
                    <span
                      style={{
                        fontSize: '3.4rem',
                        lineHeight: 1,
                        filter: !isUnlocked ? 'grayscale(0.15) opacity(0.85)' : 'none',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      {emoji}
                    </span>
                    {isCompleted && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          background: '#ffd36a',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '0.95rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          border: '2.5px solid #ffffff',
                        }}
                        title="Đã hoàn thành xuất sắc"
                      >
                        ⭐
                      </span>
                    )}
                    {!isUnlocked && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          background: '#64748b',
                          color: '#ffffff',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '0.85rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                          border: '2.5px solid #ffffff',
                        }}
                        title="Chưa mở khóa"
                      >
                        🔒
                      </span>
                    )}
                  </div>
                  <div className="node-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0 }}>
                        Màn {mission.id}: {mission.title[settings.language] || mission.title.vi}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          background: 'rgba(35, 107, 76, 0.08)',
                          color: 'var(--leaf-deep)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {targetEmoji} Thử thách
                      </span>
                    </div>
                    <p style={{ marginTop: '4px' }}>
                      {isCompleted
                        ? `Đã giải cứu thành công! ${'⭐'.repeat(stars)}`
                        : isCurrent
                        ? 'Nhiệm vụ tiếp theo đang chờ bé giải cứu!'
                        : isUnlocked
                        ? 'Sẵn sàng bắt đầu giải cứu bạn thú'
                        : 'Bấm để mở khóa chơi thử ngay'}
                    </p>
                  </div>
                  <div>
                    {isCompleted ? (
                      <span className="node-status-tag done">Chơi lại ↺</span>
                    ) : isCurrent ? (
                      <span className="node-status-tag play">CHƠI NGAY 🚀</span>
                    ) : isUnlocked ? (
                      <span className="node-status-tag play">Bắt đầu 🎯</span>
                    ) : (
                      <span className="node-status-tag lock">Chơi thử 🎮</span>
                    )}
                  </div>
                </div>
              );

              return (
                <Link
                  href={`/game?level=${mission.id}`}
                  key={mission.id}
                  style={{
                    textDecoration: 'none',
                    display: 'block',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  aria-label={`Vào màn chơi ${mission.id}: ${mission.title[settings.language] || mission.title.vi}`}
                >
                  {cardContent}
                </Link>
              );
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
