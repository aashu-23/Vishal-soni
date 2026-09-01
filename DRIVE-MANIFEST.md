# Drive audit — 31 Aug 2026

Read from the shared folder **Video Folio**
(`13z-kMY71QZS8BVGgDrSAx90HYd02kxlC`, owned by `sonivishal76@gmail.com`).

## Limitation worth knowing

Google's search index only returns link-shared files that the account has **personally
opened**. Every file below has a `viewedByMeTime` of today — the ones nobody has clicked
into are invisible to the API even though they're in the folder. So this is a partial
audit, not a full listing: **8 of ~29 clips confirmed.**

To make the rest readable, open the folder in Drive and either click into each file, or
right-click the folder → **Organise → Add shortcut to Drive**. Then the whole folder
becomes searchable.

## Confirmed folder structure

```
Video Folio/
├── Ads/                 (empty to the API — files not yet indexed)
├── Motion Graphics/     5 of 7 confirmed
└── Color Grading/       3 of 4 confirmed
```

No **Reels** folder is indexed. That doesn't prove it's missing — same indexing caveat —
but the site expects 12 reels, so it's the first thing to check.

## Confirmed files

| Group | Filename | Size | Maps to |
|---|---|---|---|
| Motion Graphics | `Case Study 1.mp4` | 29.0 MB | `case-study-01` |
| Motion Graphics | `Case Study 2.mp4` | 39.6 MB | `case-study-02` |
| Motion Graphics | `Case Study 3.mp4` | 44.4 MB | `case-study-03` |
| Motion Graphics | `Case Study 4.mp4` | 33.9 MB | `case-study-04` |
| Motion Graphics | `Ciferon Delhi 1080X1920.mp4` | 29.0 MB | `ciferon-delhi` |
| Color Grading | `Kuti Video 1080X1920.mp4` | 7.0 MB | `kuti-01` |
| Color Grading | `Kuti Video 1080X1920-2.mp4` | 19.0 MB | `kuti-03` |
| Color Grading | `Kuti Video 1080X1920-4.mp4` | 23.2 MB | `kuti-04` |

**Every confirmed name matches `work.js` exactly.** The mapping taken off the layout was
right, including the Ciferon spelling — the real file is `Ciferon Delhi 1080X1920.mp4`,
not "Cifron".

## Open questions

1. **`Kuti Video 1080X1920-2 V2`** — the layout lists four Kuti cuts but only three exist
   in the folder (`…1920`, `…1920-2`, `…1920-4`). Either V2 is unindexed, or the layout
   double-counted `-2`. If there are only three, delete `kuti-02` from `work.js`.
2. **Reels** — 12 clips expected, folder not visible.
3. **Ads** — 4 clips expected, folder indexed but empty to the API.
4. **`Cifron Invitation-1`** and **`Ranking 2 1`** — not surfaced, spelling unverified.
5. **`Thinkhub Pune`** and **`Cover_1920X1000`** — not surfaced; they may sit at the top
   level of the folder rather than in a subfolder.

## On file sizes

The eight confirmed masters average **28 MB**. At that rate all 29 come to roughly
**800 MB** — far too much to commit or serve raw.

`npm run ingest` re-encodes to 900px-wide (vertical) or 1600px-wide (landscape) H.264 at
CRF 24, which typically lands each clip between 1.5 and 4 MB. Expect **60–120 MB total**
after encoding, which is fine to commit and serve from a CDN. Don't skip the encode step.
