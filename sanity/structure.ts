import type { StructureResolver } from 'sanity/structure';
import { CATEGORIES } from '../lib/constants';

export const structure: StructureResolver = (S) =>
  S.list().title('Content').items([
    S.listItem().title('Games').schemaType('game').child(S.documentTypeList('game').title('Games')),
    S.divider(),
    S.listItem().title('All posts').schemaType('post').child(S.documentTypeList('post').title('All posts')),
    S.listItem().title('Posts by category').child(
      S.list().title('Categories').items(
        CATEGORIES.map((c) =>
          S.listItem().title(c.label).child(
            S.documentList().title(c.label).filter('_type == "post" && category == $c').params({ c: c.value }),
          ),
        ),
      ),
    ),
    S.divider(),
    S.listItem().title('Authors').schemaType('author').child(S.documentTypeList('author').title('Authors')),
  ]);
