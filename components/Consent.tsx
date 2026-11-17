'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const KEY = 'vi-consent';
const ADSENSE = process.env.NEXT_PUBLIC_ADSENSE_ID;

function loadAdSense() {
  if (!ADSENSE || document.getElementById('adsense-js')) return;
  const s = document.createElement('script');
  s.id = 'adsense-js'; s.async = true; s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}`;
  document.head.appendChild(s);
}

export default function Consent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === 'granted') { loadAdSense(); window.dispatchEvent(new Event('vi-consent')); }
      else if (!v) setShow(true);
    } catch { setShow(true); }
  }, []);
  const choose = (v: 'granted' | 'denied') => {
    try { localStorage.setItem(KEY, v); } catch {}
    if (v === 'granted') { loadAdSense(); window.dispatchEvent(new Event('vi-consent')); }
    setShow(false);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }} role="dialog" aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-line/20 bg-surface p-4 shadow-xl">
          <p className="text-sm">We use cookies to show ads and understand traffic. See the <Link href="/privacy" className="text-link underline">privacy policy</Link>.</p>
          <div className="mt-3 flex gap-3">
            <button onClick={() => choose('granted')} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper">Accept</button>
            <button onClick={() => choose('denied')} className="rounded-full border border-line/30 px-4 py-2 text-sm">Decline</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
