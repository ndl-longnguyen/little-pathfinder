'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { LinkButton } from '@/components/Button';
import { LevelManager } from '@/game/systems/LevelManager';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Progress } from '@/game/types';

export default function HomePage() {
  const [progress, setProgress] = useState<Progress>(ProgressManager.defaultProgress);
  const [companionBounce, setCompanionBounce] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      const saved = await ProgressManager.getProgress();
      if (alive) {
        setProgress(saved);
      }
    }

    void load();
    window.addEventListener('progress-changed', load);

    return () => {
      alive = false;
      window.removeEventListener('progress-changed', load);
    };
  }, []);

  const nextMission = useMemo(
    () => LevelManager.getNextPlayableMission(progress),
    [progress],
  );

  const completedMissionsCount = progress.completedMissions?.length ?? progress.completedLevels.length;
  const unlockedAnimalsCount = progress.unlockedAnimals?.length ?? 0;
  const totalMissions = LevelManager.getMissions().length;
  const totalAnimals = LevelManager.getAnimals().length;

  function handleTapCompanion() {
    setCompanionBounce(true);
    setTimeout(() => setCompanionBounce(false), 600);
  }

  return (
    <main className="home-scene">
      <div className="home-layout">
        <section className="home-copy" aria-labelledby="home-title">
          <div className="world-badge">
            <span>🌲</span>
            <span>Thế giới: Rừng Vui Vẻ</span>
          </div>

          <h1 className="home-title" id="home-title">
            Animal Rescue Adventure
          </h1>

          <p className="home-subtitle">
            Cùng các bạn thú vượt qua thử thách, sửa cầu, tìm thức ăn và khôi phục lại khu rừng xanh ngát!
          </p>

          {/* Primary Big Call To Action */}
          <div>
            <Link
              href={`/game?level=${nextMission.id}`}
              className="cta-continue"
              aria-label="Tiếp tục cuộc phiêu lưu"
            >
              <span>🚀</span>
              <span>TIẾP TỤC CUỘC PHIÊU LƯU</span>
            </Link>
          </div>

          {/* Progress Indicators */}
          <div className="home-progress" aria-label="Tiến độ cuộc phiêu lưu">
            <div className="stat-tile">
              <span className="stat-number">
                {completedMissionsCount}/{totalMissions}
              </span>
              <span className="stat-label">Nhiệm vụ đã cứu</span>
            </div>
            <div className="stat-tile">
              <span className="stat-number">
                {unlockedAnimalsCount}/{totalAnimals}
              </span>
              <span className="stat-label">Bạn thú trở về</span>
            </div>
            <div className="stat-tile">
              <span className="stat-number">{progress.unlockedStickers.length}</span>
              <span className="stat-label">Sticker thu thập</span>
            </div>
          </div>

          {/* Secondary Quick Navigation */}
          <div className="home-actions" aria-label="Lựa chọn khám phá khác">
            <LinkButton href="/levels" variant="secondary">
              🗺️ Bản Đồ Thế Giới
            </LinkButton>
            <LinkButton href="/animal-home" variant="secondary">
              🏡 Ngôi Nhà Động Vật
            </LinkButton>
            <LinkButton href="/stickers" variant="secondary">
              ⭐ Bộ Sưu Tập
            </LinkButton>
            <LinkButton href="/free-play" variant="ghost">
              🎈 Chơi Tự Do
            </LinkButton>
            <LinkButton href="/settings" variant="ghost">
              ⚙️ Phụ Huynh
            </LinkButton>
          </div>
        </section>

        {/* Forest Stage with Animated Animal Companion */}
        <section
          className="forest-stage"
          aria-label="Sân khấu khu rừng"
          onClick={handleTapCompanion}
          style={{ cursor: 'pointer' }}
          title="Chạm vào tớ nhé!"
        >
          <div className="stage-hill" />
          <div className="stage-house" />
          <div
            className="stage-animal"
            style={{
              transform: companionBounce ? 'scale(1.2) translateY(-20px)' : 'scale(1)',
              transition: 'transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <div className="stage-face" />
          </div>
        </section>
      </div>
    </main>
  );
}
