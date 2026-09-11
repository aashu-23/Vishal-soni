import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import SectionHead from '@/components/layout/SectionHead'
import { RevealLines } from '@/components/ui/Reveal'
import Field from '@/components/layout/Field'

export default function AboutBlock({ compact = false }) {
  return (
    <Field name="chalk" as="section" aria-labelledby="about-head">
      <SectionHead id="about" headingId="about-head" title="About" note={site.experience} />

      <div className="shell grid12 gap-y-10 py-[10vh]">
        <div className="col-span-12 md:col-span-5">
          <RevealLines as="h3" lines={['Vishal', 'Soni']} className="t-title" />
          <ul className="mt-6">
            {['Creative Design Lead - Design, Motion & 3D'].map((r) => (
              <li key={r} className="t-label">
                {r}
              </li>
            ))}
          </ul>
          <p className="t-meta mt-6">
            {site.location} · {site.studio}
          </p>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          {/* Verbatim from his own bio — not rewritten. */}
          <p className="t-lead">{site.bio}</p>

          {compact && (
            <Link
              to="/about"
              data-cursor="arrow"
              className="ul-draw t-meta mt-8 inline-block !text-on/70 transition-colors duration-300 hover:!text-on"
            >
              More about Vishal →
            </Link>
          )}
        </div>
      </div>
    </Field>
  )
}
