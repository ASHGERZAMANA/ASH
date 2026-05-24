import {Suspense} from 'react'

import {sanityFetch} from '@/sanity/lib/live'
import {filtersQuery} from '@/sanity/lib/queries'

import {NavLinks} from './NavLinks'

export async function Nav() {
  const {data} = await sanityFetch({query: filtersQuery, stega: false})
  const filters = (data ?? [])
    .filter((f): f is typeof f & {slug: string} => typeof f.slug === 'string')
    .map((f) => ({_id: f._id, title: f.title ?? '', slug: f.slug}))

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4">
      <Suspense fallback={<div className="flex-1" />}>
        <NavLinks filters={filters} />
      </Suspense>
    </header>
  )
}
