import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-radial text-center px-6">
      <div>
        <p className="font-mono text-6xl mb-6" style={{ color: 'var(--text-faint)' }}>404</p>
        <h1 className="font-display text-4xl text-white mb-4">Palabra no encontrada</h1>
        <p className="mb-8" style={{ color: 'var(--text-dim)' }}>
          Esta página no existe. Quizás la palabra aún no está en nuestra base de datos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <button className="btn-primary">Volver al inicio</button>
          </Link>
          <Link href="/learn">
            <button className="btn-ghost">Explorar vocabulario</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
