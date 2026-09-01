import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div
      className="shell flex flex-col justify-center"
      style={{ minHeight: '70svh', paddingTop: 'var(--nav-h)' }}
    >
      <p className="t-meta">404</p>
      <h1 className="t-title mt-4">This page doesn’t exist.</h1>
      <Link
        to="/"
        data-cursor="arrow"
        className="ul-draw t-meta mt-8 inline-block w-fit !text-on/70 hover:!text-on"
      >
        Back to the work →
      </Link>
    </div>
  )
}
