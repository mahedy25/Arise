import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ListPage from '@/components/ListPage';
import { sfetch } from '@/lib/sanity';
import { countByCategory, postsByCategory } from '@/lib/queries';
import { CATEGORIES, PAGE_SIZE, type Post } from '@/lib/constants';

export const revalidate = 60;
type Params = { category: string; page?: string[] };
const pageOf = (p?: string[]) => (!p || !p.length ? 1 : p.length > 1 || !/^\d+$/.test(p[0]) ? NaN : parseInt(p[0], 10));

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.value, page: [] }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const cat = CATEGORIES.find((c) => c.value === params.category);
  const page = pageOf(params.page);
  if (!cat || Number.isNaN(page)) return {};
  return {
    title: `${cat.label}${page > 1 ? ` (page ${page})` : ''}`, description: cat.info,
    alternates: { canonical: `/category/${cat.value}${page > 1 ? `/${page}` : ''}` },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const cat = CATEGORIES.find((c) => c.value === params.category);
  const page = pageOf(params.page);
  if (!cat || Number.isNaN(page)) notFound();
  const base = `/category/${cat.value}`;
  if (params.page?.length && page < 2) redirect(base);
  const from = (page - 1) * PAGE_SIZE;
  const [posts, total] = await Promise.all([
    sfetch<Post[]>(postsByCategory, { category: cat.value, from, to: from + PAGE_SIZE }, []),
    sfetch<number>(countByCategory, { category: cat.value }, 0),
  ]);
  if (page > 1 && !posts.length) notFound();
  return <ListPage title={cat.label} intro={cat.info} crumbs={[{ name: cat.label, href: base }]} posts={posts} total={total} page={page} basePath={base} />;
}
