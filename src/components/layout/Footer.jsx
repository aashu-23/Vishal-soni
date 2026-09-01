import { site } from '@/data/site'

export default function Footer() {
  return (
    <footer className="rule-top">
      <div className="shell flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-meta">
          {site.name} — {site.location}
        </p>
        <p className="t-meta">Design and code by Vishal Soni</p>
      </div>
    </footer>
  )
}
