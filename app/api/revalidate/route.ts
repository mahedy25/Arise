import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Sanity webhook: POST https://yourdomain.com/api/revalidate?secret=YOUR_SECRET
export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get('secret') !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag('sanity');
  return NextResponse.json({ ok: true, at: Date.now() });
}
