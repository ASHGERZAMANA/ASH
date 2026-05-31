import {defineField, defineType} from 'sanity'
import {PlayIcon, ImageIcon} from '@sanity/icons'

const IMAGE_MAX_BYTES = 5 * 1024 * 1024
const VIDEO_MAX_BYTES = 10 * 1024 * 1024

export const media = defineType({
  name: 'media',
  title: 'Media',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'image',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.type !== 'image',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const parent = ctx.parent as {type?: string} | undefined
          if (parent?.type !== 'image') return true
          if (!value?.asset) return 'Image is required'
          const size = (value.asset as unknown as {size?: number})?.size
          if (typeof size === 'number' && size > IMAGE_MAX_BYTES) {
            return `Image must be 5MB or smaller (got ${(size / 1024 / 1024).toFixed(2)}MB)`
          }
          return true
        }),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/*'},
      hidden: ({parent}) => parent?.type !== 'video',
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const parent = ctx.parent as {type?: string} | undefined
          if (parent?.type !== 'video') return true
          if (!value?.asset) return 'Video is required'
          const size = (value.asset as unknown as {size?: number})?.size
          if (typeof size === 'number' && size > VIDEO_MAX_BYTES) {
            return `Video must be 10MB or smaller (got ${(size / 1024 / 1024).toFixed(2)}MB)`
          }
          return true
        }),
    }),
    defineField({
      name: 'imageInfo',
      title: 'Image info',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Shown on the project page next to this image.',
      hidden: ({parent}) => {
        // Hide when this media is the project's mainMedia (not inside the projectMedia array).
        // Array items have a `_key`; the mainMedia object does not.
        return !parent || !('_key' in (parent as object))
      },
    }),
  ],
  preview: {
    select: {
      type: 'type',
      image: 'image',
    },
    prepare({type, image}) {
      return {
        title: type === 'video' ? 'Video' : 'Image',
        media: type === 'video' ? PlayIcon : image || ImageIcon,
      }
    },
  },
})
