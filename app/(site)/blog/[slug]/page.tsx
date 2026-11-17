import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from 'next-sanity';
import PostCard from '@/components/PostCard';
import TrustBadge, { SpoilerBadge } from '@/components/TrustBadge';
import AdSlot from '@/components/AdSlot';
import { ScrollProgress } from '@/components/motion';
import { sfetch, urlFor } from '@/lib/sanity';
import { allSlugs, postBySlug, relatedPosts } from '@/lib/queries';
import { readingTime } from '@/lib/reading';
import { SITE_NAME, SITE_URL, categoryLabel, type Post } from '@/lib/constants';

export const revalidate = 60;
type FullPost = Post & {
  body?: any[]; tags?: string[]; sources?: { title?: string; url: string }[]; seoTitle?: string; seoDescription?: string;
  _updatedAt: string; author?: { name: string; bio?: string } | null;
};
const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { dateStyle: 'long' });

export async function generateStaticParams() {
  const rows = await sfetch<{ slug: string }[]>(allSlugs, {}, []);
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await sfetch<FullPost | null>(postBySlug, { slug: params.slug }, null);
  if (!post) return {};
  const img = post.cover?.asset ? urlFor(post.cover).width(1200).height(630).fit('crop').url() : undefined;
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title, description, alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title, description, publishedTime: post.publishedAt, modifiedTime: post._updatedAt, images: img ? [img] : [] },
    twitter: { card: 'summary_large_image', title, description, images: img ? [img] : [] },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await sfetch<FullPost | null>(postBySlug, { slug: params.slug }, null);
  if (!post) notFound();
  const related = await sfetch<Post[]>(relatedPosts, { slug: post.slug, game: post.game?.slug ?? '', category: post.category }, []);
  const updated = new Date(post._updatedAt).getTime() - new Date(post.publishedAt).getTime() > 864e5;
  const mins = readingTime(post.body);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const crumbs = [
    { name: 'Home', href: '/' },
    ...(post.game ? [{ name: post.game.title, href: `/games/${post.game.slug}` }] : [{ name: categoryLabel(post.category), href: `/category/${post.category}` }]),
    { name: post.title, href: `/blog/${post.slug}` },
  ];
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': post.category === 'news' ? 'NewsArticle' : 'Article', headline: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt, datePublished: post.publishedAt, dateModified: post._updatedAt,
      author: { '@type': 'Person', name: post.author?.name ?? SITE_NAME }, publisher: { '@type': 'Organization', name: SITE_NAME },
      mainEntityOfPage: url, image: post.cover?.asset ? [urlFor(post.cover).width(1200).url()] : undefined,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
    },
  ];

  return (
    <article className="py-10 md:py-14">
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          {crumbs.slice(0, -1).map((c, i) => (
            <span key={c.href}>{i > 0 && <span aria-hidden className="mx-2">›</span>}<Link href={c.href} className="hover:text-accent">{c.name}</Link></span>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <Link href={`/category/${post.category}`} className="font-semibold text-accent hover:underline">{categoryLabel(post.category)}</Link>
          {post.trust && <TrustBadge label={post.trust} />}
          {post.spoiler && <SpoilerBadge />}
        </div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight">{post.title}</h1>
        <p className="mt-5 font-reading text-xl leading-relaxed text-muted">{post.excerpt}</p>
        <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {post.author?.name && <span>By <span className="font-medium text-ink">{post.author.name}</span></span>}
          <time dateTime={post.publishedAt}>{fmt(post.publishedAt)}</time>
          {updated && <span>Updated {fmt(post._updatedAt)}</span>}
          <span>{mins} min read</span>
        </p>

        {post.spoiler && (
          <p role="note" className="mt-6 rounded-xl border border-accent/40 bg-surface px-4 py-3 text-sm">Heads up: this post contains spoilers.</p>
        )}

        {post.cover?.asset && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-surface ring-1 ring-line/10">
            <Image src={urlFor(post.cover).width(1400).height(788).fit('crop').url()} alt={post.cover.alt ?? post.title} fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover" />
          </div>
        )}

        <div className="prose-read mt-10">
          <PortableText value={post.body ?? []} components={{
            types: { image: ({ value }: any) => (
              <figure>
                <Image src={urlFor(value).width(1000).url()} alt={value.alt ?? ''} width={1000} height={560} className="h-auto w-full rounded-xl" />
                {value.caption && <figcaption>{value.caption}</figcaption>}
              </figure>
            ) },
          }} />
        </div>

        {post.sources && post.sources.length > 0 && (
          <section aria-labelledby="sources" className="mt-12 border-t border-line/10 pt-6">
            <h2 id="sources" className="font-display text-lg font-bold">Sources</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {post.sources.map((s, i) => (
                <li key={i}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-link underline underline-offset-2">{s.title || s.url}</a></li>
              ))}
            </ul>
          </section>
        )}

        {post.tags && post.tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2 text-sm">{post.tags.map((t) => <li key={t} className="rounded-full bg-surface px-3 py-1 text-muted ring-1 ring-line/10">#{t}</li>)}</ul>
        )}

        {post.author?.name && (
          <aside className="mt-10 rounded-2xl bg-surface p-5 ring-1 ring-line/10">
            <p className="font-display font-bold">{post.author.name}</p>
            {post.author.bio && <p className="mt-1 text-sm text-muted">{post.author.bio}</p>}
          </aside>
        )}
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE} />

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="more">
          <h2 id="more" className="mb-6 border-b border-line/10 pb-3 font-display text-2xl font-bold">Keep reading</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <PostCard key={p._id} post={p} />)}</div>
        </section>
      )}
    </article>
  );
}
