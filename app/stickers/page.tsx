'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import stickers from '@/data/stickers.json';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Progress, StickerData } from '@/game/types';

const allStickers = stickers as StickerData[];

export default function StickersPage() {
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

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />
        <div className="page-title-row">
          <h1>Sticker Book</h1>
          <span className="compact-status">
            {progress.unlockedStickers.length}/{allStickers.length}
          </span>
        </div>
        <section className="sticker-grid" aria-label="Sticker book">
          {allStickers.map((sticker) => {
            const unlocked = progress.unlockedStickers.includes(sticker.id);
            return (
              <article className={`sticker-card ${unlocked ? 'unlocked' : 'locked'}`} key={sticker.id}>
                <div>
                  <div aria-hidden="true" className="sticker-art" />
                  <h2>{unlocked ? sticker.name : 'Locked'}</h2>
                  <p>{unlocked ? sticker.category : 'Finish a forest level'}</p>
                </div>
                <span className="compact-status">{unlocked ? 'Collected' : 'Hidden'}</span>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
