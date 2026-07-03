import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Button, SectionEyebrow, StudioCard } from '@/components/ui';
import { nearbyPlaces, routeStops } from '@/lib/site-data';
import { SubpageCTA, SubpageFooter, SubpageHeader, SubpageHero } from '@/components/subpage';
import { hotelBaseSchema, jsonLd, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Location',
  description: 'How to reach Balta Vista Nathiagali from Islamabad and Rawalpindi, including route notes and nearby hill-station landmarks.',
  alternates: { canonical: '/location' }
};

function BrandedRouteFallback() {
  return (
    <>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 620" aria-hidden="true">
        <path d="M0 438 C110 398 170 468 285 413 C420 350 460 258 610 276 C760 294 780 180 900 136" fill="none" stroke="#11130f" strokeOpacity=".42" strokeWidth="46" />
        <path d="M78 532 C178 438 214 374 350 371 C477 368 492 232 622 228 C735 224 748 136 835 92" fill="none" stroke="#c08b3e" strokeWidth="5" strokeDasharray="11 13" />
        <circle cx="78" cy="532" r="12" fill="#11130f" stroke="#c08b3e" strokeWidth="4" />
        <circle cx="480" cy="265" r="12" fill="#11130f" stroke="#c08b3e" strokeWidth="4" />
        <circle cx="835" cy="92" r="18" fill="#c08b3e" />
        <text x="610" y="72" fill="#eadcc4" fontSize="30" fontFamily="Georgia">Balta Vista</text>
        <text x="612" y="104" fill="#c08b3e" fontSize="18">Nathiagali, KPK</text>
      </svg>
      <div className="absolute right-6 top-6 rounded-full border border-brass/30 bg-charcoal/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brass backdrop-blur">Map pin pending</div>
    </>
  );
}


function LocationJsonLd() {
  const base = siteUrl();
  return jsonLd({
    ...hotelBaseSchema(),
    url: `${base}/location`,
    hasMap: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || undefined,
    containedInPlace: { '@type': 'Place', name: 'Nathiagali, Khyber Pakhtunkhwa' }
  });
}

export default function LocationPage() {
  const mapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

  return (
    <main className="min-h-screen bg-charcoal text-stone">
      <LocationJsonLd />
      <SubpageHeader />
      <SubpageHero eyebrow="How to reach us" title="The approach is part of the stay.">
        Travel from Islamabad/Rawalpindi toward Murree and onward to Nathiagali, with winter road conditions confirmed before departure.
      </SubpageHero>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-24 md:grid-cols-[.82fr_1.18fr] md:px-8">
        <div className="grid gap-4">
          {routeStops.map(([title, text], i) => (
            <StudioCard key={title} className="grid grid-cols-[48px_1fr] gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brass/15 font-serif text-xl text-brass">{i + 1}</span>
              <div>
                <h2 className="font-serif text-3xl">{title}</h2>
                <p className="mt-2 leading-7 text-muted">{text}</p>
              </div>
            </StudioCard>
          ))}
          <StudioCard className="p-5">
            <SectionEyebrow>Arrival guidance</SectionEyebrow>
            <p className="text-lg leading-8 text-muted">Exact turn-by-turn guidance, parking instructions, and winter advisories are confirmed with guests once dates are known.</p>
          </StudioCard>
          <Button asChild className="mt-3"><Link href="/booking">Ask about travel dates</Link></Button>
        </div>

        <div className="map-shell relative min-h-[620px] overflow-hidden rounded-card border border-stone/12 shadow-soft">
          {mapUrl ? (
            <iframe src={mapUrl} className="absolute inset-0 h-full w-full border-0 opacity-85 grayscale-[.25] sepia-[.16]" loading="lazy" title="Balta Vista Nathiagali map" />
          ) : (
            <BrandedRouteFallback />
          )}
          <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-stone/12 bg-charcoal/72 p-5 backdrop-blur">
            <p className="font-serif text-2xl"><MapPin className="mr-2 inline text-brass" />Nathiagali, Khyber Pakhtunkhwa</p>
            <p className="mt-2 text-sm leading-6 text-muted">Approx. 2.5–3.5 hours from Islamabad depending on season, traffic, and snowfall.</p>
          </div>
        </div>

        <div className="grid gap-4 md:col-span-2 md:grid-cols-4">
          {nearbyPlaces.map(([name, type]) => (
            <StudioCard key={name} className="p-5">
              <p className="font-serif text-2xl">{name}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-sage">{type}</p>
            </StudioCard>
          ))}
        </div>
      </section>

      <SubpageCTA title="Confirm dates with road conditions in mind." text="The reservations team can help align room availability with weather, route timing, and arrival guidance." />
      <SubpageFooter />
    </main>
  );
}
