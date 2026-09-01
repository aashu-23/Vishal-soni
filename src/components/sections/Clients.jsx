import { clients } from '@/data/site'
import Marquee from '@/components/ui/Marquee'

export default function Clients() {
  return (
    <section className="rule-top rule-bot overflow-hidden py-8 md:py-10" aria-labelledby="clients-head">
      <div className="shell mb-6">
        <h2 id="clients-head" className="t-meta">
          Brands worked with
        </h2>
      </div>
      <Marquee items={clients} speed={46} />
      {/* Same names as readable text for screen readers and no-JS */}
      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  )
}
