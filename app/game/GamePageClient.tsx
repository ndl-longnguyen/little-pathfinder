'use client';

import { useSearchParams } from 'next/navigation';
import { GameCanvas } from '@/components/GameCanvas';
import { LevelManager } from '@/game/systems/LevelManager';

export function GamePageClient() {
  const searchParams = useSearchParams();
  const rawParam = searchParams.get('mission') ?? searchParams.get('level') ?? '1';
  const requestedLevel = Number(rawParam);
  const levelId = LevelManager.hasLevel(requestedLevel) ? requestedLevel : 1;

  return (
    <main className="game-page">
      <GameCanvas levelId={levelId} />
    </main>
  );
}
