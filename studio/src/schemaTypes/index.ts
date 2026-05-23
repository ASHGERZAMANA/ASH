import {media} from './objects/media'
import {seo} from './objects/seo'
import {filterCategory} from './documents/filterCategory'
import {project} from './documents/project'
import {about} from './singletons/about'
import {settings} from './singletons/settings'

export const schemaTypes = [
  // Singletons
  about,
  settings,
  // Documents
  project,
  filterCategory,
  // Objects
  media,
  seo,
]
