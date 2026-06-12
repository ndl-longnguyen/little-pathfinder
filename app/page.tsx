'use client';

import { useEffect, useMemo, useState } from 'react';
import { LinkButton } from '@/components/Button';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Progress } from '@/game/types';
import { LevelManager } from '@/game/systems/LevelManager';

export default function HomePage() {
  const [progress, setProgress] = useState<Progress>(ProgressManager.defaultProgress);

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

  const nextLevel = useMemo(
    () => LevelManager.getNextPlayableLevel(progress),
    [progress],
  );

  return (
    <main className="home-scene">
      <div className="home-layout">
        <section className="home-copy" aria-labelledby="home-title">
          <h1 className="home-title" id="home-title">
            Animal Rescue Adventure
          </h1>
          <p className="home-subtitle">
            Help forest friends choose colors, paths, food, and bridges.
          </p>
          <div className="home-actions">
            <LinkButton href={`/game?level=${nextLevel.id}`} variant="primary">
              Play
            </LinkButton>
            <LinkButton href="/levels" variant="secondary">
              Levels
            </LinkButton>
            <LinkButton href="/stickers" variant="coral">
              Stickers
            </LinkButton>
          </div>
          <div className="home-progress" aria-label="Progress">
            <div className="stat-tile">
              <span className="stat-number">{progress.completedLevels.length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-tile">
              <span className="stat-number">{progress.unlockedLevels.length}</span>
              <span className="stat-label">Unlocked</span>
            </div>
            <div className="stat-tile">
              <span className="stat-number">{progress.unlockedStickers.length}</span>
              <span className="stat-label">Stickers</span>
            </div>
          </div>
        </section>
        <section className="forest-stage" aria-label="Forest scene">
          <div className="stage-hill" />
          <div className="stage-house" />
          <div className="stage-animal">
            <div className="stage-face" />
          </div>
        </section>
      </div>
    </main>
  );
}
