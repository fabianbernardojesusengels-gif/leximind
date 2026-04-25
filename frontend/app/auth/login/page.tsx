import AuthPage from '@/components/ui/AuthPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión — LexiMind',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <AuthPage mode="login" />
}
