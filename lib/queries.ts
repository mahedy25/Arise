const card = `_id, title, "slug": slug.current, excerpt, category, trust, spoiler, featured, publishedAt,
  "cover": cover{asset, alt}, "game": game->{title, "slug": slug.current}`;

export const homePosts = `*[_type=="post"] | order(publishedAt desc)[0..29]{${card}}`;
export const postsByCategory = `*[_type=="post" && category==$category] | order(publishedAt desc)[$from...$to]{${card}}`;
export const countByCategory = `count(*[_type=="post" && category==$category])`;
export const postsByGame = `*[_type=="post" && game->slug.current==$slug] | order(publishedAt desc)[$from...$to]{${card}}`;
export const countByGame = `count(*[_type=="post" && game->slug.current==$slug])`;
export const gameBySlug = `*[_type=="game" && slug.current==$slug][0]{title, tagline, releaseDate, status, "cover": cover{asset, alt}}`;
export const gamesList = `*[_type=="game" && defined(slug.current)] | order(title asc){
  title, "slug": slug.current, tagline, status, "cover": cover{asset, alt},
  "postCount": count(*[_type=="post" && references(^._id)])
}`;
export const postBySlug = `*[_type=="post" && slug.current==$slug][0]{
  ${card}, body, tags, sources, seoTitle, seoDescription, _updatedAt, "author": author->{name, bio}
}`;
export const relatedPosts = `*[_type=="post" && slug.current!=$slug && (game->slug.current==$game || category==$category)] | order(publishedAt desc)[0..2]{${card}}`;
export const allSlugs = `*[_type=="post" && defined(slug.current)]{"slug": slug.current, _updatedAt}`;
export const allGameSlugs = `*[_type=="game" && defined(slug.current)]{"slug": slug.current}`;
export const feedPosts = `*[_type=="post"] | order(publishedAt desc)[0..24]{title, "slug": slug.current, excerpt, publishedAt}`;
