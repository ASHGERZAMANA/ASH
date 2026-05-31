'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {Fragment, useState} from 'react'

import {buildHref, parseFilters, parseView, toggleFilter} from '@/app/lib/params'

type Filter = {_id: string; title: string; slug: string}

const PILL = 'rounded-md bg-black/10 px-2 py-1 uppercase'

export function NavLinks({filters: items}: {filters: Filter[]}) {
  const searchParams = useSearchParams()
  const view = parseView(searchParams.get('view') ?? undefined)
  const filters = parseFilters(searchParams.get('filter') ?? undefined)
  const noneActive = filters.length === 0
  const [mobileOpen, setMobileOpen] = useState(false)

  const aboutHref = buildHref({view, filters, about: true})

  return (
    <>
      {/* DESKTOP NAV — lg and up */}
      <div className="hidden flex-1 lg:block">
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

      <nav className="hidden flex-1 justify-center lg:flex">
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

      <div className="hidden flex-1 justify-end lg:flex">
        <span className={`${PILL} inline-flex items-center gap-2`}>
          <Link href="/">Ashagereh Zamana</Link>
          <Link href={aboutHref} scroll={false}>
            [ About (+) ]
          </Link>
        </span>
      </div>

      {/* MOBILE NAV — below lg */}
      <div className="flex w-full items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className={PILL}
          aria-expanded={mobileOpen}
        >
          [ Menu ({mobileOpen ? '-' : '+'}) ]
        </button>
        <Link href={aboutHref} className={PILL} scroll={false}>
          [ About (+) ]
        </Link>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-14 z-30 flex flex-col gap-6 px-5 pt-6 pb-10 text-white uppercase lg:hidden"
          style={{backgroundColor: 'rgba(32, 32, 32, 0.95)'}}
        >
          <section className="flex flex-col gap-1">
            <span className={`${PILL} self-start text-white`}>[ View mode ]</span>
            <Link
              href={buildHref({view: 'grid', filters})}
              onClick={() => setMobileOpen(false)}
              className={view === 'grid' ? 'underline' : ''}
              scroll={false}
            >
              (Grid)
            </Link>
            <Link
              href={buildHref({view: 'index', filters})}
              onClick={() => setMobileOpen(false)}
              className={view === 'index' ? 'underline' : ''}
              scroll={false}
            >
              (Index)
            </Link>
          </section>

          <section className="flex flex-col gap-1">
            <span className={`${PILL} self-start text-white`}>[ Filter ]</span>
            <Link
              href={buildHref({view, filters: []})}
              onClick={() => setMobileOpen(false)}
              className={noneActive ? 'underline' : ''}
              scroll={false}
            >
              (All)
            </Link>
            {items.map((f) => {
              const isActive = filters.includes(f.slug)
              const nextFilters = toggleFilter(filters, f.slug)
              return (
                <Link
                  key={f._id}
                  href={buildHref({view, filters: nextFilters})}
                  className={isActive ? 'underline' : ''}
                  scroll={false}
                >
                  ({f.title})
                </Link>
              )
            })}
          </section>
        </div>
      )}
    </>
  )
}
