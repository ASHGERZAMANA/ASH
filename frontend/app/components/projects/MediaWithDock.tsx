'use client'

import Image from 'next/image'
import {PortableText} from 'next-sanity'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {urlForImage} from '@/sanity/lib/image'
import type {ProjectBySlugQueryResult} from '@/sanity.types'

type Media = NonNullable<NonNullable<ProjectBySlugQueryResult>['projectMedia']>[number]

type Ctx = {
  activeIndex: number
  media: Media[]
  setActiveIndex: (i: number | ((prev: number) => number)) => void
}
const ActiveMediaContext = createContext<Ctx | null>(null)

function useActiveMedia() {
  const ctx = useContext(ActiveMediaContext)
  if (!ctx) throw new Error('useActiveMedia must be used inside <MediaProvider>')
  return ctx
}

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

export function MediaProvider({
  projectMedia,
  children,
}: {
  projectMedia: Media[]
  children: ReactNode
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDockOpen, setIsDockOpen] = useState(false)
  const showDock = projectMedia.length > 1

  useEffect(() => {
    if (!showDock) return
    if (isDockOpen) document.body.dataset.dockOpen = 'true'
    else delete document.body.dataset.dockOpen
    return () => {
      delete document.body.dataset.dockOpen
    }
  }, [isDockOpen, showDock])

  return (
    <ActiveMediaContext.Provider value={{activeIndex, media: projectMedia, setActiveIndex}}>
      {children}

      {showDock && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 z-30 h-2.5"
            onMouseEnter={() => setIsDockOpen(true)}
          />
          <div
            onMouseEnter={() => setIsDockOpen(true)}
            onMouseLeave={() => setIsDockOpen(false)}
            className={`fixed inset-x-0 bottom-0 z-40 flex h-56 items-center gap-4 overflow-x-auto px-5 transition-transform duration-300 ${
              isDockOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {projectMedia.map((media, i) => (
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
    </ActiveMediaContext.Provider>
  )
}

export function ActiveMedia() {
  const {activeIndex, media, setActiveIndex} = useActiveMedia()
  const [cursor, setCursor] = useState<{x: number; y: number; visible: boolean}>({
    x: 0,
    y: 0,
    visible: false,
  })
  const ref = useRef<HTMLDivElement>(null)
  const active = media[activeIndex] ?? media[0]
  const total = media.length

  return (
    <>
      <div
        ref={ref}
        onClick={() => setActiveIndex((i) => (i + 1) % total)}
        onMouseEnter={(e) => setCursor({x: e.clientX, y: e.clientY, visible: true})}
        onMouseMove={(e) => setCursor({x: e.clientX, y: e.clientY, visible: true})}
        onMouseLeave={() => setCursor((c) => ({...c, visible: false}))}
        className="relative flex aspect-square w-full cursor-none items-center justify-center md:size-260 md:shrink-0"
      >
        {active && <MediaDisplay media={active} />}
      </div>

      {cursor.visible && (
        <div
          className="pointer-events-none fixed z-50 text-white uppercase mix-blend-difference"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(12px, 12px)',
          }}
        >
          [ {activeIndex + 1}/{total} ]
        </div>
      )}
    </>
  )
}

export function ActiveImageInfo() {
  const {activeIndex, media} = useActiveMedia()
  const active = media[activeIndex]
  if (!active?.imageInfo || active.imageInfo.length === 0) return null

  return (
    <section>
      <h3 className="uppercase">Image info</h3>
      <div className="[&_p]:my-0">
        <PortableText value={active.imageInfo} />
      </div>
    </section>
  )
}
