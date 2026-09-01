import { site } from '@/data/site'
import AboutBlock from '@/components/sections/AboutBlock'
import Clients from '@/components/sections/Clients'
import Contact from '@/components/sections/Contact'

export default function About() {
  return (
    <div style={{ paddingTop: 'calc(var(--nav-h) + 8vh)' }}>
      <AboutBlock />

      <div className="shell rule-top grid12 gap-y-8 py-[10vh]">
        <h2 className="t-meta col-span-12 md:col-span-3">Approach</h2>
        <div className="col-span-12 md:col-span-6 md:col-start-5">
          {/* Sourced from behance.net/vishalsoni24 — the bio and the project
              titles below are both taken from his own published work. */}
          <p className="t-body">
            Brand identity, motion graphics, video editing and 3D, carried from concept through to
            final export. Recent work spans a co-working space identity for ThinkHub, jewellery
            branding for Sioura, reels and ads for Keyy and Ciferon, and campaign work for Maruti
            Suzuki, Hero MotoCorp, ITC and Genpact.
          </p>
          <p className="t-body mt-5">
            Currently at {site.studio} in {site.location}. {site.availability}.
          </p>
        </div>
      </div>

      <div className="shell rule-top grid12 gap-y-6 py-[8vh]">
        <h2 className="t-meta col-span-12 md:col-span-3">Elsewhere</h2>
        <ul className="col-span-12 md:col-span-6 md:col-start-5">
          {site.links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="arrow"
                className="group flex items-baseline justify-between gap-6 border-b border-rule-soft py-3.5 transition-colors duration-400 hover:border-rule"
              >
                <span className="t-label text-on/70 transition-colors duration-300 group-hover:text-on">
                  {l.label}
                </span>
                <span className="t-meta">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Clients />
      <Contact />
    </div>
  )
}
