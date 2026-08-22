import {sanityFetch} from '@/sanity/lib/live'
import {unbrandStega} from '@/sanity/lib/stega'
import {projectsListQuery} from '@/sanity/lib/queries'

import {ProjectGrid} from '@/app/components/projects/ProjectGrid'
import {ProjectIndex} from '@/app/components/projects/ProjectIndex'
import {parseFilters, parseView} from '@/app/lib/params'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function HomePage({searchParams}: {searchParams: SearchParams}) {
  const sp = await searchParams
  const view = parseView(sp.view)
  const filters = parseFilters(sp.filter)

  const {data} = await sanityFetch({
    query: projectsListQuery,
    params: {filters},
  })
  const projects = unbrandStega(data)

  return (
    <section className="pt-37 pb-8">
      {view === 'grid' ? (
        <ProjectGrid projects={projects ?? []} />
      ) : (
        <ProjectIndex projects={projects ?? []} />
      )}
    </section>
  )
}
