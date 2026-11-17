export function readingTime(body: any[] = []) {
  const words = body
    .filter((b) => b?._type === 'block')
    .map((b) => (b.children ?? []).map((c: any) => c.text ?? '').join(' '))
    .join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
