import {defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
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
      name: 'projectInfo',
      title: 'Project info',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short metadata line (role, date, location, etc.).',
    }),
    defineField({
      name: 'projectDescription',
      title: 'Project description',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'mainMedia',
      title: 'Main media',
      type: 'media',
      group: 'media',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projectMedia',
      title: 'Project media',
      type: 'array',
      group: 'media',
      of: [{type: 'media'}],
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
