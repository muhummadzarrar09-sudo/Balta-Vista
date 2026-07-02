import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pine & Peak Nathiagali',
    short_name: 'Pine & Peak',
    description: 'Luxury hill hotel opening in Nathiagali, Pakistan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#11130f',
    theme_color: '#11130f',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }]
  };
}
