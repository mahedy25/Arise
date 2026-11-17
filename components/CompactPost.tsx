import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { categoryLabel, type Post } from '@/lib/constants';

export default function CompactPost({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="flex gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-surface ring-1 ring-line/10 sm:h-24 sm:w-32">
          {post.cover?.asset && (
            <Image src={urlFor(post.cover).width(256).height(192).fit('crop').url()} alt={post.cover.alt ?? post.title}
              fill sizes="128px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="font-semibold text-accent">{categoryLabel(post.category)}</span>
            <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
          </div>
          <h3 className="mt-1 line-clamp-3 font-display text-base font-bold leading-snug group-hover:text-accent transition-colors">{post.title}</h3>
        </div>
      </Link>
    </article>
  );
}
