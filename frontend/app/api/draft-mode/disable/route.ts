import {draftMode} from 'next/headers'

/**
 * Leaves draft mode. Presentation exits on its own, so this is for the times
 * you end up in draft mode on the site itself and want out.
 */
export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()
  return Response.redirect(new URL('/', request.url), 307)
}
