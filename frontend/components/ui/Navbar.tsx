'use client'
import Link from 'next/link'
import { useAuth } from '@/lib/store'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user } = useAuth()
  const pathname = usePathname()

  const isHome = pathname === '/'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(8,8,15,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link href="/" className="font-display text-xl text-white hover:text-amber-300 transition-colors">
        Lexi<span style={{ color: 'var(--amber)' }}>Mind</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/learn" className="btn-ghost text-sm py-1.5 px-3 hidden sm:inline-block">
          Aprender
        </Link>
        <Link href="/word/entropia" className="btn-ghost text-sm py-1.5 px-3 hidden sm:inline-block">
          Explorar
        </Link>
        {user ? (
          <Link href="/dashboard" className="btn-primary text-sm py-1.5 px-4">
            {user.username}
          </Link>
        ) : (
          <Link href="/auth/register" className="btn-primary text-sm py-1.5 px-4">
            Empezar gratis
          </Link>
        )}
      </div>
    </nav>
  )
}
