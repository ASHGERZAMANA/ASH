import Image from 'next/image'

import {urlForImage} from '@/sanity/lib/image'
import type {ProjectsListQueryResult} from '@/sanity.types'

type Media = NonNullable<ProjectsListQueryResult[number]['mainMedia']>

export function CardMedia({
  media,
  sizes,
  objectFit = 'cover',
}: {
  media: Media
  sizes?: string
  objectFit?: 'cover' | 'contain'
}) {
  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover'

  if (media.type === 'video' && media.video?.asset?.url) {
    return (
      <video
        src={media.video.asset.url}
        muted
        loop
        playsInline
        autoPlay
        className={`h-full w-full ${fitClass}`}
      />
    )
  }
  if (media.type === 'image' && media.image?.asset) {
    const url = urlForImage(media.image)?.width(1200).url()
    if (!url) return null
    return (
      <Image src={url} alt={media.image.alt || ''} fill sizes={sizes} className={fitClass} />
    )
  }
  return null
}
