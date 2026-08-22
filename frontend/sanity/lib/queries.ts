import {defineQuery} from 'next-sanity'

export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`)

export const adjacentProjectsQuery = defineQuery(`
  {
    "all": *[_type == "project" && defined(slug.current)] | order(orderRank asc){
      "slug": slug.current,
      projectName,
      clientName
    }
  }
`)

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    projectName,
    "slug": slug.current,
    projectNumber,
    clientName,
    projectInfo,
    projectOverview,
    info,
    scope,
    credits,
    mainHoverImage{..., "asset": asset->},
    projectMedia[]{
      type,
      "image": image{..., "asset": asset->},
      "video": video{..., "asset": asset->},
      imageInfo
    },
    filters[]->{ _id, title, "slug": slug.current },
    seo
  }
`)

export const projectsListQuery = defineQuery(`
  *[
    _type == "project"
    && defined(slug.current)
    && (count($filters) == 0 || count(filters[@->slug.current in $filters]) > 0)
  ] | order(orderRank asc){
    _id,
    projectName,
    "slug": slug.current,
    clientName,
    projectNumber,
    "scopeText": pt::text(scope),
    "mediaCount": count(projectMedia),
    mainMedia{
      type,
      "image": image{..., "asset": asset->},
      "video": video{..., "asset": asset->}
    },
    mainHoverImage{..., "asset": asset->},
    "previewMedia": projectMedia[0...4]{
      type,
      "image": image{..., "asset": asset->},
      "video": video{..., "asset": asset->}
    },
    filters[]->{ "slug": slug.current }
  }
`)

export const filtersQuery = defineQuery(`
  *[_type == "filterCategory"] | order(orderRank asc){
    _id,
    title,
    "slug": slug.current
  }
`)

export const aboutContactQuery = defineQuery(`
  *[_id == "about"][0]{ email, instagramUrl }
`)

export const aboutQuery = defineQuery(`
  *[_id == "about"][0]{
    "bgColor": bgColor.rgb,
    bioImage{..., "asset": asset->},
    bioName,
    bio,
    availabilityStatus,
    selectedClients,
    exhibitions,
    email,
    cv{..., "asset": asset->},
    instagramUrl
  }
`)

export const settingsQuery = defineQuery(`
  *[_id == "settings"][0]{
    defaultSeo,
    "bgColor": bgColor.rgb
  }
`)
