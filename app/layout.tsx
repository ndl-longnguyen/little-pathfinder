import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://little-pathfinder.vercel.app'),
  title: {
    default: 'Animal Rescue Adventure - Game Giáo Dục An Toàn Cho Trẻ 1-6 Tuổi',
    template: '%s | Animal Rescue Adventure',
  },
  description:
    'Game giải cứu động vật theo cốt truyện vui nhộn, 100% không quảng cáo, giúp trẻ 1-6 tuổi học màu sắc, con vật, đếm số và phát triển tư duy logic.',
  keywords: [
    'game trẻ em',
    'game giáo dục',
    'game mầm non',
    'trò chơi cho bé',
    'animal rescue adventure',
    'học màu sắc',
    'đếm số mầm non',
    'game offline trẻ em',
  ],
  authors: [{ name: 'Little Pathfinder Team' }],
  creator: 'Little Pathfinder',
  publisher: 'Little Pathfinder',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Animal Rescue Adventure - Cuộc Phiêu Lưu Cứu Hộ Động Vật Cho Bé',
    description:
      'Trò chơi giáo dục theo cốt truyện an toàn, không quảng cáo, phát triển tư duy nhân - quả và nhận biết màu sắc cho trẻ 1-6 tuổi.',
    url: 'https://little-pathfinder.vercel.app',
    siteName: 'Animal Rescue Adventure',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Animal Rescue Adventure - Game Giáo Dục Cho Bé 1-6 Tuổi',
    description:
      'Game giải cứu động vật vui nhộn, an toàn, không quảng cáo giúp bé khám phá thiên nhiên và phát triển tư duy.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '2n_hKWDM5r9dlRixMDRAsSCW6hbadPKFb5ccKFfG3i0',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#4b9d62',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Animal Rescue Adventure',
  operatingSystem: 'Web, iOS, Android',
  applicationCategory: 'EducationalGame',
  audience: {
    '@type': 'Audience',
    audienceType: 'Toddlers and Preschoolers (1-6 years old)',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'VND',
  },
  description:
    'Trò chơi giáo dục giải cứu bạn động vật an toàn, không quảng cáo, giúp trẻ 1-6 tuổi phát triển tư duy, học đếm số và nhận biết màu sắc.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
