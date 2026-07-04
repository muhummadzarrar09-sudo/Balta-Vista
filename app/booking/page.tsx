import type { Metadata } from 'next';
import { Clock, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { BookingFlow } from '@/components/booking-flow';
import { FAQSection } from '@/components/faq-section';
import { SectionEyebrow, StudioCard } from '@/components/ui';
import { EditorialBand, SubpageFooter, SubpageHeader, SubpageHero } from '@/components/subpage';
import { hotelBaseSchema, jsonLd, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Booking Inquiry',
  description: 'Send a full-rate opening-season booking inquiry for Balta Vista Nathiagali.',
  alternates: { canonical: '/booking' }
};

const deskNotes = [
  [Clock, 'What happens next', 'The reservations desk reviews your dates, room tier, and guest details before replying directly.'],
  [MapPin, 'Travel-aware reply', 'For winter and weekend stays, road timing and arrival guidance are confirmed with availability.'],
  [MessageCircle, 'WhatsApp continuation', 'After submitting, you can continue the conversation with your inquiry reference.'],
  [ShieldCheck, 'Full-rate inquiry', 'This is an availability request, not an automated checkout screen.']
];


function BookingJsonLd() {
  const base = siteUrl();
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'ReserveAction',
    name: 'Balta Vista opening-season booking inquiry',
    target: `${base}/booking`,
    object: hotelBaseSchema()
  });
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-charcoal text-stone">
      <BookingJsonLd />
      <SubpageHeader cta={false} />
      <SubpageHero eyebrow="Reservations" title="A quieter way to ask for opening-season dates.">
        Choose dates, select a room tier, and share guest details. The reservations team confirms availability, route considerations, and next steps directly.
      </SubpageHero>
      <EditorialBand items={[["Flow", "Dates · Room · Details"], ["Confirmation", "Reservations desk"], ["Reference", "WhatsApp-ready"]]} />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-24 md:px-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
        <aside className="lg:sticky lg:top-8">
          <StudioCard className="overflow-hidden p-5 md:p-6">
            <div className="rounded-[26px] border border-brass/20 bg-brass/10 p-6">
              <SectionEyebrow>Reservations desk</SectionEyebrow>
              <h2 className="font-serif text-4xl leading-none text-stone md:text-5xl">Personal confirmation, not a noisy checkout.</h2>
              <p className="mt-5 leading-7 text-muted">Your inquiry is treated like the start of a hosted stay: dates, room preference, guests, road timing, and arrival comfort are reviewed together.</p>
            </div>

            <div className="mt-5 grid gap-3">
              {deskNotes.map(([Icon, title, text]) => {
                const I = Icon as typeof Clock;
                return (
                  <div key={title as string} className="grid grid-cols-[44px_1fr] gap-4 rounded-[22px] border border-stone/10 bg-stone/6 p-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal/45 text-brass"><I size={18} /></span>
                    <div>
                      <p className="font-serif text-2xl text-stone">{title as string}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{text as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-[22px] border border-stone/10 bg-charcoal/34 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage">Opening note</p>
              <p className="mt-3 text-sm leading-6 text-muted">The reservations team can confirm inclusions, seasonal travel guidance, and arrival details before your stay.</p>
            </div>
          </StudioCard>
        </aside>

        <BookingFlow />
      </section>

      <FAQSection />
      <SubpageFooter />
    </main>
  );
}
