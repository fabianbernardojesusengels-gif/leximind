import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WordPageClient from './WordPageClient'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getWord(slug: string) {
  try {
    const res = await fetch(`${API}/api/words/${slug}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const word = await getWord(params.slug)
  if (!word) return { title: 'Palabra no encontrada' }

  const title = `${word.word} — Definición, etimología y ejemplos`
  const description = `${word.simple_definition} | Aprende "${word.word}" en profundidad con LexiMind: definición avanzada, etimología, ejemplos de uso y más.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://leximind.app/word/${params.slug}`,
    },
    alternates: {
      canonical: `https://leximind.app/word/${params.slug}`,
    },
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/api/words/slugs`, { next: { revalidate: 3600 } })
    const slugs: string[] = await res.json()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export default async function WordPage({ params }: { params: { slug: string } }) {
  const word = await getWord(params.slug)
  if (!word) notFound()

  // JSON-LD structured data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.word,
    description: word.simple_definition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'LexiMind Vocabulary',
      url: 'https://leximind.app',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WordPageClient word={word} />
    </>
  )
}
