import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ngôi Nhà Động Vật Rừng Xanh',
  description:
    'Ghé thăm ngôi nhà bình yên nơi các bạn thú đã được giải cứu cùng sum vầy sinh sống và vui đùa.',
};

export default function AnimalHomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
