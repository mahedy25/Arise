'use client';
import { useEffect, useRef, useState } from 'react';

export default function AdSlot({ slot, minHeight = 280 }: { slot?: string; minHeight?: number }) {
  const id = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const [ok, setOk] = useState(false);
  const pushed = useRef(false);
  useEffect(() => {
    const check = () => { try { setOk(localStorage.getItem('vi-consent') === 'granted'); } catch {} };
    check();
    window.addEventListener('vi-consent', check);
    return () => window.removeEventListener('vi-consent', check);
  }, []);
  useEffect(() => {
    if (!ok || !id || !slot || pushed.current) return;
    pushed.current = true;
    try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch {}
  }, [ok, id, slot]);
  if (!id || !slot) return null;
  return (
    <aside aria-label="Advertisement" className="my-10" style={{ minHeight }}>
      <p className="mb-1 text-xs text-muted">Advertisement</p>
      {ok && <ins className="adsbygoogle block" style={{ display: 'block', minHeight }} data-ad-client={id} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />}
    </aside>
  );
}
