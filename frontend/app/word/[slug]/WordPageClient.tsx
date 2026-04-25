'use client'
import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/store'

interface Word {
  id: number
  word: string
  slug: string
  simple_definition: string
  advanced_definition: string
  category: string
  difficulty: string
  examples?: string
  etymology?: string
  related_words?: string
  phonetic?: string
  user_status?: string
}

export default function WordPageClient({ word }: { word: Word }) {
  const { user } = useAuth()
  const [status, setStatus] = useState<string>(word.user_status || '')
  const [aiExplain, setAiExplain] = useState<any>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const examples = word.examples ? JSON.parse(word.examples) : []
  const relatedWords = word.related_words ? JSON.parse(word.related_words) : []

  const markStatus = async (newStatus: string) => {
    if (!user) return
    await api.updateProgress(word.id, newStatus as any)
    setStatus(newStatus)
  }

  const fetchAI = async () => {
    setAiLoading(true)
    try {
      const data = await api.explainWord(word.word)
      setAiExplain(data)
    } finally {
      setAiLoading(false)
    }
  }

  const difficultyClass = `diff-${word.difficulty}`
  const badgeClass = `badge badge-${word.category}`

  return (
    <div className="min-h-screen gradient-radial">
      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* Breadcrumb */}
        <nav className="mb-10 text-sm" style={{ color: 'var(--text-faint)' }}>
          <Link href="/" className="hover:text-amber-400 transition-colors">Inicio</Link>
          <span className="mx-2">›</span>
          <Link href="/learn" className="hover:text-amber-400 transition-colors">Vocabulario</Link>
          <span className="mx-2">›</span>
          <span style={{ color: 'var(--text-dim)' }}>{word.word}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className={badgeClass}>{word.category}</span>
            <span className={`font-mono text-xs ${difficultyClass}`} style={{ color: 'var(--text-faint)' }}></span>
          </div>

          <h1 className="font-display text-6xl md:text-7xl text-white mb-2 text-glow-amber">
            {word.word}
          </h1>

          {word.phonetic && (
            <p className="font-mono text-lg mb-6" style={{ color: 'var(--text-dim)' }}>
              {word.phonetic}
            </p>
          )}

          {/* Simple definition */}
          <p className="text-xl leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            {word.simple_definition}
          </p>
        </div>

        {/* Status buttons */}
        {user ? (
          <div className="flex gap-3 mb-12 flex-wrap">
            {[
              { key: 'known', label: '✓ La conozco', color: '#4dd9ac' },
              { key: 'learning', label: '↻ Aprendiendo', color: 'var(--amber)' },
              { key: 'unknown', label: '◌ No la conozco', color: '#ff8a8a' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => markStatus(opt.key)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all border"
                style={{
                  borderColor: status === opt.key ? opt.color : 'var(--border)',
                  color: status === opt.key ? opt.color : 'var(--text-dim)',
                  background: status === opt.key ? `${opt.color}18` : 'transparent',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-4 mb-12 text-sm" style={{ color: 'var(--text-dim)' }}>
            <Link href="/auth/login" className="text-amber-400 hover:underline">Inicia sesión</Link> para marcar tu progreso con esta palabra.
          </div>
        )}

        {/* Advanced definition */}
        <div className="glass rounded-2xl p-8 mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-left flex items-center justify-between"
          >
            <h2 className="font-display text-xl text-white">Definición avanzada</h2>
            <span className="text-amber-400 text-lg">{showAdvanced ? '−' : '+'}</span>
          </button>
          {showAdvanced && (
            <p className="mt-4 leading-relaxed text-base" style={{ color: 'var(--text-dim)' }}>
              {word.advanced_definition}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Etymology */}
          {word.etymology && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg text-white mb-3">Etimología</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{word.etymology}</p>
            </div>
          )}

          {/* Related words */}
          {relatedWords.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg text-white mb-3">Palabras relacionadas</h3>
              <div className="flex flex-wrap gap-2">
                {relatedWords.map((w: string) => (
                  <span key={w} className="px-3 py-1 rounded-full text-xs glass" style={{ color: 'var(--text-dim)' }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Examples */}
        {examples.length > 0 && (
          <div className="glass rounded-2xl p-8 mb-6">
            <h3 className="font-display text-xl text-white mb-5">Ejemplos de uso</h3>
            <div className="space-y-4">
              {examples.map((ex: string, i: number) => (
                <div key={i} className="flex gap-4">
                  <span className="font-mono text-xs mt-1 shrink-0" style={{ color: 'var(--amber)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Explanation */}
        <div className="glass rounded-2xl p-8 glow-amber">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl text-white flex items-center gap-2">
              <span>🤖</span> Explicación con IA
            </h3>
            {!aiExplain && (
              <button
                onClick={fetchAI}
                disabled={aiLoading}
                className="btn-primary text-sm py-2"
              >
                {aiLoading ? 'Generando...' : 'Explicar →'}
              </button>
            )}
          </div>

          {!aiExplain && !aiLoading && (
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              La IA puede generar una explicación personalizada, una analogía memorable y conexiones conceptuales únicas.
            </p>
          )}

          {aiLoading && (
            <div className="space-y-3">
              {[80, 60, 90].map((w, i) => (
                <div key={i} className="h-3 rounded-full animate-pulse" style={{ width: `${w}%`, background: 'var(--bg3)' }} />
              ))}
            </div>
          )}

          {aiExplain && (
            <div className="space-y-5">
              {aiExplain.is_mock && (
                <p className="text-xs font-mono px-3 py-1 rounded-full inline-block" style={{ background: 'var(--bg3)', color: 'var(--text-faint)' }}>
                  Modo demo — conecta API para IA real
                </p>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider mb-2 font-mono" style={{ color: 'var(--amber)' }}>Explicación</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{aiExplain.explanation}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-2 font-mono" style={{ color: 'var(--teal)' }}>Analogía</p>
                <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-dim)' }}>{aiExplain.analogy}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-2 font-mono" style={{ color: '#b08aff' }}>Ejemplo</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{aiExplain.example}</p>
              </div>
              {aiExplain.related_concepts?.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2 font-mono" style={{ color: 'var(--text-faint)' }}>Conceptos relacionados</p>
                  <div className="flex flex-wrap gap-2">
                    {aiExplain.related_concepts.map((c: string) => (
                      <span key={c} className="px-3 py-1 rounded-full text-xs glass" style={{ color: 'var(--text-dim)' }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation CTA */}
        <div className="mt-12 text-center">
          <Link href="/learn">
            <button className="btn-primary px-8 py-3 text-base">
              Sesión de aprendizaje →
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
