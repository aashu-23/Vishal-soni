import { site } from '@/data/site'
import { RevealLines } from '@/components/ui/Reveal'
import Magnetic from '@/components/ui/Magnetic'
import Field from '@/components/layout/Field'

/* End credits: the type gets quieter, the rules get closer together, and the
   only bright thing left on the page is the one action worth taking. */
export default function Contact() {
  return (
    <Field name="citron" as="section" id="contact" className="scroll-mt-24" aria-labelledby="contact-head">
      <div className="shell py-[14vh]">
        <div className="grid12 items-end gap-y-12">
          <div className="col-span-12 md:col-span-7">
            <p className="t-meta mb-6">Thank you for watching</p>
            <RevealLines
              as="h2"
              lines={['Have a project', 'in mind?']}
              className="t-statement"
            />
            <RevealLines
              as="p"
              lines={['Let’s make', 'something move.']}
              className="t-statement mt-[0.12em] text-on2"
              delay={0.1}
            />
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <Magnetic strength={12}>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="arrow"
                className="group inline-flex w-full items-center justify-between gap-6 border border-rule px-6 py-5 transition-colors duration-500 ease-out hover:border-accent hover:bg-accent"
              >
                <span className="t-label text-on transition-colors duration-500 group-hover:text-field">Start a project</span>
                <span
                  aria-hidden="true"
                  className="text-on transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:text-field"
                >
                  →
                </span>
              </a>
            </Magnetic>

            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              className="ul-draw t-meta mt-6 inline-block !text-on/60 transition-colors duration-300 hover:!text-on"
            >
              {site.whatsapp}
            </a>

            <a
              href={`mailto:${site.email}`}
              className="ul-draw t-meta mt-2 !block !text-on/60 transition-colors duration-300 hover:!text-on"
            >
              {site.email}
            </a>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {site.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="arrow"
                    className="ul-draw t-meta transition-colors duration-300 hover:!text-on"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Field>
  )
}
