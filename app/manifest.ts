import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Balta Vista Nathiagali',
    short_name: 'Balta Vista',
    description: 'Luxury hill hotel opening in Nathiagali, Pakistan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#11130f',
    theme_color: '#11130f',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }]
  };
}
