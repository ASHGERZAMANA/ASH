import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      description: 'Used as fallback when a page has no SEO of its own.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Settings'}),
  },
})
