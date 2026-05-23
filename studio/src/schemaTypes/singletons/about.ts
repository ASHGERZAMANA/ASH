import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'bio', title: 'Bio', default: true},
    {name: 'links', title: 'CV & Links'},
    {name: 'lists', title: 'Lists'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'bioImage',
      title: 'Bio image',
      type: 'image',
      group: 'bio',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
    }),
    defineField({
      name: 'bioName',
      title: 'Bio name',
      type: 'string',
      group: 'bio',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      group: 'bio',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'availabilityStatus',
      title: 'Availability status',
      type: 'string',
      group: 'bio',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Booked', value: 'booked'},
          {title: 'Not taking work', value: 'unavailable'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'links',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'cv',
      title: 'CV',
      type: 'file',
      group: 'links',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'selectedClients',
      title: 'Selected clients',
      type: 'array',
      group: 'lists',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'exhibitions',
      title: 'Exhibitions',
      type: 'array',
      group: 'lists',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({title: 'About'}),
  },
})
