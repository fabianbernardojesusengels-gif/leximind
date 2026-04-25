export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-radial">
      <div className="text-center">
        <div
          className="font-display text-5xl text-white mb-4"
          style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
        >
          ◎
        </div>
        <p className="font-mono text-sm" style={{ color: 'var(--text-faint)' }}>
          Cargando...
        </p>
      </div>
    </div>
  )
}
