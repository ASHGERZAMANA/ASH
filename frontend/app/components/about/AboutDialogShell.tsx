'use client'

import {useSearchParams} from 'next/navigation'

import {AboutDialog} from './AboutDialog'

export function AboutDialogShell({children}: {children: React.ReactNode}) {
  const searchParams = useSearchParams()
  const open = searchParams.get('about') === '1'
  return <AboutDialog open={open}>{children}</AboutDialog>
}
