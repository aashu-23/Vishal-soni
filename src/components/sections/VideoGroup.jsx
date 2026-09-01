import { groups } from '@/data/work'
import MediaFrame from '@/components/media/MediaFrame'
import SectionHead from '@/components/layout/SectionHead'
import Field from '@/components/layout/Field'

/* -----------------------------------------------------------------------------
   One group of clips — Reels, Ads, Motion Graphics, Color Grading.

   The grid is flex-wrap with `justify-content: center`, which is what makes a
   partial last row centre itself. Motion Graphics has seven clips and lands as
   4 + 3 centred, exactly as drawn in the layout, with no special-casing.

   Column counts step down responsively; a clip's ratio does the rest.
----------------------------------------------------------------------------- */
export default function VideoGroup({ group }) {
  const { id, title, note, field, columns, items } = group

  return (
    <Field name={field} as="section" aria-labelledby={`${id}-head`}>
      <SectionHead id={id} headingId={`${id}-head`} title={title} note={note} count={items.length} />

      <div className="shell py-[6vh]">
        <div className="vgrid" data-cols={columns}>
          {items.map((item, i) => (
            <MediaFrame
              key={item.slug}
              media={item}
              title={item.title}
              alt={`${item.title} — ${title}`}
              caption={item.title}
              revealFrom={i % 2 ? 'top' : 'bottom'}
            />
          ))}
        </div>
      </div>
    </Field>
  )
}

export function AllGroups() {
  return groups.map((g) => <VideoGroup key={g.id} group={g} />)
}
