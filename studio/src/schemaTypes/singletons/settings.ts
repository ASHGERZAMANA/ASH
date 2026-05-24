import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'appearance', title: 'Appearance', default: true},
    {name: 'seo', title: 'Default SEO'},
  ],
  fields: [
    defineField({
      name: 'bgColor',
      title: 'Background color',
      type: 'color',
      group: 'appearance',
      description: 'Applied site-wide as the page background. Use the slider for opacity.',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description: 'Used as fallback when a page has no SEO of its own.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Settings'}),
  },
})
