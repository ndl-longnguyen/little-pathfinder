import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khu Chơi Tự Do & Khám Phá',
  description:
    'Hoạt động nghe tiếng kêu muôn loài và tương tác tự do với thiên nhiên, không áp lực điểm số cho trẻ mầm non.',
};

export default function FreePlayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
