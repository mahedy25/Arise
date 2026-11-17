import { defineArrayMember, defineField, defineType } from 'sanity';

const author = defineType({
  name: 'author', title: 'Author', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'bio', type: 'text', rows: 3 }),
    defineField({ name: 'avatar', type: 'image' }),
  ],
});

const game = defineType({
  name: 'game', title: 'Game', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'cover', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({ name: 'releaseDate', title: 'Release date', type: 'datetime' }),
    defineField({ name: 'status', type: 'string', options: { list: ['Upcoming', 'Released', 'Delayed'] }, initialValue: 'Upcoming' }),
  ],
});

const post = defineType({
  name: 'post', title: 'Post', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(90) }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'game', type: 'reference', to: [{ type: 'game' }], description: 'Pick the game this post is about.' }),
    defineField({
      name: 'category', type: 'string', validation: (r) => r.required(),
      options: { list: [
        { title: 'News', value: 'news' }, { title: 'Guides', value: 'guides' },
        { title: 'Features', value: 'features' }, { title: 'Lists', value: 'lists' }, { title: 'Opinion', value: 'opinion' },
      ] },
    }),
    defineField({ name: 'trust', title: 'Report status (news only, optional)', type: 'string',
      options: { list: ['Confirmed', 'Rumor', 'Theory'] }, description: 'Leave empty for guides, features and lists.' }),
    defineField({ name: 'spoiler', title: 'Contains spoilers', type: 'boolean', initialValue: false }),
    defineField({ name: 'cover', type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (r) => r.required() }] }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: (r) => r.required().max(200) }),
    defineField({ name: 'body', type: 'array', of: [
      defineArrayMember({ type: 'block' }),
      defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }, { name: 'caption', type: 'string' }] }),
    ] }),
    defineField({ name: 'sources', title: 'Sources', type: 'array', description: 'Link where the information came from. Readers and Google both trust cited posts more.',
      of: [defineArrayMember({ type: 'object', fields: [
        { name: 'title', type: 'string', title: 'Source name' },
        { name: 'url', type: 'url', title: 'Link', validation: (r: any) => r.required() },
      ] })] }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'publishedAt', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false, description: 'Shows as the big lead story on the home page.' }),
    defineField({ name: 'seoTitle', title: 'SEO title (optional)', type: 'string', validation: (r) => r.max(60) }),
    defineField({ name: 'seoDescription', title: 'SEO description (optional)', type: 'text', rows: 2, validation: (r) => r.max(160) }),
  ],
  orderings: [{ title: 'Newest', name: 'new', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } },
});

export const schemaTypes = [author, game, post];
