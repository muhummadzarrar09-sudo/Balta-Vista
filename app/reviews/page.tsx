import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MapPin, MessageCircle, ShieldCheck, Star, UsersRound } from 'lucide-react';
import { BrandMark, Button, SectionEyebrow, StudioCard } from '@/components/ui';
import { getWhatsAppNumber } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Guest Confidence',
  description: 'Guest confidence and trust signals for Balta Vista Nathiagali before verified opening-season reviews begin.',
  alternates: { canonical: '/reviews' },
  openGraph: {
    title: 'Guest Confidence · Balta Vista Nathiagali',
    description: 'Trust signals, reservations process, and verified-feedback readiness for Balta Vista Nathiagali.',
    url: '/reviews',
    images: ['/opengraph-image']
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/twitter-image']
  }
};

const confidenceSignals = [
  {
    icon: ShieldCheck,
    title: 'Direct reservations process',
    text: 'Every opening-season inquiry is reviewed by the reservations team instead of being pushed through a noisy automated checkout.'
  },
  {
    icon: MapPin,
    title: 'Road-aware confirmation',
    text: 'For Nathiagali stays, dates and room availability can be considered alongside weather, route timing, and winter access guidance.'
  },
  {
    icon: Star,
    title: 'Verified feedback after opening',
    text: 'This page is prepared for verified guest feedback once real stays begin. Until then, the site avoids presenting simulated reviews as operational proof.'
  },
  {
    icon: UsersRound,
    title: 'Owner-led hospitality story',
    text: 'The brand is positioned around a personal mountain-house approach: fewer distractions, warmer service, and a quieter sense of place.'
  },
  {
    icon: CheckCircle2,
    title: 'Clear room-tier guidance',
    text: 'Rooms are explained by best-fit use case, starting rate, layout mood, and view emphasis so guests can choose with confidence.'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp continuation',
    text: 'After an inquiry is submitted, guests can continue the conversation with a reference and keep all travel details in one thread.'
  }
];

function ConfidenceJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balta-vista-nathiagali.example';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Guest Confidence · Balta Vista Nathiagali',
    url: `${siteUrl}/reviews`,
    about: {
      '@type': 'Hotel',
      name: 'Balta Vista Nathiagali',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nathiagali',
        addressRegion: 'Khyber Pakhtunkhwa',
        addressCountry: 'PK'
      }
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function ReviewsPage() {
  const whatsappNumber = getWhatsAppNumber();
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi, I would like to inquire about Balta Vista Nathiagali bookings.')}`;
  return (
    <main className="min-h-screen bg-charcoal px-5 py-16 text-stone md:px-8">
      <ConfidenceJsonLd />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3" aria-label="Back to Balta Vista site">
            <BrandMark className="h-10 w-10 transition group-hover:border-brass/55 group-hover:bg-brass/15" />
            <span className="text-sm uppercase tracking-[0.22em] text-brass">Back to site</span>
          </Link>
          <Button asChild variant="secondary" size="sm"><Link href="/booking">Start inquiry</Link></Button>
        </div>

        <section className="mt-16 grid gap-10 md:grid-cols-[.82fr_1.18fr] md:items-center">
          <div>
            <SectionEyebrow>Guest confidence</SectionEyebrow>
            <h1 className="font-serif text-6xl leading-none md:text-8xl">Trust before the first verified review.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">Balta Vista is in its opening-preview stage. Rather than dressing simulated quotes as proof, this page explains the trust signals already built into the guest journey.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Verified feedback after opening', 'No fake review carousel', 'Direct reservations desk', 'Road-aware inquiry flow'].map((item) => <span key={item} className="rounded-full border border-stone/12 bg-stone/6 px-4 py-2 text-sm text-stone/76">{item}</span>)}
            </div>
          </div>

          <StudioCard className="p-7 md:p-8">
            <div className="rounded-[26px] border border-brass/20 bg-brass/10 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sage">Opening trust position</p>
              <h2 className="mt-4 font-serif text-5xl leading-none text-stone md:text-6xl">Reviews will become proof after real stays begin.</h2>
              <p className="mt-5 text-lg leading-8 text-muted">Until verified guest feedback exists, credibility comes from transparent room tiers, a personal reservations workflow, route-aware confirmation, and a clear owner-led hospitality story.</p>
            </div>
          </StudioCard>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {confidenceSignals.map(({ icon: Icon, title, text }, index) => (
            <StudioCard key={title} className="relative flex min-h-[300px] flex-col p-6">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brass/15 text-brass"><Icon /></div>
              <h2 className="font-serif text-3xl leading-none text-stone">{title}</h2>
              <p className="mt-5 text-lg leading-8 text-muted">{text}</p>
              <span className="pointer-events-none absolute right-6 top-6 font-serif text-7xl text-stone/[0.03]">{String(index + 1).padStart(2, '0')}</span>
            </StudioCard>
          ))}
        </section>

        <StudioCard className="mt-12 grid items-center gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
          <div>
            <SectionEyebrow>Want availability?</SectionEyebrow>
            <h2 className="font-serif text-4xl md:text-5xl">Send a full-rate inquiry for the opening season.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted">Opening inquiries are confirmed directly by the team, including dates, room tier, road conditions, and next steps.</p>
          </div>
          <div className="flex flex-wrap gap-3"><Button asChild><Link href="/booking">Book Now</Link></Button><Button asChild variant="secondary"><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a></Button></div>
        </StudioCard>
      </div>
    </main>
  );
}
