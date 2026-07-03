import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Eye, Tv, Wifi, Wind } from 'lucide-react';
import { Button, SectionEyebrow, StudioCard } from '@/components/ui';
import { rooms } from '@/lib/site-data';
import { SubpageCTA, SubpageFooter, SubpageHeader, SubpageHero } from '@/components/subpage';
import { hotelBaseSchema, jsonLd, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Rooms & Suites',
  description: 'Explore opening-season room tiers at Balta Vista Nathiagali: Single Bedroom, Double Bedroom, and Signature Suite.',
  alternates: { canonical: '/rooms' }
};

const comparisonRows = [
  ['Starting rate', 'PKR 85,000', 'PKR 105,000', 'PKR 165,000'],
  ['Best for', 'Solo / short stay', 'Couples / small family', 'Occasion / longer stay'],
  ['Layout mood', 'Quiet retreat', 'Generous comfort', 'Lounge-style suite'],
  ['View emphasis', 'Mountain-facing', 'Pine outlook', 'Panoramic valley']
];


function RoomsJsonLd() {
  const base = siteUrl();
  return jsonLd({
    ...hotelBaseSchema(),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Balta Vista room tiers',
      itemListElement: rooms.map((room) => ({
        '@type': 'Offer',
        name: room.name,
        priceCurrency: 'PKR',
        price: room.rate,
        availability: 'https://schema.org/PreOrder',
        url: `${base}/booking?room=${room.id}`,
        description: room.desc
      }))
    }
  });
}

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-charcoal text-stone">
      <RoomsJsonLd />
      <SubpageHeader />
      <SubpageHero eyebrow="Rooms & Suites" title="Rooms shaped for heated evenings and pine-soft mornings.">
        Each tier is presented as a full-rate opening inquiry, with TV, climate comfort, WiFi, and view-led hospitality as baseline expectations.
      </SubpageHero>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 md:px-8">
        {rooms.map((room, index) => (
          <StudioCard key={room.id} className="grid gap-6 p-4 md:grid-cols-[.95fr_1.05fr] md:p-5">
            <div className="relative min-h-[360px] overflow-hidden rounded-[24px] md:min-h-[460px]">
              <Image src={room.image} alt={room.name} fill quality={95} sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" />
              <div className="absolute left-5 top-5 rounded-full border border-brass/30 bg-charcoal/55 px-4 py-2 text-xs uppercase tracking-[0.22em] text-brass backdrop-blur">Tier {String(index + 1).padStart(2, '0')}</div>
            </div>
            <div className="flex flex-col justify-center p-2 md:p-8">
              <SectionEyebrow>{room.price}</SectionEyebrow>
              <h2 className="font-serif text-5xl leading-none md:text-6xl">{room.name}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{room.desc}</p>
              <div className="mt-6 rounded-[24px] border border-brass/20 bg-brass/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage">Best for</p>
                <p className="mt-2 font-serif text-2xl leading-tight text-stone">{room.bestFor}</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                {room.details.map((detail) => <span key={detail} className="rounded-2xl border border-stone/10 bg-stone/6 px-4 py-3 text-sm text-stone/76">{detail}</span>)}
              </div>
              <div className="mt-9 flex flex-wrap gap-3"><Button asChild><Link href={`/booking?room=${room.id}`}>Inquire for this room</Link></Button><Button asChild variant="secondary"><Link href="/#rooms">View scroll experience</Link></Button></div>
            </div>
          </StudioCard>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="mb-8 max-w-3xl">
          <SectionEyebrow>Choosing your tier</SectionEyebrow>
          <h2 className="font-serif text-5xl leading-none text-stone md:text-6xl">A quieter comparison, not a crowded rate table.</h2>
        </div>
        <StudioCard className="overflow-hidden p-0">
          <div className="grid border-b border-stone/10 bg-stone/6 text-sm font-semibold uppercase tracking-[0.16em] text-sage md:grid-cols-4">
            <p className="p-5">Detail</p><p className="p-5">Single</p><p className="p-5">Double</p><p className="p-5">Suite</p>
          </div>
          {comparisonRows.map((row) => (
            <div key={row[0]} className="grid border-b border-stone/8 last:border-b-0 md:grid-cols-4">
              {row.map((cell, i) => <p key={`${row[0]}-${i}`} className={i === 0 ? 'bg-charcoal/28 p-5 text-sm uppercase tracking-[0.16em] text-muted' : 'p-5 font-serif text-2xl text-stone'}>{cell}</p>)}
            </div>
          ))}
        </StudioCard>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[[Tv, 'TV in every tier'], [Wind, 'Climate comfort'], [Wifi, 'WiFi baseline'], [Eye, 'View-led rooms']].map(([Icon, label]) => { const I = Icon as typeof Tv; return <StudioCard key={label as string} className="p-5"><I className="mb-4 text-brass"/><p className="font-serif text-2xl">{label as string}</p></StudioCard>; })}
        </div>
      </section>

      <SubpageCTA title="Ask about the room that fits your mountain stay." text="Send dates and guest details; the reservations team will confirm availability and the right tier directly." />
      <SubpageFooter />
    </main>
  );
}
