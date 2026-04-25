'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/store'

const STATUSES = [
  { key: 'known', label: '✓ La conozco', color: '#4dd9ac', bg: 'rgba(77,217,172,0.12)' },
  { key: 'learning', label: '↻ Aprendiendo', color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
  { key: 'unknown', label: '◌ No la conozco', color: '#ff8a8a', bg: 'rgba(255,138,138,0.12)' },
]

export default function LearnPage() {
  const { user, refreshUser } = useAuth()
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [chosen, setChosen] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDailyWords(7).then((data) => {
      setWords(data)
      setLoading(false)
    })
  }, [])

  const current = words[index]
  const progress = words.length > 0 ? ((index) / words.length) * 100 : 0

  const handleStatus = async (status: string) => {
    if (chosen) return
    setChosen(status)
    const newResults = { ...results, [current.slug]: status }
    setResults(newResults)

    if (user) {
      try { await api.updateProgress(current.id, status as any) } catch {}
    }

    setTimeout(() => {
      if (index + 1 >= words.length) {
        setDone(true)
        if (user) refreshUser()
      } else {
        setIndex(index + 1)
        setFlipped(false)
        setChosen(null)
      }
    }, 800)
  }

  const examples = current?.examples ? JSON.parse(current.examples) : []
  const knownCount = Object.values(results).filter(v => v === 'known').length
  const learningCount = Object.values(results).filter(v => v === 'learning').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-radial">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">◎</div>
          <p style={{ color: 'var(--text-dim)' }}>Preparando tu sesión...</p>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-radial px-6">
        <div className="max-w-md w-full glass rounded-3xl p-10 text-center glow-amber">
          <div className="text-5xl mb-6">🎯</div>
          <h2 className="font-display text-3xl text-white mb-2">Sesión completada</h2>
          <p className="mb-8" style={{ color: 'var(--text-dim)' }}>
            {user ? `Racha: ${user.streak_days} días 🔥` : 'Regístrate para guardar tu progreso'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Conocidas', value: knownCount, color: '#4dd9ac' },
              { label: 'Aprendiendo', value: learningCount, color: '#f5a623' },
              { label: 'Nuevas', value: Object.values(results).filter(v => v === 'unknown').length, color: '#ff8a8a' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-4">
                <div className="text-2xl font-bold font-display mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-col">
            <button onClick={() => { setIndex(0); setDone(false); setFlipped(false); setChosen(null); setResults({}) }} className="btn-primary">
              Repetir sesión
            </button>
            <Link href="/dashboard">
              <button className="btn-ghost w-full">Ver mi progreso</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="min-h-screen gradient-radial py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-sm btn-ghost py-1.5 px-3 inline-block">← Inicio</Link>
          <span className="font-mono text-sm" style={{ color: 'var(--text-dim)' }}>
            {index + 1} / {words.length}
          </span>
          {user && (
            <span className="text-sm font-mono" style={{ color: 'var(--amber)' }}>
              🔥 {user.streak_days}d
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="progress-bar mb-10">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Card */}
        <div
          className={`glass rounded-3xl p-10 mb-6 cursor-pointer transition-all duration-300 ${
            chosen === 'known' ? 'card-known' :
            chosen === 'learning' ? 'card-learning' :
            chosen === 'unknown' ? 'card-unknown' : 'glass-hover'
          }`}
          onClick={() => !chosen && setFlipped(!flipped)}
          style={{ minHeight: 320 }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className={`badge badge-${current.category}`}>{current.category}</span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
              {flipped ? 'toca las opciones abajo' : 'toca para revelar'}
            </span>
          </div>

          <h2 className="font-display text-5xl text-white mb-3">{current.word}</h2>

          {current.phonetic && (
            <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-dim)' }}>{current.phonetic}</p>
          )}

          {!flipped ? (
            <div className="mt-8 text-center" style={{ color: 'var(--text-faint)' }}>
              <span className="text-3xl">◌</span>
              <p className="text-sm mt-2">Toca para ver la definición</p>
            </div>
          ) : (
            <div className="animate-slide-up">
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-dim)' }}>
                {current.simple_definition}
              </p>
              {examples[0] && (
                <div className="glass rounded-xl p-4">
                  <p className="text-xs font-mono mb-1" style={{ color: 'var(--amber)' }}>EJEMPLO</p>
                  <p className="text-sm italic" style={{ color: 'var(--text-dim)' }}>{examples[0]}</p>
                </div>
              )}
              <div className="mt-4">
                <Link href={`/word/${current.slug}`} onClick={(e) => e.stopPropagation()} className="text-xs hover:underline" style={{ color: 'var(--text-faint)' }}>
                  Ver definición completa →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => flipped && handleStatus(s.key)}
              disabled={!!chosen || !flipped}
              className="py-4 px-3 rounded-2xl text-sm font-medium transition-all border"
              style={{
                borderColor: chosen === s.key ? s.color : 'var(--border)',
                color: flipped ? s.color : 'var(--text-faint)',
                background: chosen === s.key ? s.bg : 'transparent',
                opacity: !flipped ? 0.4 : 1,
                cursor: flipped ? 'pointer' : 'default',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {!flipped && (
          <p className="text-center text-xs mt-4" style={{ color: 'var(--text-faint)' }}>
            Primero toca la tarjeta para ver la definición
          </p>
        )}
      </div>
    </div>
  )
}
