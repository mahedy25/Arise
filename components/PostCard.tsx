import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { categoryLabel, type Post } from '@/lib/constants';
import TrustBadge, { SpoilerBadge } from './TrustBadge';
import { CardMotion } from './motion';

export default function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <CardMotion>
      <article className="group flex flex-col">
        <Link href={`/blog/${post.slug}`} className="flex flex-col gap-3">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface ring-1 ring-line/10">
            {post.cover?.asset && (
              <Image src={urlFor(post.cover).width(800).height(450).fit('crop').url()} alt={post.cover.alt ?? post.title}
                fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" priority={priority}
                className="object-cover transition-transform duration-500 group-hover:scale-105" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="font-semibold text-accent">{categoryLabel(post.category)}</span>
            <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
            {post.trust && <TrustBadge label={post.trust} />}
            {post.spoiler && <SpoilerBadge />}
          </div>
          <h3 className="font-display text-xl font-bold leading-snug group-hover:text-accent transition-colors">{post.title}</h3>
          <p className="text-muted line-clamp-2">{post.excerpt}</p>
        </Link>
      </article>
    </CardMotion>
  );
}
