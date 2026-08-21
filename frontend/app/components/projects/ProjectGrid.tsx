import type {CSSProperties} from 'react'

import type {ProjectsListQueryResult} from '@/sanity.types'

import {ProjectGridCard} from './ProjectGridCard'

/** Zigzag across three slots: 0, 1, 2, 1, 0, 1, 2 … */
function slot(i: number) {
  const step = i % 4
  return step === 3 ? 1 : step
}

/**
 * Desktop: staircase — projects step left → middle → right, then back down
 * middle → left and up again, one per row, so three fit in the viewport.
 * Mobile: two slots, alternating left → right.
 */
export function ProjectGrid({projects}: {projects: ProjectsListQueryResult}) {
  return (
    <div className="stair-grid grid grid-cols-1 gap-y-[4.5rem] md:grid-cols-12">
      {projects.map((project, i) => (
        <div
          key={project._id}
          className="stair-item"
          style={
            {
              '--stair-col': slot(i) * 3 + 1,
              '--stair-row': i + 1,
              // Gap from the card's right edge to the grid's, as a share of card width.
              '--stair-right': `${((8 - slot(i) * 3) / 4) * 100}%`,
            } as CSSProperties
          }
        >
          <ProjectGridCard project={project} mobileAlign={i % 2 === 0 ? 'left' : 'right'} />
        </div>
      ))}
    </div>
  )
}
