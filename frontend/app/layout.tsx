import './globals.css'

import type {Metadata} from 'next'
import localFont from 'next/font/local'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense} from 'react'

import {AboutContent} from '@/app/components/about/AboutContent'
import {AboutDialogShell} from '@/app/components/about/AboutDialogShell'
import {Nav} from '@/app/components/nav/Nav'
import {rgbToCss} from '@/sanity/lib/color'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'

const quadrant = localFont({
  src: './fonts/QuadrantText-201218-Medium.woff2',
  variable: '--font-quadrant',
  display: 'swap',
  weight: '500',
})

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
  const [{isEnabled: isDraftMode}, {data: settings}] = await Promise.all([
    draftMode(),
    sanityFetch({query: settingsQuery, stega: false}),
  ])

  const bgColor = rgbToCss(settings?.bgColor)

  return (
    <html lang="en" className={`${quadrant.variable} ${quadrantMono.variable}`}>
      <body className="font-mono" style={bgColor ? {backgroundColor: bgColor} : undefined}>
        {isDraftMode && <VisualEditing />}
        <SanityLive />
        <Nav />
        <main className="px-5">{children}</main>
        <Suspense>
          <AboutDialogShell>
            <AboutContent />
          </AboutDialogShell>
        </Suspense>
      </body>
    </html>
  )
}
