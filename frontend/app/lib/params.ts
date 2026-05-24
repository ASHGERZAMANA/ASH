export type ViewMode = 'grid' | 'index'

export function parseFilters(value: string | string[] | undefined): string[] {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : value
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseView(value: string | string[] | undefined): ViewMode {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'index' ? 'index' : 'grid'
}

export function buildHref(params: {
  view?: ViewMode
  filters?: string[]
  about?: boolean
}): string {
  const search = new URLSearchParams()
  if (params.view && params.view !== 'grid') search.set('view', params.view)
  if (params.filters && params.filters.length > 0) search.set('filter', params.filters.join(','))
  if (params.about) search.set('about', '1')
  const qs = search.toString()
  return qs ? `/?${qs}` : '/'
}

export function toggleFilter(current: string[], slug: string): string[] {
  return current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
}
