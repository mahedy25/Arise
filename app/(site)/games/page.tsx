import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion';
import { sfetch, urlFor } from '@/lib/sanity';
import { gamesList } from '@/lib/queries';
import type { Game } from '@/lib/constants';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Games', description: 'Browse news, guides and features by game.', alternates: { canonical: '/games' } };

export default async function GamesIndex() {
  const games = await sfetch<Game[]>(gamesList, {}, []);
  return (
    <div className="py-10 md:py-14">
      <Reveal>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">Games</h1>
        <p className="mt-3 max-w-2xl font-reading text-lg text-muted">Browse everything we have published, game by game.</p>
      </Reveal>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <Link key={g.slug} href={`/games/${g.slug}`} className="group flex flex-col gap-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface ring-1 ring-line/10">
              {g.cover?.asset && <Image src={urlFor(g.cover).width(800).height(450).fit('crop').url()} alt={g.cover.alt ?? g.title} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
            </div>
            <h2 className="font-display text-xl font-bold group-hover:text-accent transition-colors">{g.title}</h2>
            {g.tagline && <p className="text-muted line-clamp-2">{g.tagline}</p>}
            <p className="text-sm text-muted">{g.postCount ?? 0} {g.postCount === 1 ? 'post' : 'posts'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
