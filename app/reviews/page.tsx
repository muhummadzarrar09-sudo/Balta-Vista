import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, MessageCircle, Star } from 'lucide-react';
import { Button, SectionEyebrow, StudioCard } from '@/components/ui';
import { getWhatsAppNumber } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'Guest confidence, rating breakdown, and structured review cards for Pine & Peak Nathiagali.',
  alternates: { canonical: '/reviews' },
  openGraph: {
    title: 'Reviews · Pine & Peak Nathiagali',
    description: 'Preview review structure and guest confidence page for Pine & Peak Nathiagali.',
    url: '/reviews',
    images: ['/opengraph-image']
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/twitter-image']
  }
};

const reviewSummary = {
  average: 4.9,
  count: 128,
  breakdown: [92, 6, 2, 0, 0]
};

const reviews = [
  {
    name: 'Ayesha K.',
    location: 'Islamabad',
    rating: 5,
    stay: 'Winter preview weekend',
    text: 'The mood already feels like the kind of mountain hotel Pakistan needs — warm, cinematic, and deeply tied to Nathiagali instead of feeling like a generic resort.',
    tags: ['Snowfall', 'Family stay']
  },
  {
    name: 'Hamza R.',
    location: 'Rawalpindi',
    rating: 5,
    stay: 'Suite concept walkthrough',
    text: 'The room hierarchy is clear and the suite direction feels genuinely premium. The restraint in the design makes it feel more expensive than an over-decorated hotel site.',
    tags: ['Suite', 'Design']
  },
  {
    name: 'Sara M.',
    location: 'Lahore',
    rating: 5,
    stay: 'Green season concept review',
    text: 'Loved that the experience is about the place — trails, bonfires, weather, and views. That makes it much more memorable than another room-and-breakfast listing.',
    tags: ['Trails', 'Couples']
  },
  {
    name: 'Bilal A.',
    location: 'Peshawar',
    rating: 5,
    stay: 'Booking flow test',
    text: 'The full-rate inquiry flow is simple and avoids the messy deposit confusion most WhatsApp bookings have. It feels premium without pretending payments are live yet.',
    tags: ['Booking', 'Trust']
  },
  {
    name: 'Mariam T.',
    location: 'Karachi',
    rating: 4,
    stay: 'Brand preview',
    text: 'The owner note and reviews page help the new property feel more credible. Once real photography is added, this can compete visually with established hill hotels.',
    tags: ['Brand', 'Owner story']
  },
  {
    name: 'Usman N.',
    location: 'Murree',
    rating: 5,
    stay: 'Location review',
    text: 'The gold route line is a smart touch. It makes the journey feel intentional and gives guests practical context before they start asking road-condition questions.',
    tags: ['Location', 'Road access']
  }
];

function Stars({ rating }: { rating: number }) {
  return <span className="flex text-brass">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill={i < rating ? 'currentColor' : 'none'} className={i < rating ? '' : 'opacity-35'} />)}</span>;
}

function ReviewsJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pine-peak-nathiagali.example';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: 'Pine & Peak Nathiagali',
    url: `${siteUrl}/reviews`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviewSummary.average,
      reviewCount: reviewSummary.count,
      bestRating: 5,
      worstRating: 1
    },
    review: reviews.slice(0, 4).map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.name },
      reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 },
      reviewBody: review.text
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function ReviewsPage() {
  const whatsappNumber = getWhatsAppNumber();
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi, I would like to inquire about Pine & Peak Nathiagali bookings.')}`;
  return (
    <main className="min-h-screen bg-charcoal px-5 py-16 text-stone md:px-8">
      <ReviewsJsonLd />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm uppercase tracking-[0.22em] text-brass">← Back to site</Link>
          <Button asChild variant="secondary" size="sm"><Link href="/#booking">Start inquiry</Link></Button>
        </div>

        <section className="mt-16 grid gap-10 md:grid-cols-[.82fr_1.18fr]">
          <div>
            <SectionEyebrow>Guest confidence</SectionEyebrow>
            <h1 className="font-serif text-6xl leading-none md:text-8xl">Proof without the carousel noise.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">Placeholder reviews are structured like production data so the section can later connect cleanly to Google Places, a CMS, or a verified internal review feed.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Google-ready structure', 'No autoplay carousel', 'Rating breakdown', 'Review cards'].map((item) => <span key={item} className="rounded-full border border-stone/12 bg-stone/6 px-4 py-2 text-sm text-stone/76">{item}</span>)}
            </div>
          </div>

          <StudioCard className="p-7 md:p-8">
            <div className="grid gap-8 md:grid-cols-[260px_1fr]">
              <div className="rounded-[26px] border border-brass/20 bg-brass/10 p-7 text-center">
                <p className="font-serif text-8xl leading-none text-brass">{reviewSummary.average}</p>
                <div className="mt-4 flex justify-center"><Stars rating={5} /></div>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-muted">+{reviewSummary.count} preview reviews</p>
              </div>
              <div className="grid content-center gap-3">
                {reviewSummary.breakdown.map((value, i) => (
                  <div key={i} className="grid grid-cols-[62px_1fr_44px] items-center gap-3 text-sm text-muted">
                    <span>{5 - i} star</span>
                    <span className="h-2 overflow-hidden rounded-full bg-stone/12"><span className="block h-full rounded-full bg-brass" style={{ width: `${value}%` }} /></span>
                    <span>{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </StudioCard>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review, index) => (
            <StudioCard key={`${review.name}-${review.stay}`} className="flex min-h-[360px] flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-stone/12 bg-gradient-to-br from-clay to-pine-soft font-serif text-xl text-stone">{review.name[0]}</span>
                  <div>
                    <p className="font-serif text-2xl">{review.name}</p>
                    <p className="flex items-center gap-1 text-sm text-muted"><MapPin size={13} className="text-sage" /> {review.location}</p>
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>
              <p className="mt-6 text-lg leading-8 text-stone/82">“{review.text}”</p>
              <div className="mt-auto pt-7">
                <p className="mb-4 text-xs uppercase tracking-[0.22em] text-brass">{review.stay}</p>
                <div className="flex flex-wrap gap-2">{review.tags.map((tag) => <span key={tag} className="rounded-full bg-stone/7 px-3 py-1 text-xs text-muted">{tag}</span>)}</div>
              </div>
              <span className="pointer-events-none absolute right-6 top-6 font-serif text-7xl text-stone/[0.03]">{String(index + 1).padStart(2, '0')}</span>
            </StudioCard>
          ))}
        </section>

        <StudioCard className="mt-12 grid items-center gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
          <div>
            <SectionEyebrow>Want availability?</SectionEyebrow>
            <h2 className="font-serif text-4xl md:text-5xl">Send a full-rate inquiry for the opening season.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted">No deposit or online payment is collected in this MVP. The team can confirm dates, room tier, road conditions, and next steps directly.</p>
          </div>
          <div className="flex flex-wrap gap-3"><Button asChild><Link href="/#booking">Book Now</Link></Button><Button asChild variant="secondary"><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a></Button></div>
        </StudioCard>
      </div>
    </main>
  );
}
