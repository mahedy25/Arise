import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter, Literata } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants';

const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const reading = Literata({ subsets: ['latin'], variable: '--font-reading', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: 'Independent gaming news, guides, features and lists, from the biggest launches to the games you keep coming back to.',
  openGraph: { type: 'website', siteName: SITE_NAME },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#FAF7F0' }, { media: '(prefers-color-scheme: dark)', color: '#181614' }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    ],
  };
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${reading.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}