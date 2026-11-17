# Arise

GTA 6 news and info site: Next.js 14 (App Router), Tailwind CSS, Sanity.

## Setup
1. `npm install`
2. Create a project at sanity.io, then `cp .env.example .env.local` and fill in the project ID.
3. In Sanity: Manage > API > CORS origins, add `http://localhost:3000` (with credentials) and later your domain.
4. `npm run dev`, open `/studio`, create a **Game** with slug `gta-6` (set the release date), an **Author**, then publish posts.
5. Deploy to Vercel, add the env vars, and add a Sanity webhook (POST) to `https://YOURDOMAIN/api/revalidate?secret=SANITY_REVALIDATE_SECRET` so posts go live instantly.

## Domain + AdSense checklist
- Set `NEXT_PUBLIC_SITE_URL` to your domain; submit `/sitemap.xml` in Search Console.
- Before applying: 15-20 original posts, About/Contact/Privacy pages (included), clear navigation.
- After approval: set `NEXT_PUBLIC_ADSENSE_ID`, put your line in `public/ads.txt`, create ad units and set `NEXT_PUBLIC_AD_SLOT_HOME`, `_ARTICLE`, `_LISTING`.
- Ads load only after cookie consent. For visitors in the EEA/UK, Google requires a certified consent platform (use Google's Funding Choices in AdSense) instead of the simple banner.
- Use only your own images or official press assets. Do not copy other sites' text or art.
# Arise
# Arise
