import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bản Đồ Thế Giới Cứu Hộ',
  description:
    'Khám phá bản đồ thế giới Rừng Vui Vẻ, hoàn thành các nhiệm vụ giải cứu bạn Thỏ, Vịt, Gấu, Khỉ và Gấu Trúc.',
};

export default function LevelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
