import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://balta-vista-nathiagali.example';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/rooms`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/experience`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/location`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/design`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 }
  ];
}
