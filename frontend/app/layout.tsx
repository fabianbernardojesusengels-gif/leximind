import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/ui/Navbar'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://leximind.app'),
  title: {
    default: 'LexiMind — Aprende vocabulario con IA',
    template: '%s | LexiMind',
  },
  description:
    'Plataforma de aprendizaje de vocabulario inteligente. Aprende palabras profundamente con definiciones avanzadas, ejemplos reales y repetición espaciada. Gratis.',
  keywords: ['aprender vocabulario', 'palabras en español', 'diccionario inteligente', 'repetición espaciada', 'SRS', 'aprendizaje adaptativo'],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'LexiMind',
  },
verification: {
  google: 'U6hUEjyiUImrD-wBukxJtursxVH0oHlHGvSTGNsT6iU',
},
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
