import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button, SectionEyebrow, StudioCard } from '@/components/ui';
import { experiences, nearbyPlaces } from '@/lib/site-data';
import { EditorialBand, SubpageCTA, SubpageFooter, SubpageHeader, SubpageHero } from '@/components/subpage';
import { hotelBaseSchema, jsonLd, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Experience Nathiagali',
  description: 'Snowfall arrivals, green trails, bonfire nights, and the seasonal mountain atmosphere around Balta Vista Nathiagali.',
  alternates: { canonical: '/experience' }
};


function ExperienceJsonLd() {
  const base = siteUrl();
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Balta Vista Nathiagali experiences',
    url: `${base}/experience`,
    itemListElement: experiences.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: { '@type': 'TouristAttraction', name: item.title, description: item.detail }
    })),
    provider: hotelBaseSchema()
  });
}

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-charcoal text-stone">
      <ExperienceJsonLd />
      <SubpageHeader />
      <SubpageHero eyebrow="Experience" title="The stay begins with the season outside.">
        Balta Vista is positioned around place — snow, mist, trails, kahwa, bonfire evenings, and the slower rhythm of Nathiagali.
      </SubpageHero>
      <EditorialBand items={[["Season", "Snow · Green · Ember"], ["Nearby rhythm", "Dunga Gali · Ayubia"], ["Evening mood", "Kahwa · Bonfire · Quiet"]]} />
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {experiences.map((item) => (
            <StudioCard key={item.title} className="overflow-hidden p-4">
              <div className="relative min-h-[330px] overflow-hidden rounded-[24px]"><Image src={item.image} alt={item.title} fill quality={95} sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-charcoal/72 to-transparent"/></div>
              <div className="p-3 pt-6"><SectionEyebrow>{item.title}</SectionEyebrow><p className="text-lg leading-8 text-muted">{item.detail}</p></div>
            </StudioCard>
          ))}
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-[.85fr_1.15fr] md:items-start">
          <div><SectionEyebrow>Nearby rhythms</SectionEyebrow><h2 className="font-serif text-5xl leading-none md:text-6xl">Forest walks, ridge viewpoints, and road-aware planning.</h2><p className="mt-5 text-lg leading-8 text-muted">The hotel team can guide guests around season, weather, and practical approach details before travel.</p><Button asChild className="mt-8"><Link href="/location">Plan the route</Link></Button></div>
          <div className="grid gap-4 md:grid-cols-2">{nearbyPlaces.map(([name, type]) => <StudioCard key={name} className="p-5"><p className="font-serif text-3xl">{name}</p><p className="mt-2 text-sm uppercase tracking-[0.2em] text-sage">{type}</p></StudioCard>)}</div>
        </div>
      </section>
      <SubpageCTA title="Pair the season with the right room." text="Whether you are planning snowfall, trails, or a quiet bonfire weekend, start with an opening-season inquiry." />
      <SubpageFooter />
    </main>
  );
}
