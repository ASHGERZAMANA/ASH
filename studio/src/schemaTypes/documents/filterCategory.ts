import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const filterCategory = defineType({
  name: 'filterCategory',
  title: 'Filter',
  type: 'document',
  icon: TagIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    orderRankField({type: 'filterCategory'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})
