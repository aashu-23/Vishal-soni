/* =============================================================================
   WORK — video only.

   Structure follows Vishal's own layout: two featured landscape films, then
   four groups (Reels, Ads, Motion Graphics, Color Grading).

   `title` is the display name. `file` keeps his original working filename so
   clips are easy to match up when the real exports go in — dimension suffixes
   like "1080X1920" are stripped from titles because the group header already
   states the format.

   `ratio` is the only field that affects layout. Change it and the grid,
   the reveal direction and the lightbox all follow.
   ============================================================================= */

const v = (dir, slug) => ({
  type: 'video',
  src: `/assets/video/${dir}/${slug}.mp4`,
  sdSrc: `/assets/video/${dir}/${slug}-sd.mp4`,
  poster: `/assets/video/${dir}/${slug}.jpg`,
})

/* The opening film. 1920 x 1000 as labelled — a wider-than-16:9 crop. */
export const cover = {
  id: 'cover',
  title: 'Showreel',
  ratio: '48/25',
  file: 'Cover_1920X1000',
  ...v('featured', 'cover'),
}

export const featured = {
  id: 'thinkhub-pune',
  title: 'Thinkhub Pune',
  tag: 'Brand film',
  ratio: '14/9',
  file: 'Thinkhub Pune',
  ...v('featured', 'thinkhub-pune'),
}

export const groups = [
  {
    id: 'reels',
    title: 'Reels',
    note: '1080 × 1920',
    field: 'sky',
    ratio: '9/16',
    columns: 4,
    items: [
      { slug: 'ohno-01', title: 'Ohno', file: 'Ohno Reel 01' },
      { slug: 'ohno-saturday', title: 'Ohno Saturday', file: 'Ohno Saturday Reel 01' },
      { slug: 'veggietude-01', title: 'Veggietude', file: 'Veggietude Reel 01' },
      { slug: 'veggietude-02', title: 'Veggietude', file: 'Veggietude' },
      { slug: 'four-menu', title: '4 Menu', file: '4 Menu' },
      { slug: 'sarang-testimonial', title: 'Sarang — Testimonial', file: 'Sarang Testimonial' },
      { slug: 'sarang-slowmo', title: 'Sarang — Slow motion', file: 'Sarang Slowmo -1080X1920' },
      { slug: 'sarang-first', title: 'Sarang — First film', file: 'Sarang First Video' },
      { slug: 'mango-fest', title: 'Mango Fest', file: 'Mango Fest' },
      { slug: 'ootaa', title: 'Ootaa', file: 'Ootaa Reel 1080X1920 V2' },
      { slug: 'thinkhub-reel', title: 'Thinkhub', file: 'Thinkhub' },
      { slug: 'traders-cafe', title: 'Traders Cafe', file: 'Traders Cafe' },
    ].map((i) => ({ ...i, ratio: '9/16', ...v('reels', i.slug) })),
  },
  {
    id: 'ads',
    title: 'Ads',
    note: 'Landscape',
    field: 'sand',
    ratio: '16/9',
    columns: 2,
    items: [
      { slug: 'keyy-astrologer-06', title: 'Keyy — Astrologer 06', file: 'Astrologer Ad Keyy 6' },
      { slug: 'keyy-break-the-pattern', title: 'Keyy — Break The Pattern', file: 'Keyy Break The Pattern Final' },
      { slug: 'keyy-astrologer-07', title: 'Keyy — Astrologer 07', file: 'Astrologer Ad Keyy 7' },
      { slug: 'think-less-get-more', title: 'Think Less, Get More', file: 'Think Less Get More 02 (V02)' },
    ].map((i) => ({ ...i, ratio: '16/9', ...v('ads', i.slug) })),
  },
  {
    id: 'motion-graphics',
    title: 'Motion Graphics',
    note: '1080 × 1920',
    field: 'sage',
    ratio: '9/16',
    columns: 4,
    items: [
      { slug: 'case-study-01', title: 'Case Study 01', file: 'Case Study 1' },
      { slug: 'case-study-02', title: 'Case Study 02', file: 'Case Study 2' },
      { slug: 'case-study-03', title: 'Case Study 03', file: 'Case Study 3' },
      { slug: 'case-study-04', title: 'Case Study 04', file: 'Case Study 4' },
      // Layout says "Cifron"; the real Drive file for Delhi is spelled Ciferon, so this follows suit.
      { slug: 'ciferon-invitation', title: 'Ciferon — Invitation', file: 'Cifron Invitation-1' },
      { slug: 'ranking', title: 'Ranking', file: 'Ranking 2 1' },
      { slug: 'ciferon-delhi', title: 'Ciferon — Delhi', file: 'Ciferon Delhi 1080X1920' },
    ].map((i) => ({ ...i, ratio: '9/16', ...v('motion', i.slug) })),
  },
  {
    id: 'color-grading',
    title: 'Color Grading',
    note: '1080 × 1920',
    field: 'lilac',
    ratio: '9/16',
    columns: 4,
    items: [
      { slug: 'kuti-01', title: 'Kuti — 01', file: 'Kuti Video 1080X1920' },
      // ⚠️ Only three Kuti files were found in Drive (…1920, …1920-2, …1920-4).
      // If "V2" doesn't exist, delete this entry — the grid reflows to a row of three.
      { slug: 'kuti-02', title: 'Kuti — 02', file: 'Kuti Video 1080X1920-2 V2' },
      { slug: 'kuti-03', title: 'Kuti — 03', file: 'Kuti Video 1080X1920-2' },
      { slug: 'kuti-04', title: 'Kuti — 04', file: 'Kuti Video 1080X1920-4' },
    ].map((i) => ({ ...i, ratio: '9/16', ...v('grading', i.slug) })),
  },
]

export const totalClips = groups.reduce((n, g) => n + g.items.length, 0) + 2

/* Used as the drifting fragments behind the statement block. */
export const fragments = [groups[0].items[2], groups[3].items[1]]
