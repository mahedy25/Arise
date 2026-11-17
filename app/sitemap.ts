import type { MetadataRoute } from 'next';
import { sfetch } from '@/lib/sanity';
import { allGameSlugs, allSlugs } from '@/lib/queries';
import { CATEGORIES, SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, games] = await Promise.all([
    sfetch<{ slug: string; _updatedAt: string }[]>(allSlugs, {}, []),
    sfetch<{ slug: string }[]>(allGameSlugs, {}, []),
  ]);
  return [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/games`, changeFrequency: 'daily', priority: 0.7 },
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/category/${c.value}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...games.map((g) => ({ url: `${SITE_URL}/games/${g.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...['about', 'contact', 'privacy', 'disclaimer'].map((p) => ({ url: `${SITE_URL}/${p}`, priority: 0.3 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p._updatedAt, priority: 0.7 })),
  ];
}
