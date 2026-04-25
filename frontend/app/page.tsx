import type { Metadata } from 'next'
import Link from 'next/link'
import HeroSection from '@/components/ui/HeroSection'
import FeaturedWords from '@/components/ui/FeaturedWords'

export const metadata: Metadata = {
  title: 'LexiMind — Aprende vocabulario profundamente con IA',
  description:
    'LexiMind es la plataforma más inteligente para aprender vocabulario en español. Definiciones simples y avanzadas, ejemplos reales, IA explicativa y sistema de repetición espaciada. Comienza gratis hoy.',
}

const CATEGORIES = [
  { label: 'Ciencia', href: '/word/entropia', emoji: '🔬' },
  { label: 'Filosofía', href: '/word/epistemologia', emoji: '🧠' },
  { label: 'Psicología', href: '/word/heuristica', emoji: '💡' },
  { label: 'Tecnología', href: '/word/algoritmo', emoji: '⚡' },
  { label: 'Lenguaje', href: '/word/dialectica', emoji: '📖' },
  { label: 'Biología', href: '/word/homeostasis', emoji: '🌿' },
]

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-mono tracking-widest text-amber-400 mb-3 uppercase">Método</p>
          <h2 className="font-display text-4xl md:text-5xl text-white">
            Aprender de otra manera
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Descubre',
              desc: 'Cada palabra viene con definición simple y avanzada, etimología y ejemplos reales del mundo académico.',
              icon: '◈',
            },
            {
              step: '02',
              title: 'Practica',
              desc: 'El sistema SRS adapta el ritmo a tu progreso. Las palabras regresan justo cuando estás a punto de olvidarlas.',
              icon: '◉',
            },
            {
              step: '03',
              title: 'Profundiza',
              desc: 'La IA genera explicaciones personalizadas, analogías memorables y conexiones entre conceptos.',
              icon: '◎',
            },
          ].map((item) => (
            <div key={item.step} className="glass glass-hover rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 font-mono text-xs text-white/10 font-bold">{item.step}</div>
              <div className="text-3xl mb-5 text-amber-400">{item.icon}</div>
              <h3 className="font-display text-xl text-white mb-3">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Words ── */}
      <FeaturedWords />

      {/* ── Categories ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-mono tracking-widest text-amber-400 mb-3 uppercase">Categorías</p>
          <h2 className="font-display text-4xl text-white">Explora por disciplina</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="glass glass-hover rounded-xl p-6 flex items-center gap-4 group"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="font-display text-lg text-white group-hover:text-amber-300 transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="glass rounded-3xl p-12 gradient-radial">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
            Tu mente merece<br />
            <em className="text-amber-400 not-italic">palabras mejores</em>
          </h2>
          <p className="mb-8 text-lg" style={{ color: 'var(--text-dim)' }}>
            Únete a miles de personas que usan LexiMind para pensar con mayor precisión y claridad.
          </p>
          <Link href="/auth/register">
            <button className="btn-primary text-base px-8 py-3">
              Comenzar gratis →
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-10 px-6 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-faint)' }}>
        <p className="font-display text-lg mb-2" style={{ color: 'var(--text-dim)' }}>LexiMind</p>
        <p className="text-sm">Plataforma de aprendizaje de vocabulario · Gratis y open source</p>
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <Link href="/learn" className="hover:text-amber-400 transition-colors">Aprender</Link>
          <Link href="/word/entropia" className="hover:text-amber-400 transition-colors">Explorar</Link>
          <Link href="/auth/register" className="hover:text-amber-400 transition-colors">Registrarse</Link>
        </div>
      </footer>
    </>
  )
}
