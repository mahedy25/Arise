import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/lib/constants';

const PAGES: Record<string, { title: string; body: React.ReactNode }> = {
  about: {
    title: 'About',
    body: (<>
      <p>{SITE_NAME} is an independent site about Grand Theft Auto VI and, over time, other Rockstar games. We write our own news, guides and breakdowns.</p>
      <p>Every post carries a label: <strong>Confirmed</strong> means Rockstar or Take-Two said it, <strong>Rumor</strong> means it comes from an unofficial source, and <strong>Theory</strong> is our own analysis.</p>
      <p>We are not affiliated with Rockstar Games or Take-Two Interactive.</p>
    </>),
  },
  contact: {
    title: 'Contact',
    body: (<>
      <p>Tips, corrections and business enquiries: <a href="mailto:contact@yourdomain.com">contact@yourdomain.com</a>.</p>
      <p>If we got something wrong, tell us the post and what to fix. We update posts and note the change.</p>
    </>),
  },
  privacy: {
    title: 'Privacy policy',
    body: (<>
      <p>This site collects limited data to run and improve the service. If you accept cookies, third-party vendors, including Google, use cookies to serve ads based on your visits to this and other sites.</p>
      <p>Google's use of advertising cookies lets it and its partners serve ads based on your visit to this site and other sites. You can opt out of personalised advertising at <a href="https://adssettings.google.com">adssettings.google.com</a>.</p>
      <p>You can change your cookie choice by clearing this site's data in your browser. We do not sell personal information. Contact us to request deletion of any data you sent us.</p>
      <p>Last updated: replace with your publish date. Have this reviewed before launch to make sure it matches the tools you actually use.</p>
    </>),
  },
  disclaimer: {
    title: 'Disclaimer',
    body: (<>
      <p>{SITE_NAME} is a fan-run site. Game names, logos and artwork belong to their owners. Release dates, features and prices can change; check official sources before buying.</p>
      <p>Posts labelled Rumor or Theory are not official information.</p>
    </>),
  },
};

export function generateStaticParams() { return Object.keys(PAGES).map((page) => ({ page })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: { page: string } }): Promise<Metadata> {
  const p = PAGES[params.page];
  return p ? { title: p.title, alternates: { canonical: `/${params.page}` } } : {};
}

export default function StaticPage({ params }: { params: { page: string } }) {
  const p = PAGES[params.page];
  if (!p) notFound();
  return (
    <div className="py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-5xl font-extrabold">{p.title}</h1>
      <div className="mt-8 prose-vi">{p.body}</div>
    </div>
  );
}
