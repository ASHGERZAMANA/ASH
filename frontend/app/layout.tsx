import './globals.css'

import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'

import {SanityLive} from '@/sanity/lib/live'

export const metadata: Metadata = {
  title: 'App',
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en">
      <body>
        {isDraftMode && <VisualEditing />}
        <SanityLive />
        {children}
      </body>
    </html>
  )
}
