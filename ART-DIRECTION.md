# Art direction

## The idea

An exhibition is hung in rooms, and each room is painted a different colour. That is how
this site works: every section declares a **field**, and the whole page — background, type,
rules, accent — tweens to it as you arrive. Scroll back up and it repaints in reverse.

Components never name a colour. They ask for `on` (type on the current field) or `accent`,
and the field decides what those mean. Changing the entire palette is one object in
`src/lib/fields.js`.

## The rooms

| Room | Field | Used by | Accent |
|---|---|---|---|
| chalk | `#E9EAE4` | hero, about, clients | electric indigo |
| sky | `#D7E2EE` | motion work | burnt persimmon |
| sage | `#D8E2D9` | TATR, Veggie Licious | deep pine |
| sand | `#F0E4D5` | 3D Portfolio, Ice Cream | burnt persimmon |
| lilac | `#E4DBF2` | Sioura, playground | electric indigo |
| **violet** | `#3D2FE0` | statement | acid citron |
| **citron** | `#C6E23F` | contact | electric indigo |

Work sections are soft tints so the videos stay the loudest thing on screen. Two rooms are
painted at full strength — the statement block and the contact block — and they bookend the
page with the only saturated fields on the site.

Every role in every room clears **4.5:1** against its background, including the 11px
metadata. The palette was rebalanced numerically rather than by eye; the first pass failed
on small text in all seven rooms.

## Type

Two families, deliberately unalike.

- **Zodiak** (Fontshare) — sharp-terminal serif. Names, project titles, statements.
- **Switzer** (Fontshare) — neutral grotesk. Everything anyone actually reads.

Metadata uses Switzer with tabular figures and open tracking rather than a monospace face.
Sizes are capped hard: names top out at 84px, the statement at 96px. Type is sized for
hierarchy, never to fill a viewport.

## Media

Aspect ratio is treated as design information, not a problem to crop away. A clip's ratio
decides its column span, which of five compositions its project gets, and which edge the
reveal wipes from. Vertical clips are genuinely narrow with room either side; landscape
clips run wide. Nothing is letterboxed or cropped to fit a container.

**Motion work is a grid, not a horizontal rail.** Reels sit four-up on desktop and two-up
on mobile at 9:16. Films sit strictly two per row at 1080 x 720. There is no pinning and
no scroll-jacking — the section is a couple of screens instead of a long horizontal
passage, and a filter lets you jump straight to one format.

## Motion

One vocabulary, defined once in `src/lib/gsap.js`:

- **Wipe** — `clip-path: inset()` uncovering from an edge, inner layer settling 1.08 -> 1.
  Every piece of media enters this way; direction matches the composition.
- **Line mask** — text rising inside its own overflow box. Section openers and project
  names only, never body copy.
- **Field tween** — 650ms colour interpolation between rooms.
- **Shared element** — `expo.inOut`, 860ms, the lightbox only.
- **Parallax** — 6-7% counter-movement. Desktop only.

Exactly one non-user-triggered sequence exists: the hero's opening title. After that,
nothing moves unless someone scrolls or clicks.

## The hero

The showreel is a framed object on a lit wall, not a dimmed background behind text. It
plays at full strength from the first second and the type sits beside it. The work is the
opening image.

## The lightbox

The frame you clicked is measured, a fixed clone is placed exactly on top of it, and that
clone animates to its fitted position — seeded with the source clip's exact `currentTime`,
so the frame you were looking at is the frame that expands. On close the source is
re-measured, because the page may have scrolled underneath.

The backdrop is the one dark surface on the site. Viewing video is a different mode, and
it should feel like the lights going down.

## Restraint

Left out on purpose: glassmorphism, floating decorative objects, gradient washes, neon,
section-by-section fade-ups, hover effects on every element, viewport-filling type, scroll
progress bars, and entrance animations on body copy.

More than one accent is visible across the page, but never more than one at a time.


---

## Video only

The site carries video and nothing else. Static branding work, the image playground and
the per-project case-study pages were all removed — a portfolio of moving work shouldn't
open on a stack of JPEGs.

Structure follows Vishal's own layout:

```
  SHOWREEL            1920 x 1000, hero
  THINKHUB PUNE       16:9, featured, full width
  ─────────────────────────────────────────────
  REELS               12 clips  ·  9:16   ·  4 up
  ADS                  4 clips  ·  16:9   ·  2 up
  MOTION GRAPHICS      7 clips  ·  9:16   ·  4 + 3 centred
  COLOR GRADING        4 clips  ·  9:16   ·  4 up
  ─────────────────────────────────────────────
  THANK YOU / CONTACT
```

The grid is flex-wrap with `justify-content: center`, which is the whole reason Motion
Graphics lands as 4 + 3 with the short row centred. No special case, no manual placement —
add an eighth clip and it becomes two rows of four on its own.

**There are no project detail pages.** With video-only content and no written case studies,
a detail page would be one clip and a heading. The shared-element lightbox is the detail
experience instead: click any frame and it expands in place, seeded at the exact playhead
position it was showing, with scrub, sound and keyboard controls. Detail pages can come
back the moment there's case-study material to put in them.
