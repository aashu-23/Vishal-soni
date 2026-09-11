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
          <p className="t-body">
            I lead design for fintech and SaaS products — from brand identity through product UI,
            motion and 3D.
          </p>
          <p className="t-body mt-5">
            Eight years across branding, advertising and digital design, four of them agency-side
            running creative teams and owning client delivery. I currently lead design at Hiveway
            Media in Nagpur, where I&rsquo;ve grown the team from 4 to 7 and cut creative turnaround
            from 5 days to 2 by rebuilding how briefs and reviews move through the studio.
          </p>
          <p className="t-body mt-5">
            Most of my recent work sits in fintech and SaaS. For Keyy, a rewards and payments
            platform in the same space as CRED, I owned product design end to end — app UI/UX, a
            custom icon set including 3D icons, and the in-app motion system covering payment,
            transaction and state-change animations. I built the brand identity and carried it
            across product, campaign and social so the app screens and the ad creative speak the
            same visual language. I&rsquo;ve done similar work for Ciferon, a restaurant billing
            and POS platform.
          </p>
          <p className="t-body mt-5">
            Before that I built a detailed 3D model of Maruti Suzuki&rsquo;s Manesar plant for a
            Digital Twin project, recreating the facility for visualisation and simulation, and
            directed brand and product work for ITC.
          </p>
          <p className="t-body mt-5">
            What I&rsquo;m good at: taking a product from no visual language at all to a coherent
            system that holds up across app, campaign and social — and running the team that
            ships it.
          </p>
          <p className="t-body mt-5">
            Brands: Maruti Suzuki · Hero MotoCorp · ITC · Genpact · Keyy · Ciferon
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
