import Link from 'next/link';
import { CATEGORIES, SITE_NAME, SITE_TAGLINE } from '@/lib/constants';

export default function Footer() {
  const col = 'flex flex-col gap-2';
  return (
    <footer className="mt-20 border-t border-line/10 py-12 text-sm text-muted">
      <div className="mx-auto max-w-6xl px-4 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-extrabold text-ink">{SITE_NAME}</p>
          <p className="mt-2 max-w-xs">{SITE_TAGLINE}.</p>
        </div>
        <nav aria-label="Sections" className={col}>
          <p className="font-semibold text-ink">Sections</p>
          {CATEGORIES.map((c) => <Link key={c.value} href={`/category/${c.value}`} className="hover:text-accent">{c.label}</Link>)}
          <Link href="/games" className="hover:text-accent">Games</Link>
        </nav>
        <nav aria-label="Site" className={col}>
          <p className="font-semibold text-ink">Site</p>
          <Link href="/about" className="hover:text-accent">About</Link>
          <Link href="/contact" className="hover:text-accent">Contact</Link>
          <Link href="/privacy" className="hover:text-accent">Privacy policy</Link>
          <Link href="/disclaimer" className="hover:text-accent">Disclaimer</Link>
          <a href="/feed.xml" className="hover:text-accent">RSS feed</a>
        </nav>
        <p>{SITE_NAME} is an independent site. It is not affiliated with, endorsed by, or sponsored by any game publisher. Game names and logos belong to their owners.</p>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4">© {new Date().getFullYear()} {SITE_NAME}</p>
    </footer>
  );
}
