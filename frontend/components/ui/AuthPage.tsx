'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/store'

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { login, register, isLoading } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!username || !password) { setError('Completa todos los campos'); return }
    try {
      if (mode === 'login') {
        await login(username, password)
      } else {
        await register(username, password, email || undefined)
      }
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message || 'Error al autenticar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-radial px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-3xl text-white hover:text-amber-300 transition-colors">
            LexiMind
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-dim)' }}>
            {mode === 'login' ? 'Continúa tu aprendizaje' : 'Comienza a aprender hoy'}
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="font-display text-2xl text-white mb-7">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-dim)' }}>USUARIO</label>
              <input
                className="input"
                placeholder="tu_usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-dim)' }}>EMAIL (opcional)</label>
                <input
                  className="input"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-dim)' }}>CONTRASEÑA</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && (
              <p className="text-sm px-4 py-2 rounded-lg" style={{ color: '#ff8a8a', background: 'rgba(255,138,138,0.1)' }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {isLoading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-dim)' }}>
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <Link
              href={mode === 'login' ? '/auth/register' : '/auth/login'}
              className="text-amber-400 hover:underline"
            >
              {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
            </Link>
          </p>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-faint)' }}>
          Sin tarjeta de crédito. Sin spam. 100% gratis.
        </p>
      </div>
    </div>
  )
}
