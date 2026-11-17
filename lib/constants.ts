export const SITE_NAME = 'Arise.';
export const SITE_TAGLINE = 'Gaming news, guides and features';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const PAGE_SIZE = 12;

export const CATEGORIES = [
  { value: 'news', label: 'News', info: 'Announcements, updates and the stories gamers are talking about, with sources linked.' },
  { value: 'guides', label: 'Guides', info: 'Clear explainers and how-tos that help you get the most out of a game.' },
  { value: 'features', label: 'Features', info: 'Deeper reads: characters, worlds, mechanics and the ideas behind the games.' },
  { value: 'lists', label: 'Lists', info: 'Roundups, rankings and quick-scan lists.' },
  { value: 'opinion', label: 'Opinion', info: 'Takes and commentary from the people behind the site.' },
];
export const categoryLabel = (v?: string) => CATEGORIES.find((c) => c.value === v)?.label ?? v ?? '';

export type Post = {
  _id: string; title: string; slug: string; excerpt: string; category: string;
  trust?: string | null; spoiler?: boolean | null; featured?: boolean | null; publishedAt: string;
  cover?: { asset?: any; alt?: string }; game?: { title: string; slug: string } | null;
};
export type Game = { title: string; slug: string; tagline?: string | null; status?: string | null; cover?: { asset?: any; alt?: string }; postCount?: number };
