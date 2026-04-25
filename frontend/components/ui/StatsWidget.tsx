'use client'
import { useProgress } from '@/lib/hooks'
import { useAuth } from '@/lib/store'

export default function StatsWidget() {
  const { user } = useAuth()
  const { stats } = useProgress()

  if (!user || !stats) return null

  const total = stats.words_known + stats.words_learning + stats.words_unknown

  return (
    <div
      className="glass rounded-2xl p-5"
      style={{ minWidth: 220 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔥</span>
        <span className="font-display text-2xl text-white">{user.streak_days}</span>
        <span className="text-sm" style={{ color: 'var(--text-dim)' }}>días de racha</span>
      </div>

      {total > 0 && (
        <>
          {/* Mini stacked bar */}
          <div className="flex h-1.5 rounded-full overflow-hidden mb-3">
            <div style={{ width: `${(stats.words_known / total) * 100}%`, background: '#4dd9ac' }} />
            <div style={{ width: `${(stats.words_learning / total) * 100}%`, background: '#f5a623' }} />
            <div style={{ width: `${((total - stats.words_known - stats.words_learning) / total) * 100}%`, background: 'var(--bg3)' }} />
          </div>

          <div className="flex justify-between text-xs" style={{ color: 'var(--text-faint)' }}>
            <span style={{ color: '#4dd9ac' }}>✓ {stats.words_known}</span>
            <span style={{ color: '#f5a623' }}>↻ {stats.words_learning}</span>
            <span style={{ color: '#b08aff' }}>{stats.mastery_percentage}%</span>
          </div>
        </>
      )}
    </div>
  )
}
