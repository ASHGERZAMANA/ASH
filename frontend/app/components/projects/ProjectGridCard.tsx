import Link from 'next/link'

import type {ProjectsListQueryResult} from '@/sanity.types'

import {CardMedia} from './CardMedia'

type Project = ProjectsListQueryResult[number]
type Media = NonNullable<Project['mainMedia']>

const assetId = (media: Media) => media.image?.asset?._id ?? media.video?.asset?._id

// The card image is height-constrained on desktop, so it never needs a wide source.
const SIZES = '(min-width: 768px) 480px, 40vw'
const PREVIEW_SIZES = '(min-width: 768px) 400px, 0px'

export function ProjectGridCard({
  project,
  mobileAlign = 'left',
}: {
  project: Project
  /** Which edge the card hugs below md — the mobile layout alternates left / right. */
  mobileAlign?: 'left' | 'right'
}) {
  const right = mobileAlign === 'right'
  // The first project media is often the main image again — show what follows it.
  const mainId = project.mainMedia ? assetId(project.mainMedia) : undefined
  const previews = (project.previewMedia ?? [])
    .filter((media) => !mainId || assetId(media) !== mainId)
    .slice(0, 3)

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`relative block max-md:w-[62%] ${right ? 'max-md:ml-auto max-md:text-right' : ''}`}
    >
      {project.mainMedia && (
        <div className={`max-md:w-[56%] md:h-[clamp(12rem,17vh,20rem)] ${right ? 'max-md:ml-auto' : ''}`}>
          <CardMedia
            media={project.mainMedia}
            sizes={SIZES}
            intrinsic
            className="h-auto w-full object-contain md:h-full md:w-auto"
          />
        </div>
      )}
      {previews.length > 0 && (
        <div className="stair-previews">
          {previews.map((media, i) => (
            <div key={i} className="h-[clamp(12rem,17vh,20rem)]">
              <CardMedia
                media={media}
                sizes={PREVIEW_SIZES}
                intrinsic
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      )}
      <div
        className={`mt-3 flex gap-[6rem] text-[1.4rem] leading-tight uppercase md:grid md:grid-cols-2 md:gap-0 md:text-[2rem] ${
          right ? 'max-md:justify-end' : ''
        }`}
      >
        <span className="shrink-0">[{project.projectNumber || '—'}]</span>
        {/* min-w-0 so a long client name wraps instead of running off the card. */}
        <span className="min-w-0">{project.clientName}</span>
      </div>
      <div className="text-[1.4rem] leading-tight text-neutral-500 uppercase md:text-[2rem]">
        {project.projectName}
      </div>
      {project.scopeText && (
        <p className={`mt-4 max-w-[46ch] ${right ? 'max-md:ml-auto' : ''}`}>{project.scopeText}</p>
      )}
    </Link>
  )
}
