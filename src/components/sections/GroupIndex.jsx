import { groups, totalClips } from '@/data/work'
import { scrollToTarget } from '@/hooks/useSmoothScroll'

/* A jump list, not a filter. Every group stays on the page as drawn — this
   just saves scrolling past three of them to reach the fourth. */
export default function GroupIndex() {
  return (
    <div className="shell rule-top rule-bot py-4">
      <nav aria-label="Jump to a group" className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
        <span className="t-meta">{totalClips} clips</span>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => scrollToTarget(`#${g.id}`)}
            data-cursor="arrow"
            className="ul-draw t-meta !text-on/70 transition-colors duration-300 hover:!text-on"
          >
            {g.title}
            <span className="ml-2 tabular-nums !text-on3">{g.items.length}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
