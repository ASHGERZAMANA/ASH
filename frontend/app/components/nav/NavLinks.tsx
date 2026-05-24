'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {Fragment} from 'react'

import {buildHref, parseFilters, parseView, toggleFilter} from '@/app/lib/params'

type Filter = {_id: string; title: string; slug: string}

const PILL = 'rounded-md bg-black/10 px-2 py-1 uppercase'

export function NavLinks({filters: items}: {filters: Filter[]}) {
  const searchParams = useSearchParams()
  const view = parseView(searchParams.get('view') ?? undefined)
  const filters = parseFilters(searchParams.get('filter') ?? undefined)
  const noneActive = filters.length === 0

  return (
    <>
      <div className="flex-1">
        <span className={`${PILL} inline-flex items-center gap-2`}>
          <span>[ Works View Mode</span>
          <Link
            href={buildHref({view: 'grid', filters})}
            className={view === 'grid' ? 'underline' : ''}
            scroll={false}
          >
            (Grid)
          </Link>
          <Link
            href={buildHref({view: 'index', filters})}
            className={view === 'index' ? 'underline' : ''}
            scroll={false}
          >
            (Index)
          </Link>
          <span>]</span>
        </span>
      </div>

      <nav className="flex flex-1 justify-center">
        <span className={`${PILL} inline-flex items-center gap-2 whitespace-nowrap`}>
          <span>[</span>
          <Link
            href={buildHref({view, filters: []})}
            className={noneActive ? 'underline' : ''}
            scroll={false}
          >
            All
          </Link>
          {items.map((f) => {
            const isActive = filters.includes(f.slug)
            const nextFilters = toggleFilter(filters, f.slug)
            return (
              <Fragment key={f._id}>
                <span aria-hidden>·</span>
                <Link
                  href={buildHref({view, filters: nextFilters})}
                  className={isActive ? 'underline' : ''}
                  scroll={false}
                >
                  {f.title}
                </Link>
              </Fragment>
            )
          })}
          <span>]</span>
        </span>
      </nav>

      <div className="flex flex-1 justify-end">
        <span className={`${PILL} inline-flex items-center gap-2`}>
          <Link href="/">Ashagereh Zamana</Link>
          <Link href={buildHref({view, filters, about: true})} scroll={false}>
            [ About (+) ]
          </Link>
        </span>
      </div>
    </>
  )
}
