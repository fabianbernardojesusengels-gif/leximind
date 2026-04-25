'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/store'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    api.getStats().then(setStats).finally(() => setLoading(false))
  }, [user])

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">◎</div>
      </div>
    )
  }

  const total = (stats?.words_known || 0) + (stats?.words_learning || 0) + (stats?.words_unknown || 0)

  return (
    <div className="min-h-screen gradient-radial py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: 'var(--amber)' }}>DASHBOARD</p>
            <h1 className="font-display text-4xl text-white">Hola, {user.username}</h1>
          </div>
          <button onClick={() => { logout(); router.push('/') }} className="btn-ghost text-sm">
            Cerrar sesión
          </button>
        </div>

        {/* Streak + mastery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Racha', value: `${user.streak_days}d`, icon: '🔥', color: 'var(--amber)' },
            { label: 'Dominadas', value: stats?.words_known || 0, icon: '✓', color: '#4dd9ac' },
            { label: 'Aprendiendo', value: stats?.words_learning || 0, icon: '↻', color: 'var(--amber)' },
            { label: 'Dominio', value: `${stats?.mastery_percentage || 0}%`, icon: '◎', color: '#b08aff' },
          ].map((stat) => (
            <div key={stat.label} className="glass glass-hover rounded-2xl p-6 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display text-3xl text-white mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress visual */}
        {total > 0 && (
          <div className="glass rounded-2xl p-8 mb-8">
            <h3 className="font-display text-xl text-white mb-5">Progreso de vocabulario</h3>
            <div className="space-y-4">
              {[
                { label: 'Conocidas', value: stats?.words_known || 0, color: '#4dd9ac' },
                { label: 'Aprendiendo', value: stats?.words_learning || 0, color: 'var(--amber)' },
                { label: 'Desconocidas', value: stats?.words_unknown || 0, color: '#ff8a8a' },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--text-dim)' }}>{bar.label}</span>
                    <span style={{ color: bar.color }}>{bar.value}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      style={{
                        width: total > 0 ? `${(bar.value / total) * 100}%` : '0%',
                        height: '100%',
                        background: bar.color,
                        borderRadius: 2,
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/learn" className="glass glass-hover rounded-2xl p-8 block group">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="font-display text-xl text-white mb-2 group-hover:text-amber-300 transition-colors">
              Sesión de aprendizaje
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              Practica las palabras de hoy con el sistema de repetición espaciada
            </p>
          </Link>

          <Link href="/word/entropia" className="glass glass-hover rounded-2xl p-8 block group">
            <div className="text-3xl mb-4">📖</div>
            <h3 className="font-display text-xl text-white mb-2 group-hover:text-amber-300 transition-colors">
              Explorar vocabulario
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              Descubre nuevas palabras con definiciones profundas y contexto etimológico
            </p>
          </Link>
        </div>

        {total === 0 && (
          <div className="mt-6 glass rounded-2xl p-6 text-center">
            <p style={{ color: 'var(--text-dim)' }}>
              Aún no has practicado ninguna palabra.{' '}
              <Link href="/learn" className="text-amber-400 hover:underline">¡Empieza tu primera sesión!</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
