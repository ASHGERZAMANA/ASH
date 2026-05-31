const PILL = 'rounded-md bg-white/10 px-2 py-1 uppercase'

export default function NotFound() {
  return (
    <section
      className="is-not-found -mx-5 flex min-h-screen flex-col items-center justify-center"
      style={{backgroundColor: '#202020', color: '#FFFFFF'}}
    >
      <span className={PILL}>[ Not ]</span>
      <h1 className="text-[19.2rem] leading-none">404</h1>
      <span className={PILL}>[ Found ]</span>
    </section>
  )
}
