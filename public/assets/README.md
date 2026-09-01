# Assets

Everything here is a **generated placeholder** so the site runs before real footage exists.
Each slate is labelled with its filename's purpose and aspect ratio. Replace them, keeping
the filenames, and update `ratio` in `src/data/projects.js` if a real clip's shape differs.

Every project entry expects:

- `<name>.mp4` — muted, looping, H.264, `+faststart`
- `<name>.jpg` — poster, same aspect ratio

`showreel.mp4` is the hero background loop. Keep it under ~3 MB; it loads on first paint.

Don't place files here by hand — run `npm run ingest -- "<your download folder>"` and it
will encode, name and file everything for you. See the root `README.md`.
