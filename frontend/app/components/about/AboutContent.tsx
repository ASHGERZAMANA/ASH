import Image from 'next/image'
import {PortableText} from 'next-sanity'

import {rgbToCss} from '@/sanity/lib/color'
import {urlForImage} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {aboutQuery} from '@/sanity/lib/queries'

const PILL = 'rounded-md bg-black/10 px-2 py-1 uppercase'

export async function AboutContent() {
  const {data: about} = await sanityFetch({query: aboutQuery})
  if (!about) return null

  const bioUrl = about.bioImage ? urlForImage(about.bioImage)?.width(400).url() : undefined
  const cvUrl = about.cv?.asset?.url
  const bgColor = rgbToCss(about.bgColor)

  return (
    <div
      className="min-h-full px-5 py-37"
      style={bgColor ? {backgroundColor: bgColor} : undefined}
    >
      <div className="grid grid-cols-1 items-start gap-x-8 gap-y-3 md:grid-cols-5 md:grid-rows-[auto_auto]">
        {/* Row 1, Col 1 — Portrait (spans bio+pill rows) */}
        <div className="md:row-span-2 md:self-stretch">
          {bioUrl && (
            <Image
              src={bioUrl}
              alt={about.bioImage?.alt || about.bioName || ''}
              width={400}
              height={500}
              sizes="200px"
              className="border border-black/30"
              style={{height: '100%', width: 'auto'}}
            />
          )}
        </div>

        {/* Row 1, Col 2 — bioName */}
        {about.bioName ? <p className="uppercase">{about.bioName}</p> : <div />}

        {/* Row 1, Col 3 — Bio */}
        {about.bio ? (
          <div className="uppercase leading-relaxed [&_p]:mb-0">
            <PortableText value={about.bio} />
          </div>
        ) : (
          <div />
        )}

        {/* Row 1, Col 4 — Empty spacer */}
        <div aria-hidden className="md:row-span-2" />

        {/* Row 1, Col 5 — Selected Clients + Exhibitions (spans both rows) */}
        <div className="flex gap-12 md:row-span-2">
          <div>
            {about.selectedClients && about.selectedClients.length > 0 && (
              <>
                <h3 className="mb-6 underline uppercase">Selected clients:</h3>
                <ul className="uppercase">
                  {about.selectedClients.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            {about.exhibitions && about.exhibitions.length > 0 && (
              <>
                <h3 className="mb-6 underline uppercase">Exhibitions:</h3>
                <ul className="uppercase">
                  {about.exhibitions.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Row 2, Col 2 — Pill */}
        <div className="md:col-start-2">
          <span className={`${PILL} inline-flex items-center gap-2`}>
            <span>[</span>
            {about.email && <a href={`mailto:${about.email}`}>Email</a>}
            {about.email && (about.instagramUrl || cvUrl) && <span aria-hidden>·</span>}
            {about.instagramUrl && (
              <a href={about.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {about.instagramUrl && cvUrl && <span aria-hidden>·</span>}
            {cvUrl && (
              <a href={cvUrl} download>
                CV
              </a>
            )}
            <span>]</span>
          </span>
        </div>

        {/* Row 2, Col 3 — Availability */}
        {about.availabilityStatus && (
          <p className="uppercase md:col-start-3">{about.availabilityStatus}</p>
        )}
      </div>
    </div>
  )
}
