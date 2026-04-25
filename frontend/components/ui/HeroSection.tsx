import Link from 'next/link'

const FLOATING_WORDS = ['entropía', 'paradigma', 'heurística', 'sinergia', 'dialéctica', 'homeostasis', 'catálisis', 'ontología']

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-radial pt-20">

      {/* Floating words background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        {FLOATING_WORDS.map((word, i) => (
          <div
            key={word}
            className="absolute font-display text-white opacity-5 whitespace-nowrap"
            style={{
              fontSize: `${1.5 + (i % 3) * 0.8}rem`,
              top: `${10 + (i * 11) % 70}%`,
              left: `${(i * 17) % 80}%`,
              transform: `rotate(${-15 + (i * 7) % 30}deg)`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--purple), transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--amber), transparent)' }} />

      <div className="relative text-center max-w-4xl mx-auto px-6">
        <p className="text-xs font-mono tracking-widest mb-6 inline-block px-4 py-1.5 rounded-full glass" style={{ color: 'var(--amber)' }}>
          ◈ PLATAFORMA DE VOCABULARIO INTELIGENTE
        </p>

        <h1 className="font-display text-6xl md:text-8xl text-white mb-6 leading-none">
          Piensa con<br />
          <em className="not-italic" style={{ color: 'var(--amber)' }}>palabras</em><br />
          más grandes
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          LexiMind te enseña vocabulario en profundidad — no solo definiciones, sino la esencia de cada concepto. 
          Con IA, repetición espaciada y contexto real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/learn">
            <button className="btn-primary text-base px-8 py-3 glow-amber animate-pulse-glow">
              Comenzar sesión gratis →
            </button>
          </Link>
          <Link href="/word/entropia">
            <button className="btn-ghost text-base px-8 py-3">
              Ver ejemplo: Entropía
            </button>
          </Link>
        </div>

        <div className="flex justify-center gap-8 mt-14 text-sm" style={{ color: 'var(--text-faint)' }}>
          {['Sin tarjeta de crédito', 'Sistema SRS incluido', 'IA explicativa'].map((feat) => (
            <span key={feat} className="flex items-center gap-2">
              <span style={{ color: 'var(--teal)' }}>✓</span> {feat}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
