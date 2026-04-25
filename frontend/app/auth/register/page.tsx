import AuthPage from '@/components/ui/AuthPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear cuenta gratis — LexiMind',
  description: 'Regístrate en LexiMind y empieza a aprender vocabulario avanzado hoy mismo. Gratis.',
}

export default function RegisterPage() {
  return <AuthPage mode="register" />
}
