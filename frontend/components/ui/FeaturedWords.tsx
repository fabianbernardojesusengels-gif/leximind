import Link from 'next/link'

const FEATURED = [
  { slug: 'entropia', word: 'Entropía', def: 'La tendencia natural de los sistemas a desorganizarse con el tiempo.', cat: 'science', diff: 'advanced' },
  { slug: 'heuristica', word: 'Heurística', def: 'Estrategia mental práctica para resolver problemas rápidamente.', cat: 'psychology', diff: 'intermediate' },
  { slug: 'paradigma', word: 'Paradigma', def: 'El modelo o marco mental dominante desde el que entendemos el mundo.', cat: 'science', diff: 'intermediate' },
  { slug: 'algoritmo', word: 'Algoritmo', def: 'Una receta paso a paso para resolver un problema de forma sistemática.', cat: 'technology', diff: 'beginner' },
  { slug: 'dialectica', word: 'Dialéctica', def: 'El arte del debate donde dos ideas opuestas producen una verdad superior.', cat: 'philosophy', diff: 'advanced' },
  { slug: 'homeostasis', word: 'Homeostasis', def: 'La capacidad de un sistema vivo de mantenerse estable ante cambios.', cat: 'science', diff: 'intermediate' },
]

export default function FeaturedWords() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-mono tracking-widest text-amber-400 mb-2 uppercase">Vocabulario</p>
          <h2 className="font-display text-4xl text-white">Palabras destacadas</h2>
        </div>
        <Link href="/learn" className="btn-ghost text-sm hidden sm:block">Ver todas →</Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURED.map((word, i) => (
          <Link key={word.slug} href={`/word/${word.slug}`} className="block">
            <article
              className="glass glass-hover rounded-2xl p-6 h-full"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`badge badge-${word.cat}`}>{word.cat}</span>
                <span className={`font-mono text-xs diff-${word.diff}`} style={{ color: 'var(--text-faint)' }}></span>
              </div>
              <h3 className="font-display text-2xl text-white mb-3">{word.word}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{word.def}</p>
              <div className="mt-5 text-xs font-mono" style={{ color: 'var(--amber)' }}>
                Explorar →
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
