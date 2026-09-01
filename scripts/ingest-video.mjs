#!/usr/bin/env node
/* =============================================================================
   INGEST

   Point this at the folder you downloaded from Drive and it will do the rest:

     node scripts/ingest-video.mjs ~/Downloads/Video\ Folio

   For every clip the site expects, it finds the matching source file, encodes
   an HD version (with audio) and a much lighter SD version, pulls a poster
   frame, and writes all three to the right folder under public/assets/video/
   with the right name. The grid autoplays the SD file; the lightbox opens on
   HD with an SD fallback the viewer can switch to.

   It also checks each file's real aspect ratio against what work.js declares and
   tells you where they disagree — that's how you'll find out whether the Ads are
   16:9 or 1080x720 without opening a single file.

   Flags:  --dry-run   match and report, encode nothing
           --force     re-encode clips that already exist
   ============================================================================= */

import { readdir, stat, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const FORCE = args.includes('--force')
const SRC = args.find((a) => !a.startsWith('--'))

const VIDEO_EXT = new Set(['.mp4', '.mov', '.m4v', '.avi', '.mkv', '.webm', '.mpg', '.mpeg'])
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  ok: (s) => `\x1b[32m${s}\x1b[0m`,
  warn: (s) => `\x1b[33m${s}\x1b[0m`,
  bad: (s) => `\x1b[31m${s}\x1b[0m`,
  b: (s) => `\x1b[1m${s}\x1b[0m`,
}

const die = (msg) => {
  console.error(`\n${c.bad('✗')} ${msg}\n`)
  process.exit(1)
}

if (!SRC) die('Give me the folder you downloaded.\n  node scripts/ingest-video.mjs "~/Downloads/Video Folio"')
if (!existsSync(SRC)) die(`No such folder: ${SRC}`)
if (spawnSync('ffmpeg', ['-version']).status !== 0)
  die('ffmpeg is not installed.  macOS: brew install ffmpeg  ·  Windows: winget install ffmpeg')

/* ---- what the site expects ------------------------------------------------ */
const work = await import(pathToFileURL(path.join(ROOT, 'src/data/work.js')).href)

const targets = [
  { ...work.cover, dir: 'featured' },
  { ...work.featured, dir: 'featured' },
  ...work.groups.flatMap((g) =>
    g.items.map((i) => ({ ...i, dir: i.src.split('/')[3], group: g.title }))
  ),
].map((t) => ({
  slug: t.slug ?? t.id,
  title: t.title,
  file: t.file,
  ratio: t.ratio,
  dir: t.dir,
  group: t.group ?? 'Featured',
  out: path.join(ROOT, 'public/assets/video', t.dir, `${t.slug ?? t.id}`),
}))

/* ---- what's actually in the folder ---------------------------------------- */
const walk = async (dir) => {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (VIDEO_EXT.has(path.extname(e.name).toLowerCase())) out.push(p)
  }
  return out
}
const sources = await walk(SRC)
if (!sources.length) die(`No video files found in ${SRC}`)

/* ---- matching -------------------------------------------------------------
   Filenames drift ("Sarang Slowmo -1080X1920" vs "sarang_slowmo_v3"), so match
   on token overlap rather than exact string, then assign one-to-one by
   descending confidence so near-identical names (the four Kuti cuts) can't
   steal each other's file.
--------------------------------------------------------------------------- */
const tokens = (s) =>
  path
    .basename(s, path.extname(s))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .filter((t) => !/^\d{3,4}x\d{3,4}$/.test(t))
    .filter((t) => !['copy', 'final', 'export', 'render'].includes(t))

const score = (a, b) => {
  const A = new Set(a)
  const B = new Set(b)
  let hit = 0
  for (const t of A) if (B.has(t)) hit++
  return (2 * hit) / (A.size + B.size)
}

/* Drive keeps these in folders named after the groups (Ads, Motion Graphics,
   Color Grading, Reels). If the download preserved that structure, a matching
   parent folder is strong evidence — it stops "Case Study 2" in one group from
   stealing a same-named file in another. */
const GROUP_DIR = { Reels: 'reels', Ads: 'ads', 'Motion Graphics': 'motion', 'Color Grading': 'grading' }
const folderHint = (t, file) => {
  const parent = path.basename(path.dirname(file)).toLowerCase()
  const want = (GROUP_DIR[t.group] || t.dir).toLowerCase()
  return parent.includes(want) || want.includes(parent.replace(/\s+/g, '')) ? 0.12 : 0
}

const pairs = []
for (const t of targets)
  for (const s of sources)
    pairs.push({ t, s, score: Math.min(1, score(tokens(t.file), tokens(s)) + folderHint(t, s)) })
pairs.sort((x, y) => y.score - x.score)

const takenT = new Set()
const takenS = new Set()
const matched = []
for (const p of pairs) {
  if (p.score < 0.45) break
  if (takenT.has(p.t.slug) || takenS.has(p.s)) continue
  takenT.add(p.t.slug)
  takenS.add(p.s)
  matched.push(p)
}
const missing = targets.filter((t) => !takenT.has(t.slug))
const extra = sources.filter((s) => !takenS.has(s))

/* ---- probe + encode -------------------------------------------------------- */
const probe = (f) => {
  const r = spawnSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height:format=duration',
    '-of', 'default=nw=1:nk=1', f,
  ])
  const [w, h, d] = r.stdout.toString().trim().split('\n')
  return { w: +w, h: +h, dur: +d || 0 }
}

const asRatio = (w, h) => {
  const g = (a, b) => (b ? g(b, a % b) : a)
  const d = g(w, h)
  return `${w / d}/${h / d}`
}

console.log(`\n${c.b('Ingest')}  ${c.dim(SRC)}`)
console.log(`${matched.length} matched · ${c.warn(`${missing.length} missing`)} · ${c.dim(`${extra.length} unused`)}\n`)

const mismatches = []
let bytes = 0

for (const { t, s, score: sc } of matched) {
  const info = probe(s)
  const real = info.w && info.h ? asRatio(info.w, info.h) : '?'
  const want = t.ratio
  const drift = info.w && info.h ? Math.abs(info.w / info.h - eval(want)) / eval(want) : 0
  if (drift > 0.02) mismatches.push({ t, real, want, dims: `${info.w}x${info.h}` })

  const flag = sc < 0.75 ? c.warn(` ~${sc.toFixed(2)}`) : ''
  console.log(`  ${c.ok('✓')} ${t.group.padEnd(16)} ${t.slug.padEnd(24)} ${c.dim(path.basename(s))}${flag}`)

  if (DRY) continue
  await mkdir(path.dirname(t.out), { recursive: true })
  const mp4 = `${t.out}.mp4`
  const sdMp4 = `${t.out}-sd.mp4`
  const jpg = `${t.out}.jpg`
  if (existsSync(mp4) && !FORCE) continue

  const portrait = info.h > info.w
  const scaleFor = (targetW) =>
    info.w > targetW ? `scale=${targetW}:-2` : 'scale=trunc(iw/2)*2:trunc(ih/2)*2'

  // HD — what the lightbox opens on. Web-sized, not archival: 1280/720 wide
  // is plenty for a browser viewport and keeps the file light enough to
  // start playing almost immediately. Carries audio.
  spawnSync('ffmpeg', [
    '-nostdin', '-loglevel', 'error', '-y', '-i', s,
    '-vf', scaleFor(portrait ? 720 : 1280), '-c:v', 'libx264', '-crf', '24', '-preset', 'medium',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-ac', '2',
    '-movflags', '+faststart', mp4,
  ], { stdio: 'inherit' })

  // SD — the grid's silent autoplay preview, and a manual fallback in the
  // lightbox for slow connections. Sized to still look sharp in a 2-up grid
  // tile (~960px), not just a thumbnail — only the Featured film (full page
  // width) skips this and previews at HD instead.
  spawnSync('ffmpeg', [
    '-nostdin', '-loglevel', 'error', '-y', '-i', s,
    '-vf', scaleFor(portrait ? 540 : 960), '-c:v', 'libx264', '-crf', '27', '-preset', 'medium',
    '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', sdMp4,
  ], { stdio: 'inherit' })

  spawnSync('ffmpeg', [
    '-nostdin', '-loglevel', 'error', '-y',
    '-ss', String(Math.min(1.5, info.dur * 0.1 || 0)), '-i', mp4,
    '-frames:v', '1', '-q:v', '4', jpg,
  ], { stdio: 'inherit' })

  if (existsSync(mp4)) bytes += (await stat(mp4)).size
  if (existsSync(sdMp4)) bytes += (await stat(sdMp4)).size
}

/* ---- report ---------------------------------------------------------------- */
if (missing.length) {
  console.log(`\n${c.warn('No source file found for:')}`)
  for (const m of missing) console.log(`  · ${m.group.padEnd(16)} ${m.slug.padEnd(24)} ${c.dim(`expected "${m.file}"`)}`)
  console.log(c.dim('  Rename the file to match, or edit `file` in src/data/work.js.'))
}

if (extra.length) {
  console.log(`\n${c.dim('In the folder but not on the site:')}`)
  for (const e of extra) console.log(c.dim(`  · ${path.basename(e)}`))
  console.log(c.dim('  Add an entry to the right group in src/data/work.js to include them.'))
}

if (mismatches.length) {
  console.log(`\n${c.warn('Aspect ratio disagrees with work.js:')}`)
  for (const m of mismatches)
    console.log(`  · ${m.t.slug.padEnd(24)} file is ${c.b(m.dims)} (${m.real}), work.js says ${c.b(m.want)}`)
  console.log(c.dim('  Update `ratio` in src/data/work.js — the grid and lightbox follow it.'))
}

if (!DRY && bytes) console.log(`\n${c.ok('Done.')} ${(bytes / 1e6).toFixed(1)} MB written to public/assets/video/`)
if (DRY) console.log(`\n${c.dim('Dry run — nothing written. Drop --dry-run to encode.')}`)
console.log()
