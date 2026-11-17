import Link from 'next/link';
import PostCard from '@/components/PostCard';
import LeadCard from '@/components/LeadCard';
import CompactPost from '@/components/CompactPost';
import AdSlot from '@/components/AdSlot';
import { Reveal } from '@/components/motion';
import { sfetch } from '@/lib/sanity';
import { gamesList, homePosts } from '@/lib/queries';
import { CATEGORIES, SITE_TAGLINE, type Game, type Post } from '@/lib/constants';

export const revalidate = 60;

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-line/10 pb-3">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <Link href={href} className="text-sm font-medium text-link hover:underline">View all →</Link>
    </div>
  );
}

export default async function Home() {
  const [posts, games] = await Promise.all([sfetch<Post[]>(homePosts, {}, []), sfetch<Game[]>(gamesList, {}, [])]);

  if (!posts.length) {
    return <p className="py-20 text-muted">No posts yet. Open <Link href="/studio" className="text-link underline">/studio</Link> and publish your first post.</p>;
  }

  const lead = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p._id !== lead._id);
  const side = rest.slice(0, 4);
  const latest = rest.slice(4, 10);
  const shown = games.filter((g) => (g.postCount ?? 0) > 0);
  const sections = CATEGORIES.map((c) => ({ ...c, items: posts.filter((p) => p.category === c.value).slice(0, 3) })).filter((s) => s.items.length);

  return (
    <>
      <h1 className="sr-only">{SITE_TAGLINE}</h1>

      {shown.length > 0 && (
        <nav aria-label="Browse by game" className="flex flex-wrap items-center gap-2 pt-6 text-sm">
          <span className="mr-1 text-muted">Games:</span>
          {shown.map((g) => (
            <Link key={g.slug} href={`/games/${g.slug}`} className="rounded-full border border-line/20 px-3.5 py-1.5 hover:border-accent hover:text-accent transition-colors">{g.title}</Link>
          ))}
        </nav>
      )}

      <section aria-label="Top stories" className="grid gap-10 pt-8 md:pt-10 lg:grid-cols-3">
        <div className="lg:col-span-2"><LeadCard post={lead} /></div>
        {side.length > 0 && (
          <div className="flex flex-col gap-6 lg:border-l lg:border-line/10 lg:pl-8">
            <h2 className="font-display text-xl font-bold">More stories</h2>
            {side.map((p) => <CompactPost key={p._id} post={p} />)}
          </div>
        )}
      </section>

      {latest.length > 0 && (
        <Reveal className="mt-16">
          <SectionHead title="Latest" href="/category/news" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{latest.map((p) => <PostCard key={p._id} post={p} />)}</div>
        </Reveal>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_HOME} />

      {sections.map((s) => (
        <Reveal key={s.value} className="mt-14">
          <SectionHead title={s.label} href={`/category/${s.value}`} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{s.items.map((p) => <PostCard key={p._id} post={p} />)}</div>
        </Reveal>
      ))}
    </>
  );
}
