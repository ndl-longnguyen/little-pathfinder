import { SITE_URL, MAIN_SITE_URL } from '@/lib/config/site';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Animal Rescue Adventure – Game Giáo Dục Cho Bé 1-6 Tuổi',
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
    'game phát triển tư duy cho bé',
    'game không quảng cáo cho trẻ em',
  ],
  authors: [{ name: 'Little Pathfinder Team' }],
  creator: 'Little Pathfinder',
  publisher: 'Little Pathfinder',
  manifest: '/site.webmanifest',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/icon-192.png', sizes: '192x192' },
      { url: '/icon.png', sizes: '512x512' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Animal Rescue Adventure – Game Giáo Dục Cho Bé 1-6 Tuổi',
    description:
      'Trò chơi giáo dục theo cốt truyện an toàn, 100% không quảng cáo, phát triển tư duy nhân - quả và nhận biết màu sắc cho trẻ 1-6 tuổi.',
    url: SITE_URL,
    siteName: 'Animal Rescue Adventure',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Animal Rescue Adventure - Game Giáo Dục An Toàn Cho Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Animal Rescue Adventure – Game Giáo Dục Cho Bé 1-6 Tuổi',
    description:
      'Game giải cứu động vật vui nhộn, an toàn, 100% không quảng cáo giúp bé khám phá thiên nhiên và phát triển tư duy.',
    images: ['/icon.png'],
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
  other: {
    'google-adsense-account': 'ca-pub-9166964727480227',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#4b9d62',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Animal Rescue Adventure',
      alternateName: ['Little Pathfinder', 'kids.ndlong.site', 'Animal Rescue'],
      description: 'Game giải cứu động vật vui nhộn, an toàn, 100% không quảng cáo cho trẻ 1-6 tuổi.',
      publisher: {
        '@type': 'Organization',
        name: 'Little Pathfinder',
        url: SITE_URL,
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
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
        'Trò chơi giáo dục giải cứu bạn động vật an toàn, 100% không quảng cáo, giúp trẻ 1-6 tuổi phát triển tư duy, học đếm số và nhận biết màu sắc.',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9166964727480227" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
