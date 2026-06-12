'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { LevelCard } from '@/components/LevelCard';
import { LevelManager } from '@/game/systems/LevelManager';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Progress, Settings } from '@/game/types';

export default function LevelsPage() {
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

  const levels = LevelManager.getLevels();

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />
        <div className="page-title-row">
          <h1>Forest Levels</h1>
          <span className="compact-status">
            {progress.completedLevels.length}/{levels.length}
          </span>
        </div>
        <section className="level-grid" aria-label="Level list">
          {levels.map((level) => (
            <LevelCard
              completed={progress.completedLevels.includes(level.id)}
              key={level.id}
              level={level}
              locked={!progress.unlockedLevels.includes(level.id)}
              settings={settings}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
