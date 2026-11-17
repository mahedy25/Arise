import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ListPage from '@/components/ListPage';
import { sfetch } from '@/lib/sanity';
import { allGameSlugs, countByGame, gameBySlug, postsByGame } from '@/lib/queries';
import { PAGE_SIZE, type Post } from '@/lib/constants';

export const revalidate = 60;
type Params = { slug: string; page?: string[] };
type GameInfo = { title: string; tagline?: string | null };
const pageOf = (p?: string[]) => (!p || !p.length ? 1 : p.length > 1 || !/^\d+$/.test(p[0]) ? NaN : parseInt(p[0], 10));
const getGame = (slug: string) => sfetch<GameInfo | null>(gameBySlug, { slug }, null);

export async function generateStaticParams() {
  const games = await sfetch<{ slug: string }[]>(allGameSlugs, {}, []);
  return games.map((g) => ({ slug: g.slug, page: [] }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const game = await getGame(params.slug);
  const page = pageOf(params.page);
  if (!game || Number.isNaN(page)) return {};
  return {
    title: `${game.title}: news, guides and features${page > 1 ? ` (page ${page})` : ''}`,
    description: game.tagline || `Everything we have published about ${game.title}.`,
    alternates: { canonical: `/games/${params.slug}${page > 1 ? `/${page}` : ''}` },
  };
}

export default async function GamePage({ params }: { params: Params }) {
  const page = pageOf(params.page);
  if (Number.isNaN(page)) notFound();
  const base = `/games/${params.slug}`;
  if (params.page?.length && page < 2) redirect(base);
  const game = await getGame(params.slug);
  if (!game) notFound();
  const from = (page - 1) * PAGE_SIZE;
  const [posts, total] = await Promise.all([
    sfetch<Post[]>(postsByGame, { slug: params.slug, from, to: from + PAGE_SIZE }, []),
    sfetch<number>(countByGame, { slug: params.slug }, 0),
  ]);
  if (page > 1 && !posts.length) notFound();
  return (
    <ListPage title={game.title} kicker="Game" intro={game.tagline}
      crumbs={[{ name: 'Games', href: '/games' }, { name: game.title, href: base }]}
      posts={posts} total={total} page={page} basePath={base} />
  );
}
