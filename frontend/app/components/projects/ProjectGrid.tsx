import type {ProjectsListQueryResult} from '@/sanity.types'

import {ProjectGridCard} from './ProjectGridCard'

export function ProjectGrid({projects}: {projects: ProjectsListQueryResult}) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16 lg:grid-cols-3 lg:gap-46">
      {projects.map((project) => (
        <ProjectGridCard key={project._id} project={project} />
      ))}
    </div>
  )
}
