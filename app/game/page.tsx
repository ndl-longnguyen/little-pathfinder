import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GamePageClient } from './GamePageClient';

export const metadata: Metadata = {
  title: 'Màn Chơi Cứu Hộ Động Vật',
  description:
    'Tham gia màn chơi giải đố tương tác, giúp các bạn động vật vượt qua chướng ngại vật để về nhà an toàn.',
};

export default function GamePage() {
  return (
    <>
      <h1 className="sr-only">Màn Chơi Cứu Hộ Động Vật - Animal Rescue Adventure</h1>
      <Suspense fallback={<div className="loading-panel">Đang tải khu rừng thần tiên...</div>}>
        <GamePageClient />
      </Suspense>
    </>
  );
}
