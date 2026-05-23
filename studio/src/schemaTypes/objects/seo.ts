import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Shown in browser tabs and search results. ~60 characters.',
      validation: (rule) => rule.max(70).warning('Should be 70 characters or fewer.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Shown under the title in search results. ~160 characters.',
      validation: (rule) => rule.max(180).warning('Should be 180 characters or fewer.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: 'Used for Open Graph (Facebook, LinkedIn) and Twitter cards. 1200×630 recommended.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describes the share image. May differ from in-page alt.',
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'If enabled, adds noindex meta tag.',
      initialValue: false,
    }),
  ],
  options: {collapsible: true, collapsed: true},
})
