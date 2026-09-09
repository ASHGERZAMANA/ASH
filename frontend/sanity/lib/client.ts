import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {token} from '@/sanity/lib/token'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // defineLive drives freshness through the live API and cache tags; reading
  // from the CDN on top of that serves stale content.
  useCdn: false,
  token, // Required if you have a private dataset
  stega: {studioUrl},
})
