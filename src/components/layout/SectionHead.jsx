/* Section openers carry two pieces of information and no decoration:
   what the section is, and how many items are in it. */
export default function SectionHead({ title, count, note, id, headingId }) {
  return (
    <div id={id} className="shell rule-top scroll-mt-24 pt-5">
      <div className="flex items-baseline justify-between gap-6">
        <h2 id={headingId} className="t-meta !text-on">{title}</h2>
        <p className="t-meta">
          {note}
          {count != null && <span className="ml-4 tabular-nums">{String(count).padStart(2, '0')}</span>}
        </p>
      </div>
    </div>
  )
}
