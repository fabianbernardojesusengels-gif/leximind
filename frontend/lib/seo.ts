// Shared SEO utilities for LexiMind pages

export function generateWordMeta(word: {
  word: string
  slug: string
  simple_definition: string
  category: string
  difficulty: string
}) {
  const title = `${word.word} — Definición, etimología y ejemplos | LexiMind`
  const description = `¿Qué significa "${word.word}"? ${word.simple_definition} Aprende esta palabra con ejemplos reales, definición avanzada y explicación IA en LexiMind.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article' as const,
      url: `https://leximind.app/word/${word.slug}`,
    },
    twitter: {
      card: 'summary' as const,
      title,
      description,
    },
    alternates: {
      canonical: `https://leximind.app/word/${word.slug}`,
    },
    keywords: [
      `qué significa ${word.word}`,
      `definición ${word.word}`,
      `significado de ${word.word}`,
      `${word.word} significado`,
      `${word.word} etimología`,
      word.category,
      'vocabulario avanzado',
      'diccionario español',
    ],
  }
}

export function generateWordJsonLd(word: {
  word: string
  slug: string
  simple_definition: string
  advanced_definition: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.word,
    description: word.simple_definition,
    url: `https://leximind.app/word/${word.slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'LexiMind Vocabulary',
      url: 'https://leximind.app',
      description: 'Plataforma de aprendizaje de vocabulario en español con IA',
    },
  }
}
