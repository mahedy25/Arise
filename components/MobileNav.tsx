'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'} className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface">
        <span className="flex flex-col gap-[5px]">
          <motion.span animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block h-0.5 w-6 rounded bg-ink" />
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-0.5 w-6 rounded bg-ink" />
          <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block h-0.5 w-6 rounded bg-ink" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="overlay" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} className="absolute inset-x-0 top-full h-[100dvh] bg-ink/40 lg:hidden" />
            <motion.nav key="panel" id="mobile-menu" aria-label="Mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full z-10 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line/10 bg-paper px-4 py-4 lg:hidden">
              <ul className="mx-auto flex max-w-6xl flex-col">
                {items.map((it, i) => (
                  <motion.li key={it.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                    <Link href={it.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3.5 font-display text-lg font-bold hover:bg-surface hover:text-accent">{it.label}</Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
