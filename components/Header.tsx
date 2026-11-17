import Link from 'next/link';
import { CATEGORIES, SITE_NAME } from '@/lib/constants';
import { MotionHeader, MotionLink } from './motion';
import MobileNav from './MobileNav';

const links = [...CATEGORIES.map((c) => ({ href: `/category/${c.value}`, label: c.label })), { href: '/games', label: 'Games' }];

export default function Header() {
  return (
    <MotionHeader initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-line/10 bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">{SITE_NAME}</Link>
        <nav aria-label="Main" className="hidden lg:flex gap-1 text-sm font-medium">
          {links.map((l) => (
            <MotionLink key={l.href} href={l.href} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
              className="whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-surface hover:text-accent transition-colors">{l.label}</MotionLink>
          ))}
        </nav>
        <MobileNav items={[{ href: '/', label: 'Home' }, ...links]} />
      </div>
    </MotionHeader>
  );
}
