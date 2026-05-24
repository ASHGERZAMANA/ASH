import Image from 'next/image'
import Link from 'next/link'

import {urlForImage} from '@/sanity/lib/image'
import type {ProjectsListQueryResult} from '@/sanity.types'

const SIZES = '50vw'

export function ProjectIndex({projects}: {projects: ProjectsListQueryResult}) {
  if (projects.length === 0) return null

  return (
    <div className="index-view relative">
      <ul className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4">
        {projects.map((project, i) => {
          const hoverUrl = project.mainHoverImage
            ? urlForImage(project.mainHoverImage)?.width(1600).url()
            : undefined
          return (
            <li
              key={project._id}
              data-index-item
              className="index-item relative aspect-square"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="flex h-full w-full items-center justify-start px-4 font-sans text-[10px] uppercase"
              >
                {project.clientName}
              </Link>
              {hoverUrl && (
                <div className="index-bg pointer-events-none fixed inset-0 z-[-1] flex items-center justify-center opacity-0 transition-opacity duration-200">
                  <Image
                    src={hoverUrl}
                    alt=""
                    width={1200}
                    height={1200}
                    sizes={SIZES}
                    className="max-h-[60vh] w-auto max-w-[60vw] object-contain"
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <style>{`
        .index-item:hover .index-bg { opacity: 1; }
        .index-view:not(:has(.index-item:hover)) .index-item:first-child .index-bg { opacity: 1; }
      `}</style>
    </div>
  )
}
