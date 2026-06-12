'use client';

import { useEffect, useRef, useState } from 'react';

type GameHandle = {
  destroy: () => void;
};

type GameCanvasProps = {
  levelId: number;
};

export function GameCanvas({ levelId }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let handle: GameHandle | null = null;
    let cancelled = false;

    async function boot() {
      if (!containerRef.current) {
        return;
      }

      setReady(false);
      const { createPhaserGame } = await import('@/game/PhaserGame');

      if (cancelled || !containerRef.current) {
        return;
      }

      handle = createPhaserGame(containerRef.current, levelId);
      setReady(true);
    }

    void boot();

    return () => {
      cancelled = true;
      handle?.destroy();
      handle = null;
    };
  }, [levelId]);

  return (
    <div className="game-shell">
      {!ready && <div className="loading-panel">Loading forest...</div>}
      <div aria-label="Game canvas" className="game-frame" ref={containerRef} />
    </div>
  );
}
