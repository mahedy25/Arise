import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: false,
});

// Never crash the build if Sanity is unreachable or not configured yet.
export async function sfetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: process.env.NODE_ENV === 'development' ? 0 : 60, tags: ['sanity'] },
    });
  } catch (e) {
    console.error('[sanity] query failed:', e);
    return fallback;
  }
}

const builder = imageUrlBuilder(client);
export const urlFor = (src: any) => builder.image(src);
