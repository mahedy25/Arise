import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { categoryLabel, type Post } from '@/lib/constants';
import TrustBadge, { SpoilerBadge } from './TrustBadge';

export default function LeadCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="flex flex-col gap-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface ring-1 ring-line/10">
          {post.cover?.asset && (
            <Image src={urlFor(post.cover).width(1200).height(675).fit('crop').url()} alt={post.cover.alt ?? post.title}
              fill priority sizes="(min-width:1024px) 66vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="font-semibold text-accent">{categoryLabel(post.category)}</span>
          <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</time>
          {post.trust && <TrustBadge label={post.trust} />}
          {post.spoiler && <SpoilerBadge />}
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight group-hover:text-accent transition-colors">{post.title}</h2>
        <p className="font-reading text-lg text-muted line-clamp-3">{post.excerpt}</p>
      </Link>
    </article>
  );
}
