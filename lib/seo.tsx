export const siteName = 'Balta Vista Nathiagali';
export const defaultSiteUrl = 'https://balta-vista.local';

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || '';
}

export function jsonLd(data: unknown) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function hotelBaseSchema() {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: siteName,
    url: base,
    image: `${base}/assets/hero/luxury-hero-nathiagali.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nathiagali',
      addressRegion: 'Khyber Pakhtunkhwa',
      addressCountry: 'PK'
    },
    priceRange: 'PKR 85,000–165,000 per night'
  };
}
