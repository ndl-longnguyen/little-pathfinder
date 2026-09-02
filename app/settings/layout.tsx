import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Góc Phụ Huynh & Cài Đặt Trò Chơi',
  description:
    'Không gian tùy chỉnh âm thanh, ngôn ngữ, độ tuổi và theo dõi tiến độ kỹ năng học tập của bé dành cho phụ huynh.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
