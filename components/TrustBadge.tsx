const styles: Record<string, string> = {
  Confirmed: 'border-link text-link',
  Rumor: 'border-accent text-accent',
  Theory: 'border-muted text-muted',
};

export default function TrustBadge({ label }: { label: string }) {
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${styles[label] ?? styles.Theory}`}>{label}</span>;
}

export function SpoilerBadge() {
  return <span className="inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-paper">Spoilers</span>;
}
