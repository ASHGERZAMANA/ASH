import {CogIcon, UserIcon, ProjectsIcon, TagIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

const SINGLETON_TYPES = new Set(['about', 'settings'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Projects')
        .icon(ProjectsIcon)
        .child(S.documentTypeList('project').title('Projects')),
      S.listItem()
        .title('Filters')
        .icon(TagIcon)
        .child(S.documentTypeList('filterCategory').title('Filters')),
      S.divider(),
      S.listItem()
        .title('About')
        .icon(UserIcon)
        .child(S.document().schemaType('about').documentId('about')),
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('settings')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          !SINGLETON_TYPES.has(item.getId() as string) &&
          !['project', 'filterCategory'].includes(item.getId() as string),
      ),
    ])
