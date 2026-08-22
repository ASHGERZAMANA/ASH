import './globals.css'

import type {Metadata} from 'next'
import localFont from 'next/font/local'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense} from 'react'

import {AboutContent} from '@/app/components/about/AboutContent'
import {AboutDialogShell} from '@/app/components/about/AboutDialogShell'
import {Nav} from '@/app/components/nav/Nav'
import {SanityLive} from '@/sanity/lib/live'

const quadrantMono = localFont({
  src: './fonts/QuadrantTextMono-Regular.woff2',
  variable: '--font-quadrant-mono',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Ashagereh Zamana',
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={quadrantMono.variable}>
      <body className="font-mono max-md:py-[1.2rem]">
        {isDraftMode && <VisualEditing />}
        <SanityLive />
        <Nav />
        <main className="px-8">{children}</main>
        <Suspense>
          <AboutDialogShell>
            <AboutContent />
          </AboutDialogShell>
        </Suspense>
      </body>
    </html>
  )
}
