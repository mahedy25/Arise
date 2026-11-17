import Link from 'next/link';
import PostCard from './PostCard';
import Pagination from './Pagination';
import AdSlot from './AdSlot';
import { Reveal } from './motion';
import { PAGE_SIZE, SITE_URL, type Post } from '@/lib/constants';

type Props = {
  title: string; kicker?: string; intro?: string | null; crumbs: { name: string; href: string }[];
  posts: Post[]; total: number; page: number; basePath: string;
};

export default function ListPage({ title, kicker, intro, crumbs, posts, total, page, basePath }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const trail = [{ name: 'Home', href: '/' }, ...crumbs];
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
  };
  return (
    <div className="py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        {trail.map((c, i) => (
          <span key={c.href}>
            {i > 0 && <span aria-hidden className="mx-2">›</span>}
            {i < trail.length - 1 ? <Link href={c.href} className="hover:text-accent">{c.name}</Link> : <span aria-current="page">{c.name}</span>}
          </span>
        ))}
      </nav>
      <Reveal>
        {kicker && <p className="mb-2 text-sm font-semibold text-accent">{kicker}</p>}
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl font-reading text-lg text-muted">{intro}</p>}
      </Reveal>

      {posts.length ? (
        <>
          <p className="mt-8 text-sm text-muted">{total} {total === 1 ? 'post' : 'posts'}</p>
          <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{posts.slice(0, 6).map((p) => <PostCard key={p._id} post={p} />)}</div>
          <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_LISTING} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{posts.slice(6).map((p) => <PostCard key={p._id} post={p} />)}</div>
          <Pagination basePath={basePath} page={page} totalPages={totalPages} />
        </>
      ) : (
        <div className="mt-12 max-w-xl rounded-2xl border border-line/10 bg-surface p-8">
          <p className="font-display text-xl font-bold">Nothing here yet</p>
          <p className="mt-2 text-muted">New posts appear here as soon as they are published.</p>
        </div>
      )}
    </div>
  );
}
