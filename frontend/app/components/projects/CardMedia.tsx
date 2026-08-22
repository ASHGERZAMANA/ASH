import Image from 'next/image'

import {urlForImage} from '@/sanity/lib/image'
import type {ProjectsListQueryResult} from '@/sanity.types'

type Media = NonNullable<ProjectsListQueryResult[number]['mainMedia']>

export function CardMedia({
  media,
  sizes,
  objectFit = 'cover',
  intrinsic = false,
  className,
}: {
  media: Media
  sizes?: string
  objectFit?: 'cover' | 'contain'
  /** Render at the asset's own aspect ratio instead of filling the parent box. */
  intrinsic?: boolean
  /** Classes for the media element itself. Only used with `intrinsic`. */
  className?: string
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
        className={intrinsic ? className : `h-full w-full ${fitClass}`}
      />
    )
  }
  if (media.type === 'image' && media.image?.asset) {
    const url = urlForImage(media.image)?.width(1200).url()
    if (!url) return null
    if (intrinsic) {
      const dimensions = media.image.asset.metadata?.dimensions
      return (
        <Image
          src={url}
          alt={media.image.alt || ''}
          width={dimensions?.width ?? 1200}
          height={dimensions?.height ?? 1200}
          sizes={sizes}
          className={className}
        />
      )
    }
    return (
      <Image src={url} alt={media.image.alt || ''} fill sizes={sizes} className={fitClass} />
    )
  }
  return null
}
