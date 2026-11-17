// Run once:  pnpm sanity exec scripts/migrate.ts --with-user-token
// 1) moves old GTA topic categories into the new sitewide categories
// 2) removes the old Confirmed / Rumor / Theory label from every post
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2024-10-01' });
const MAP: Record<string, string> = { gameplay: 'features', map: 'features', characters: 'features', secrets: 'features' };

async function main() {
  const docs: { _id: string; category?: string; trust?: string }[] = await client.fetch(
    `*[_type=="post" && (category in $old || defined(trust))]{_id, category, trust}`,
    { old: Object.keys(MAP) },
  );
  if (!docs.length) return console.log('Nothing to migrate.');
  const tx = client.transaction();
  docs.forEach((d) =>
    tx.patch(d._id, (p) => {
      let next = p;
      if (d.category && MAP[d.category]) next = next.set({ category: MAP[d.category] });
      if (d.trust) next = next.unset(['trust']);
      return next;
    }),
  );
  await tx.commit();
  console.log(`Updated ${docs.length} posts.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
