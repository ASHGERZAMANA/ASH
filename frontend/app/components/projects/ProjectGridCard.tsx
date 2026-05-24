import Link from 'next/link'

import type {ProjectsListQueryResult} from '@/sanity.types'

import {CardMedia} from './CardMedia'

type Project = ProjectsListQueryResult[number]

const SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

export function ProjectGridCard({project}: {project: Project}) {
  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <div className="relative aspect-square">
        {project.mainMedia && (
          <CardMedia media={project.mainMedia} sizes={SIZES} objectFit="contain" />
        )}
      </div>
      {project.clientName && (
        <div className="mt-2 text-center uppercase">{project.clientName}</div>
      )}
    </Link>
  )
}
