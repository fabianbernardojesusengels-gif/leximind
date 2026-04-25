import Link from 'next/link'

export default function WordNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-radial text-center px-6">
      <div>
        <p className="font-mono text-2xl mb-4" style={{ color: 'var(--text-faint)' }}>◌</p>
        <h1 className="font-display text-4xl text-white mb-4">Palabra no encontrada</h1>
        <p className="mb-8" style={{ color: 'var(--text-dim)' }}>
          Esta palabra no existe en nuestra base de datos todavía.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/explore">
            <button className="btn-primary">Explorar vocabulario</button>
          </Link>
          <Link href="/learn">
            <button className="btn-ghost">Sesión de aprendizaje</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
