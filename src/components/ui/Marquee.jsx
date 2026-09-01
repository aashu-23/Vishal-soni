/* Duplicated track so the loop is seamless. Paused on hover, and the whole
   thing is aria-hidden — the same names are listed as real text in About. */
export default function Marquee({ items, speed = 42, separator = '·' }) {
  const Track = () => (
    <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="t-title text-on/75 px-[0.35em]">{item}</span>
          <span className="text-on3 text-xl px-[0.35em]">{separator}</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="marquee" aria-hidden="true">
      <Track />
      <Track />
    </div>
  )
}
