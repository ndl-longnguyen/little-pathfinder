import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bộ Sưu Tập Huy Hiệu Sticker',
  description:
    'Album huy hiệu động vật và đồ vật kỳ thú bé thu thập được sau mỗi chuyến phiêu lưu giải cứu bạn thú.',
};

export default function StickersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
