import {defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'taxonomy', title: 'Taxonomy'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'projectName',
      title: 'Project name',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'projectName', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projectNumber',
      title: 'Project number',
      type: 'string',
      group: 'content',
      description: 'Display number, e.g. "001".',
    }),
    defineField({
      name: 'clientName',
      title: 'Client name',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'projectOverview',
      title: 'Project overview',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'info',
      title: 'Info',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'mainMedia',
      title: 'Main media',
      type: 'media',
      group: 'media',
      description: 'Used as the project image on the homepage grid.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainHoverImage',
      title: 'Main hover image',
      type: 'image',
      group: 'media',
      description: 'Shown on hover over the project card. Max 5MB.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.asset) return true
          const size = (value.asset as unknown as {size?: number})?.size
          if (typeof size === 'number' && size > 5 * 1024 * 1024) {
            return `Image must be 5MB or smaller (got ${(size / 1024 / 1024).toFixed(2)}MB)`
          }
          return true
        }),
    }),
    defineField({
      name: 'projectMedia',
      title: 'Project media',
      type: 'array',
      group: 'media',
      description: 'Shown on the project page. First item is the initial big image. Each item requires an Image info.',
      of: [{type: 'media'}],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((items) => {
            if (!Array.isArray(items)) return true
            const missing = items
              .map((item, i) => ({i, info: (item as {imageInfo?: unknown[]} | null)?.imageInfo}))
              .filter(({info}) => !Array.isArray(info) || info.length === 0)
            if (missing.length === 0) return true
            return `Image info is required on every project media item (missing on item ${missing
              .map(({i}) => i + 1)
              .join(', ')})`
          }),
    }),
    defineField({
      name: 'filters',
      title: 'Filters',
      type: 'array',
      group: 'taxonomy',
      of: [{type: 'reference', to: [{type: 'filterCategory'}]}],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    orderRankField({type: 'project'}),
  ],
  preview: {
    select: {
      title: 'projectName',
      subtitle: 'clientName',
      type: 'mainMedia.type',
      image: 'mainMedia.image',
    },
    prepare({title, subtitle, type, image}) {
      return {
        title: title || 'Untitled project',
        subtitle,
        media: type === 'image' ? image : undefined,
      }
    },
  },
})
