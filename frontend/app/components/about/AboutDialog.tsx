'use client'

import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useRef} from 'react'

export function AboutDialog({open, children}: {open: boolean; children: React.ReactNode}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function close() {
    const next = new URLSearchParams(searchParams.toString())
    next.delete('about')
    const qs = next.toString()
    router.push(qs ? `?${qs}` : '?', {scroll: false})
  }

  return (
    <dialog
      ref={ref}
      onClose={close}
      className="m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-[#ededed] backdrop:bg-black/0"
    >
      <button
        type="button"
        onClick={close}
        className="fixed right-8 top-6 z-10 rounded-md bg-white/10 px-2 py-1 uppercase"
        aria-label="Close"
      >
        [ Close (×) ]
      </button>
      {children}
    </dialog>
  )
}
