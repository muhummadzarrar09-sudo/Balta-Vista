import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CookieConsent } from '@/components/ui/cookie-consent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balta-vista.local';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Balta Vista Nathiagali — Luxury Hill Hotel',
    template: '%s · Balta Vista Nathiagali'
  },
  description: 'A cinematic luxury hill-station hotel opening in Nathiagali, Pakistan — warm rooms, pine views, and full-rate booking inquiries.',
  applicationName: 'Balta Vista Nathiagali',
  keywords: ['Nathiagali hotel', 'luxury hotel Pakistan', 'KPK hill station', 'Nathiagali rooms', 'Bhurban alternative', 'Murree luxury stay'],
  authors: [{ name: 'Balta Vista' }],
  creator: 'Balta Vista',
  publisher: 'Balta Vista',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: '/',
    siteName: 'Balta Vista Nathiagali',
    title: 'Balta Vista Nathiagali — Luxury Hill Hotel',
    description: 'A quieter kind of luxury above the pines. Opening season preview for a luxury hotel in Nathiagali, KPK.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Balta Vista Nathiagali luxury hill hotel preview' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balta Vista Nathiagali — Luxury Hill Hotel',
    description: 'A quieter kind of luxury above the pines.',
    images: ['/twitter-image']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
  }
};

export const viewport: Viewport = {
  themeColor: '#11130f',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
