import { gsap } from './gsap'

/* =============================================================================
   COLOUR FIELDS

   The site is an exhibition, so it's hung in rooms. Each section declares a
   field and the whole page — background, type, rules, accent — tweens to it as
   you arrive. Nothing is hard-coded to one palette; components only ever ask
   for "on" (type on the current field) or "accent".

   Work sections use soft tints so the videos stay the loudest thing on screen.
   Two rooms are painted full strength: the statement and the contact block.
   ============================================================================= */

export const FIELDS = {
  chalk:   { bg: '233 234 228', on: '20 20 26', on2: '90 91 95', on3: '103 104 103', rule: '20 20 26', accent: '61 47 224' },
  sage:    { bg: '216 226 217', on: '17 26 21', on2: '78 92 82', on3: '88 101 91', rule: '17 26 21', accent: '13 74 67' },
  sand:    { bg: '240 228 213', on: '32 22 15', on2: '101 82 68', on3: '114 98 85', rule: '32 22 15', accent: '178 62 34' },
  lilac:   { bg: '228 219 242', on: '25 17 36', on2: '90 76 106', on3: '104 93 118', rule: '25 17 36', accent: '61 47 224' },
  sky:     { bg: '215 226 238', on: '15 22 33', on2: '76 90 108', on3: '87 99 116', rule: '15 22 33', accent: '172 61 38' },
  violet:  { bg: '61 47 224', on: '236 235 230', on2: '198 194 245', on3: '198 196 228', rule: '236 235 230', accent: '198 226 63' },
  citron:  { bg: '198 226 63', on: '22 26 10', on2: '72 82 34', on3: '85 96 45', rule: '22 26 10', accent: '61 47 224' },
}

const KEYS = ['bg', 'on', 'on2', 'on3', 'rule', 'accent']

const parse = (f) => {
  const out = {}
  KEYS.forEach((k) => {
    const [r, g, b] = f[k].split(' ').map(Number)
    out[`${k}_r`] = r
    out[`${k}_g`] = g
    out[`${k}_b`] = b
  })
  return out
}

const state = parse(FIELDS.chalk)

const write = () => {
  const s = document.documentElement.style
  KEYS.forEach((k) => {
    s.setProperty(
      `--${k}-rgb`,
      `${Math.round(state[`${k}_r`])} ${Math.round(state[`${k}_g`])} ${Math.round(state[`${k}_b`])}`
    )
  })
}

let active = 'chalk'

export function applyField(name, immediate = false) {
  const f = FIELDS[name]
  if (!f || (name === active && !immediate)) return
  active = name
  const target = parse(f)
  if (immediate) {
    Object.assign(state, target)
    write()
    return
  }
  gsap.to(state, {
    ...target,
    duration: 0.65,
    ease: 'power2.out',
    overwrite: true,
    onUpdate: write,
  })
}

export const initFields = () => applyField('chalk', true)
