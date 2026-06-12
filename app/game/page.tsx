import { Suspense } from 'react';
import { GamePageClient } from './GamePageClient';

export default function GamePage() {
  return (
    <Suspense fallback={<div className="loading-panel">Loading forest...</div>}>
      <GamePageClient />
    </Suspense>
  );
}
