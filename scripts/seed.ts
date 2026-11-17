// Run with:  pnpm seed   (adds 1 game, 1 author and 6 clearly-marked sample posts)
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2024-10-01' });
const now = new Date().toISOString();
const ref = (id: string) => ({ _type: 'reference' as const, _ref: id });
const body = (...paras: string[]) =>
  paras.map((text, i) => ({
    _type: 'block', _key: `b${i}`, style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
  }));

const sample = 'This is a sample post. Edit or delete it in Studio and replace it with your own writing.';
const post = (n: number, title: string, category: string, trust: string, excerpt: string, paras: string[], featured = false) => ({
  _id: `post-sample-${n}`, _type: 'post', title, slug: { _type: 'slug', current: `sample-${n}` },
  game: ref('game-gta-6'), author: ref('author-main'), category, trust, excerpt, featured,
  publishedAt: now, tags: ['sample'], body: body(...paras, sample),
});

const docs = [
  { _id: 'author-main', _type: 'author', name: 'Arise. Editor', bio: 'Edit this bio in Studio.' },
  {
    _id: 'game-gta-6', _type: 'game', title: 'Grand Theft Auto VI', slug: { _type: 'slug', current: 'gta-6' },
    tagline: 'Everything about GTA 6, sorted into Confirmed, Rumor and Theory.',
    releaseDate: '2026-11-19T00:00:00-05:00', status: 'Upcoming',
  },
  post(1, 'Sample: GTA 6 release date and what we know', 'news', 'Confirmed',
    'A template for a news post. Rockstar has set the release date for November 19, 2026.',
    ['Use news posts for official announcements. Say who announced it and link the source.'], true),
  post(2, 'Sample: Gameplay breakdown template', 'gameplay', 'Theory',
    'A template for breaking down mechanics, weapons and vehicles from what has been shown.',
    ['Describe what you saw, where you saw it, and what you think it means.']),
  post(3, 'Sample: Map and locations template', 'map', 'Rumor',
    'A template for map discoveries and location write-ups.',
    ['Mark anything that comes from an unofficial source as a Rumor.']),
  post(4, 'Sample: Character profile template', 'characters', 'Theory',
    'A template for character profiles and story analysis.',
    ['Cover who the character is, where they appeared, and what is still unknown.']),
  post(5, 'Sample: Secrets and easter eggs template', 'secrets', 'Theory',
    'A template for hidden details and easter eggs.',
    ['Include a screenshot with alt text and say where to find the detail.']),
  post(6, 'Sample: How to read our trust labels', 'guides', 'Confirmed',
    'Confirmed means an official source, Rumor means unofficial, Theory means our own analysis.',
    ['Every post carries one of three labels so readers always know how far to trust it.']),
];

async function main() {
  const tx = client.transaction();
  docs.forEach((d) => tx.createOrReplace(d as any));
  await tx.commit();
  console.log(`Seeded ${docs.length} documents. Open http://localhost:3000`);
}
main().catch((e) => { console.error(e); process.exit(1); });
