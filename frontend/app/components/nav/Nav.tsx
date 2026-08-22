import {Suspense} from 'react'

import {sanityFetch} from '@/sanity/lib/live'
import {aboutContactQuery, filtersQuery} from '@/sanity/lib/queries'

import {NavLinks} from './NavLinks'

export async function Nav() {
  const [{data: filtersData}, {data: contact}] = await Promise.all([
    sanityFetch({query: filtersQuery, stega: false}),
    sanityFetch({query: aboutContactQuery, stega: false}),
  ])

  const filters = (filtersData ?? [])
    .filter((f): f is typeof f & {slug: string} => typeof f.slug === 'string')
    .map((f) => ({_id: f._id, title: f.title ?? '', slug: f.slug}))

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-8 py-6">
      <Suspense fallback={<div className="flex-1" />}>
        <NavLinks
          filters={filters}
          email={contact?.email ?? null}
          instagramUrl={contact?.instagramUrl ?? null}
        />
      </Suspense>
    </header>
  )
}
