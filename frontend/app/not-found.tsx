import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-37 uppercase">
      <h1 className="font-sans text-5xl md:text-7xl">404</h1>
      <p>Page not found.</p>
      <Link href="/" className="underline">
        Back to works
      </Link>
    </section>
  )
}
