'use client'

import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'

import {urlForImage} from '@/sanity/lib/image'
import type {ProjectBySlugQueryResult} from '@/sanity.types'

type Media = NonNullable<NonNullable<ProjectBySlugQueryResult>['mainMedia']>

function MediaDisplay({media}: {media: Media}) {
  if (media.type === 'video' && media.video?.asset?.url) {
    return (
      <video
        src={media.video.asset.url}
        controls
        playsInline
        className="max-h-full max-w-full object-contain"
      />
    )
  }
  if (media.type === 'image' && media.image?.asset) {
    const url = urlForImage(media.image)?.width(1600).url()
    if (!url) return null
    return (
      <Image
        src={url}
        alt={media.image.alt || ''}
        fill
        sizes="815px"
        className="object-contain"
      />
    )
  }
  return null
}

function ThumbnailPreview({media}: {media: Media}) {
  if (media.type === 'video' && media.video?.asset?.url) {
    return (
      <video
        src={media.video.asset.url}
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    )
  }
  if (media.type === 'image' && media.image?.asset) {
    const url = urlForImage(media.image)?.width(280).url()
    if (!url) return null
    return (
      <Image
        src={url}
        alt={media.image.alt || ''}
        fill
        sizes="140px"
        className="object-cover"
      />
    )
  }
  return null
}

export function MediaWithDock({
  mainMedia,
  projectMedia,
}: {
  mainMedia: Media
  projectMedia: Media[]
}) {
  const allMedia: Media[] = [mainMedia, ...projectMedia]
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDockOpen, setIsDockOpen] = useState(false)
  const [cursor, setCursor] = useState<{x: number; y: number; visible: boolean}>({
    x: 0,
    y: 0,
    visible: false,
  })
  const mediaRef = useRef<HTMLDivElement>(null)

  const active = allMedia[activeIndex] ?? mainMedia
  const showDock = projectMedia.length > 0
  const totalMedia = allMedia.length

  useEffect(() => {
    if (!showDock) return
    if (isDockOpen) document.body.dataset.dockOpen = 'true'
    else delete document.body.dataset.dockOpen
    return () => {
      delete document.body.dataset.dockOpen
    }
  }, [isDockOpen, showDock])

  return (
    <>
      <div
        ref={mediaRef}
        onClick={() => setActiveIndex((i) => (i + 1) % totalMedia)}
        onMouseEnter={(e) => setCursor({x: e.clientX, y: e.clientY, visible: true})}
        onMouseMove={(e) => setCursor({x: e.clientX, y: e.clientY, visible: true})}
        onMouseLeave={() => setCursor((c) => ({...c, visible: false}))}
        className="relative flex aspect-square w-full cursor-none items-center justify-center md:size-260 md:shrink-0"
      >
        <MediaDisplay media={active} />
      </div>

      {/* Custom cursor */}
      {cursor.visible && (
        <div
          className="pointer-events-none fixed z-50 font-sans text-white uppercase mix-blend-difference"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(12px, 12px)',
          }}
        >
          [ {activeIndex + 1}/{totalMedia} ]
        </div>
      )}

      {showDock && (
        <>
          {/* Hot zone */}
          <div
            className="fixed inset-x-0 bottom-0 z-30 h-2.5"
            onMouseEnter={() => setIsDockOpen(true)}
          />

          {/* Dock */}
          <div
            onMouseEnter={() => setIsDockOpen(true)}
            onMouseLeave={() => setIsDockOpen(false)}
            className={`fixed inset-x-0 bottom-0 z-40 flex h-56 items-center gap-4 overflow-x-auto px-5 transition-transform duration-300 ${
              isDockOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {allMedia.map((media, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="relative aspect-square h-36 shrink-0 overflow-hidden"
                aria-label={`Show media ${i + 1}`}
              >
                <ThumbnailPreview media={media} />
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
