'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

const CATEGORIES = ['science', 'philosophy', 'psychology', 'technology', 'language', 'mathematics', 'arts', 'history', 'economics', 'general']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert']
const DIFF_DOTS: Record<string, string> = { beginner: '●○○○', intermediate: '●●○○', advanced: '●●●○', expert: '●●●●' }
const DIFF_COLORS: Record<string, string> = { beginner: '#4dd9ac', intermediate: '#f5a623', advanced: '#ff8a8a', expert: '#b08aff' }

export default function ExplorePage() {
  const [words, setWords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    api.listWords({ category: category || undefined, difficulty: difficulty || undefined, search: search || undefined })
      .then(setWords)
      .finally(() => setLoading(false))
  }, [category, difficulty, search])

  const FilterBtn = ({ value, current, onSelect, label }: any) => (
    <button
      onClick={() => onSelect(current === value ? '' : value)}
      className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
      style={{
        borderColor: current === value ? 'rgba(245,166,35,0.5)' : 'var(--border)',
        color: current === value ? '#f5a623' : 'var(--text-dim)',
        background: current === value ? 'rgba(245,166,35,0.1)' : 'transparent',
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen gradient-radial py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-mono tracking-widest mb-3" style={{ color: 'var(--amber)' }}>VOCABULARIO</p>
          <h1 className="font-display text-5xl text-white mb-6">Explorar palabras</h1>

          {/* Search */}
          <input
            className="input mb-6"
            placeholder="Buscar palabra..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            {CATEGORIES.map(cat => (
              <FilterBtn key={cat} value={cat} current={category} onSelect={setCategory} label={cat} />
            ))}
          </div>

          {/* Difficulty filters */}
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(diff => (
              <FilterBtn key={diff} value={diff} current={difficulty} onSelect={setDifficulty} label={diff} />
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse" style={{ height: 180 }}>
                <div className="h-3 rounded-full mb-4" style={{ width: '40%', background: 'var(--bg3)' }} />
                <div className="h-6 rounded-full mb-3" style={{ width: '70%', background: 'var(--bg3)' }} />
                <div className="h-3 rounded-full mb-2" style={{ background: 'var(--bg3)' }} />
                <div className="h-3 rounded-full" style={{ width: '80%', background: 'var(--bg3)' }} />
              </div>
            ))}
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">◌</p>
            <p style={{ color: 'var(--text-dim)' }}>No se encontraron palabras con esos filtros.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {words.map((word: any) => (
              <Link key={word.id} href={`/word/${word.slug}`}>
                <article className="glass glass-hover rounded-2xl p-6 h-full cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`badge badge-${word.category}`}>{word.category}</span>
                    <span className="font-mono text-xs" style={{ color: DIFF_COLORS[word.difficulty] }}>
                      {DIFF_DOTS[word.difficulty]}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-white mb-2">{word.word}</h2>
                  {word.phonetic && (
                    <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-faint)' }}>{word.phonetic}</p>
                  )}
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                    {word.simple_definition}
                  </p>
                  <p className="mt-4 text-xs font-mono" style={{ color: 'var(--amber)' }}>Ver más →</p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
