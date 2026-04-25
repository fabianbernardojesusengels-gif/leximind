import { MetadataRoute } from 'next'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leximind.app'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/learn`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  try {
    const res = await fetch(`${API}/api/words/slugs`)
    const slugs: string[] = await res.json()
    const wordRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
      url: `${baseUrl}/word/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))
    return [...staticRoutes, ...wordRoutes]
  } catch {
    return staticRoutes
  }
}
