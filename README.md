# Vishal Soni — Portfolio

A cinematic, editorial portfolio for **Vishal Soni**, graphic / motion graphics / 3D artist.
React + Vite + GSAP + Lenis + Framer Motion + Tailwind.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

It runs immediately — placeholder slates and looping clips ship with the repo so you can
see the real motion and composition before any footage exists.

---

## Do these three things before launch

1. **Set the email.** `src/data/site.js` → `email` is a placeholder. Vishal's address isn't
   public, so it had to be invented. Same for the LinkedIn URL (his public link is a
   redirect, not a profile slug).
2. **Check the clip titles and the Approach paragraph.** Display titles were derived from
   his working filenames with dimension suffixes stripped ("Sarang Slowmo -1080X1920" →
   "Sarang — Slow motion"); the originals are kept in each entry's `file` field. The
   Approach paragraph in `src/pages/About.jsx` is scaffold copy, marked ⚠️ in the source.
3. **Drop in real media.** 29 clips, see below.

Everything else — his name, role, location, studio, the 8+ years and the six client names —
is taken verbatim from his Behance profile. Clip names come from the layout he supplied.
"Cifron Invitation-1" was normalised to Ciferon, the spelling used in his bio.

---

## Adding real media

Every clip lives in `src/data/work.js`, grouped exactly as in Vishal's layout. Drop files
into `public/assets/video/<group>/` keeping the slugs, one `.mp4` and one `.jpg` poster
each. The `file` field on every entry keeps his original working filename so clips are easy
to match up.

| Group | Folder | Clips | Ratio | Grid |
|---|---|---|---|---|
| Featured | `featured/` | 2 | `48/25`, `16/9` | full width |
| Reels | `reels/` | 12 | `9/16` | 4 up |
| Ads | `ads/` | 4 | `16/9` | 2 up |
| Motion Graphics | `motion/` | 7 | `9/16` | 4 + 3 centred |
| Color Grading | `grading/` | 4 | `9/16` | 4 up |

**`ratio` is the only field that changes the layout.** Ads are set to `16/9`; if those
exports are actually 1080 x 720, change it to `3/2` and the whole section reflows. Same for
anything else that doesn't match.

### First: make the Drive folder fully readable

I audited the shared folder and could only confirm 8 of the ~29 clips — Google's search
index only returns link-shared files the account has personally opened, so anything nobody
has clicked into is invisible. See `DRIVE-MANIFEST.md` for what was verified and what's
still open (the Reels folder didn't surface at all).

This doesn't affect downloading. Just download the whole folder and run the ingest script —
it reads what's actually on disk, so the indexing limitation is irrelevant once the files
are local.

### Just run the ingest script

Download the Drive folder, then point this at it. Requires `ffmpeg`
(`brew install ffmpeg`, or `winget install ffmpeg` on Windows).

```bash
npm run ingest -- "~/Downloads/Video Folio" --dry-run   # report only, writes nothing
npm run ingest -- "~/Downloads/Video Folio"             # encode and place everything
```

For each clip it finds the matching source file, encodes a web-sized H.264 with
`+faststart`, pulls a poster frame, and writes both into the right folder under the right
name. Then it prints three things worth reading:

- **Missing** — a clip the site expects with no source file found
- **Unused** — a file in the folder with no entry on the site
- **Ratio mismatch** — where the real dimensions disagree with `ratio` in `work.js`

Filenames are matched on token overlap rather than exact string, so
`astrologer_ad_keyy_7_v3.mp4` still lands on `keyy-astrologer-07`. Anything matched with
low confidence is flagged with its score so you can eyeball it. Existing files are skipped
unless you pass `--force`.

Audio is stripped: grid previews are muted, and the lightbox has a sound toggle, so ship
audio only where someone will actually open the clip.

### Where to host the video

**Don't serve these from Google Drive.** It has no proper range-request support, so
seeking breaks, it rate-limits under any real traffic, and the links rot.

The eight masters I could inspect average 28 MB, so all 29 come to roughly 800 MB raw —
don't commit or serve that. After the ingest re-encode expect 60–120 MB total, small enough to commit
straight into the repo and let Vercel, Netlify or Cloudflare Pages serve it from their CDN.
That is the simplest thing that works and it's what the current setup assumes.

If the files come out much larger, or you want adaptive bitrate so phones on 4G get a
lower rendition, move the clips to Cloudflare Stream, Bunny or Mux and swap the `src`
values in `work.js` for their playback URLs. Nothing else in the code needs to change —
`SmartVideo` doesn't care where a URL points.

---

## Structure

```
src/
  components/
    layout/    Nav, Footer, Grain, PageShell (route transition), SectionHead,
               Field (applies a section's colour room)
    media/     SmartVideo, MediaFrame, Lightbox
    sections/  Hero, FeaturedFilm, GroupIndex, VideoGroup, Statement,
               AboutBlock, Clients, Contact
    ui/        Cursor, Magnetic, Reveal, Marquee
  context/     LightboxContext
  data/        site.js, work.js   ← all content lives here
  hooks/       useSmoothScroll, useReveal, useParallax, useReducedMotion, useMediaQuery
  lib/         gsap.js (motion vocabulary), media.js (aspect system),
               fields.js (colour rooms — change the whole palette here)
  pages/       Home, About, NotFound
```

Content and code are fully separated. Adding a clip means adding one line to the right
group in `work.js` — no component needs touching, and the grid, the counts and the jump
list all update on their own.

---

## How the video system works

Two `IntersectionObserver`s per clip, deliberately kept separate:

| Observer | Trigger | Does |
|---|---|---|
| Arm | 600px before entering view | attaches `src` — nothing downloads before this |
| Play | 25% visible | plays; pauses the instant it leaves |

Plus: `preload="none"`, poster crossfade on first frame, pause on tab blur, `onError`
fallback so a missing file degrades to its poster instead of a broken element. Under
`prefers-reduced-motion` nothing autoplays at all — the poster stays and the viewer gets a
real control.

Only clips near the viewport ever exist as network requests, so the page cost stays flat
no matter how many projects get added.

## Accessibility

Semantic landmarks, skip link, visible focus rings, keyboard-operable lightbox
(`Esc` `Space` `M` `←` `→`) with a focus trap and focus restoration, `aria-modal`,
alt text driven from real project data, and `prefers-reduced-motion` honoured throughout —
it disables smooth scroll, parallax, the pinned horizontal rail, the custom cursor,
autoplay and the shared-element transition, rather than just shortening durations.

## Changing the palette

Every colour lives in `src/lib/fields.js`. A section picks a room by wrapping itself in
`<Field name="sage">`, and the page tweens the background, type, rules and accent to match
as it scrolls into view. Nothing else hard-codes a colour, so a full re-theme means editing
one object.

If you change a room, re-check contrast — the metadata sits at 11px and the first version
of this palette failed AA in all seven rooms before it was rebalanced.

## Browser support

Modern evergreen browsers. Uses `aspect-ratio`, `clip-path`, `backdrop-filter` and `svh`
units. Graceful in older Safari except for `svh`, which falls back to `vh`.
