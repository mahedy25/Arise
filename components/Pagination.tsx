import Link from 'next/link';

export default function Pagination({ basePath, page, totalPages }: { basePath: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/${n}`);
  const btn = 'rounded-full border border-line/20 px-4 py-2 hover:border-accent hover:text-accent transition-colors';
  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-between text-sm">
      {page > 1 ? <Link href={href(page - 1)} rel="prev" className={btn}>← Newer</Link> : <span />}
      <span className="text-muted">Page {page} of {totalPages}</span>
      {page < totalPages ? <Link href={href(page + 1)} rel="next" className={btn}>Older →</Link> : <span />}
    </nav>
  );
}
