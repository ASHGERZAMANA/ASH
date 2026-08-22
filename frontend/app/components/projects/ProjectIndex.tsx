import Image from 'next/image'
import Link from 'next/link'

import {urlForImage} from '@/sanity/lib/image'
import type {ProjectsListQueryResult} from '@/sanity.types'

const SIZES = '100vw'

export function ProjectIndex({projects}: {projects: ProjectsListQueryResult}) {
  if (projects.length === 0) return null

  return (
    <>
      {/* MOBILE/TABLET LIST — below md */}
      <ul className="flex flex-col uppercase md:hidden">
        {projects.map((project) => (
          <li key={project._id}>
            <Link
              href={`/projects/${project.slug}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4"
            >
              <span>{project.projectNumber || '—'}.</span>
              <span>{project.clientName}</span>
              <span>{project.mediaCount ?? 0} items</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* DESKTOP GRID — md and up */}
      <div className="index-view relative hidden md:block">
        <ul className="grid grid-cols-3 gap-px lg:grid-cols-4">
          {projects.map((project) => {
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
                  className="flex h-full w-full items-center justify-center px-4 text-[10px] uppercase mix-blend-difference text-white"
                >
                  {project.clientName}
                </Link>
                {hoverUrl && (
                  <div className="index-bg pointer-events-none fixed inset-0 -z-10 p-8 opacity-0 transition-opacity duration-200">
                    <Image
                      src={hoverUrl}
                      alt=""
                      width={1200}
                      height={1200}
                      sizes={SIZES}
                      className="h-full w-full object-contain"
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
    </>
  )
}
