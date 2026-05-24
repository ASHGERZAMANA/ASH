import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from 'next-sanity'

import {client} from '@/sanity/lib/client'
import {urlForImage} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {
  adjacentProjectsQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  settingsQuery,
} from '@/sanity/lib/queries'

type Params = Promise<{slug: string}>

export async function generateStaticParams() {
  const slugs = await client.fetch(
    projectSlugsQuery,
    {},
    {perspective: 'published', stega: false},
  )
  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const {slug} = await params
  const [{data: project}, {data: settings}] = await Promise.all([
    sanityFetch({query: projectBySlugQuery, params: {slug}, stega: false}),
    sanityFetch({query: settingsQuery, stega: false}),
  ])

  if (!project) return {}

  const seo = project.seo
  const fallback = settings?.defaultSeo
  const title = seo?.title || project.projectName || fallback?.title
  const description = seo?.description || project.projectInfo || fallback?.description
  const ogImage = urlForImage(seo?.ogImage || fallback?.ogImage)?.width(1200).height(630).url()

  return {
    title,
    description,
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      images: ogImage ? [{url: ogImage, width: 1200, height: 630}] : undefined,
    },
    robots: seo?.noIndex ? {index: false, follow: false} : undefined,
  }
}

function ProjectMedia({
  media,
}: {
  media: NonNullable<
    NonNullable<Awaited<ReturnType<typeof sanityFetch<typeof projectBySlugQuery>>>['data']>['mainMedia']
  >
}) {
  if (media.type === 'video' && media.video?.asset?.url) {
    return (
      <video
        src={media.video.asset.url}
        controls
        playsInline
        className="max-h-full max-w-full object-contain"
      />
    )
  }
  if (media.type === 'image' && media.image?.asset) {
    const url = urlForImage(media.image)?.width(1600).url()
    if (!url) return null
    return (
      <Image
        src={url}
        alt={media.image.alt || ''}
        fill
        sizes="815px"
        className="object-contain"
      />
    )
  }
  return null
}

export default async function ProjectPage({params}: {params: Params}) {
  const {slug} = await params
  const [{data: project}, {data: adjacent}] = await Promise.all([
    sanityFetch({query: projectBySlugQuery, params: {slug}}),
    sanityFetch({query: adjacentProjectsQuery, stega: false}),
  ])

  if (!project) notFound()

  const all = adjacent?.all ?? []
  const idx = all.findIndex((p) => p.slug === slug)
  const prev = idx > 0 ? all[idx - 1] : all[all.length - 1]
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : all[0]

  return (
    <article className="flex flex-col gap-8 pt-37">
      {/* TOP CONTAINER — image (left) + prev/next + description (right, bottom-aligned) */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="relative flex aspect-square w-full items-center justify-center md:size-260 md:shrink-0">
          {project.mainMedia && <ProjectMedia media={project.mainMedia} />}
        </div>

        <div className="flex flex-col gap-6 md:w-160 md:shrink-0">
          <nav className="flex items-center justify-between uppercase">
            {prev?.slug ? (
              <Link href={`/projects/${prev.slug}`}>Previous work</Link>
            ) : (
              <span />
            )}
            {next?.slug ? (
              <Link href={`/projects/${next.slug}`}>Next work</Link>
            ) : (
              <span />
            )}
          </nav>

          {project.projectDescription && project.projectDescription.length > 0 && (
            <div className="space-y-4 [&_p]:my-0 [&_strong]:font-normal [&_strong]:uppercase">
              <PortableText value={project.projectDescription} />
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CONTAINER — client + project title */}
      <div className="flex flex-wrap items-baseline gap-x-12 gap-y-2 font-sans text-5xl md:text-7xl">
        {project.clientName && <span>{project.clientName}</span>}
        {project.projectName && <span className="opacity-40">{project.projectName}</span>}
      </div>
    </article>
  )
}
