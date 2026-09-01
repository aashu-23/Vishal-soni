import { featured } from '@/data/work'
import MediaFrame from '@/components/media/MediaFrame'
import { RevealLines } from '@/components/ui/Reveal'
import Field from '@/components/layout/Field'

/* The one clip that gets the full width of the page to itself. */
export default function FeaturedFilm() {
  return (
    <Field name="chalk" as="section" id="work" className="scroll-mt-24" aria-labelledby="featured-head">
      <div className="shell rule-top pt-5">
        <div className="flex items-baseline justify-between gap-6">
          <h2 id="featured-head" className="t-meta !text-on">
            Featured
          </h2>
          <p className="t-meta">{featured.tag}</p>
        </div>
      </div>

      <div className="shell py-[6vh]">
        <RevealLines as="h3" lines={[featured.title]} className="t-title mb-6" />
        <MediaFrame
          media={featured}
          title={featured.title}
          alt={`${featured.title} — ${featured.tag}`}
          previewQuality="hd"
        />
      </div>
    </Field>
  )
}
