import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from 'next-sanity'

import {
  ActiveImageInfo,
  ActiveMedia,
  MediaProvider,
} from '@/app/components/projects/MediaWithDock'
import {client} from '@/sanity/lib/client'
import {urlForImage} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {unbrandStega} from '@/sanity/lib/stega'
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
  const projectMedia = unbrandStega(project.projectMedia) ?? []

  return (
    <article className="flex flex-col gap-8 pt-37">
      <MediaProvider projectMedia={projectMedia}>
        {/* TOP CONTAINER — image (left) + prev/next at top, content at bottom of column */}
        <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:justify-between">
          <ActiveMedia />

          <div className="flex flex-col md:w-160 md:shrink-0 md:justify-between md:pt-32">
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

            <div className="flex flex-col gap-6">
              {project.projectOverview && project.projectOverview.length > 0 && (
                <div className="[&_p]:my-0">
                  <PortableText value={project.projectOverview} />
                </div>
              )}
              {project.info && project.info.length > 0 && (
                <section>
                  <h3 className="uppercase">Info</h3>
                  <div className="[&_p]:my-0">
                    <PortableText value={project.info} />
                  </div>
                </section>
              )}
              {project.scope && project.scope.length > 0 && (
                <section>
                  <h3 className="uppercase">Scope</h3>
                  <div className="[&_p]:my-0">
                    <PortableText value={project.scope} />
                  </div>
                </section>
              )}
              <ActiveImageInfo />
              {project.credits && project.credits.length > 0 && (
                <section>
                  <h3 className="uppercase">Credits</h3>
                  <div className="[&_p]:my-0">
                    <PortableText value={project.credits} />
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </MediaProvider>

      {/* BOTTOM CONTAINER — client + project title, width matches image above */}
      <div className="flex flex-wrap items-baseline gap-x-12 gap-y-2 text-5xl md:w-260 md:justify-between md:text-[2.8rem]">
        {project.clientName && <span>{project.clientName}</span>}
        {project.projectName && <span className="opacity-40">{project.projectName}</span>}
      </div>
    </article>
  )
}
