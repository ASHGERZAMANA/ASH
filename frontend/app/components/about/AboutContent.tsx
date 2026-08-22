import Image from 'next/image'
import {PortableText} from 'next-sanity'

import {urlForImage} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {aboutQuery} from '@/sanity/lib/queries'

const PILL = 'inline-flex items-center gap-2 rounded-md bg-white/10 px-2 py-1 uppercase'
const HEADING = 'mb-6 underline uppercase'

export async function AboutContent() {
  const {data: about} = await sanityFetch({query: aboutQuery})
  if (!about) return null

  const bioDims = about.bioImage?.asset?.metadata?.dimensions
  const bioUrl = about.bioImage ? urlForImage(about.bioImage)?.width(600).url() : undefined
  const cvUrl = about.cv?.asset?.url

  const portrait = bioUrl ? (
    <Image
      src={bioUrl}
      alt={about.bioImage?.alt || about.bioName || ''}
      width={bioDims?.width ?? 600}
      height={bioDims?.height ?? 800}
      sizes="(min-width: 768px) 200px, 40vw"
      className="h-auto w-full border border-white/20"
    />
  ) : null

  const bio = about.bio ? (
    <div className="uppercase [&_p]:mb-0">
      <PortableText value={about.bio} />
    </div>
  ) : null

  const availability = about.availabilityStatus ? (
    <p className="uppercase">{about.availabilityStatus}</p>
  ) : null

  const clients =
    about.selectedClients && about.selectedClients.length > 0 ? (
      <div>
        <h3 className={HEADING}>Selected clients:</h3>
        <ul className="uppercase">
          {about.selectedClients.map((client, i) => (
            <li key={i}>{client}</li>
          ))}
        </ul>
      </div>
    ) : null

  const exhibitions =
    about.exhibitions && about.exhibitions.length > 0 ? (
      <div>
        <h3 className={HEADING}>Exhibitions:</h3>
        <ul className="uppercase">
          {about.exhibitions.map((exhibition, i) => (
            <li key={i}>{exhibition}</li>
          ))}
        </ul>
      </div>
    ) : null

  const links = [
    about.email ? {label: 'Email', href: `mailto:${about.email}`} : null,
    about.instagramUrl ? {label: 'Instagram', href: about.instagramUrl, external: true} : null,
    cvUrl ? {label: 'CV', href: cvUrl, download: true} : null,
  ].filter((link) => link !== null)

  return (
    <div className="min-h-full bg-[#202020]/90 px-8 py-37 text-[#ededed]">
      {/* MOBILE — portrait and links stacked in a narrow left column */}
      <div className="grid grid-cols-[30%_1fr] items-start gap-x-[4.5rem] gap-y-[4.5rem] md:hidden">
        <div>{portrait}</div>
        <div className="flex flex-col gap-[3rem]">
          {about.bioName && <p className="uppercase">{about.bioName}</p>}
          {bio}
        </div>

        <div className="flex flex-col items-start gap-[1.2rem]">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={PILL}
              {...(link.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
              {...(link.download ? {download: true} : {})}
            >
              [ {link.label} ]
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-[6rem]">
          {availability}
          {clients}
          {exhibitions}
        </div>
      </div>

      {/* DESKTOP — portrait, name, bio, then the two lists */}
      <div className="hidden items-start gap-[9rem] md:flex">
        {/* Sized by the portrait, so the links and availability line up with its foot. */}
        <div className="flex basis-[58%] items-stretch gap-[4.5rem]">
          <div className="w-[13%] shrink-0">{portrait}</div>

          <div className="flex w-[22%] flex-col justify-between gap-8">
            {about.bioName ? <p className="uppercase">{about.bioName}</p> : <span />}
            {links.length > 0 && (
              <span className={`${PILL} self-start`}>
                <span>[</span>
                {links.map((link, i) => (
                  <span key={link.label} className="inline-flex items-center gap-2">
                    {i > 0 && <span aria-hidden>·</span>}
                    <a
                      href={link.href}
                      {...(link.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                      {...(link.download ? {download: true} : {})}
                    >
                      {link.label}
                    </a>
                  </span>
                ))}
                <span>]</span>
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between gap-8">
            {bio ?? <span />}
            {availability}
          </div>
        </div>

        <div className="flex gap-[6rem]">
          {clients}
          {exhibitions}
        </div>
      </div>
    </div>
  )
}
