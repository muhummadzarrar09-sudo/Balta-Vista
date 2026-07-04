import type { Metadata } from 'next';
import { BookingFlow } from '@/components/booking-flow';
import { FAQSection } from '@/components/faq-section';
import { SubpageFooter } from '@/components/subpage';
import { hotelBaseSchema, jsonLd, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Booking Inquiry — Balta Vista',
  description: 'Send a full-rate opening-season booking inquiry for Balta Vista Nathiagali.',
  alternates: { canonical: '/booking' }
};

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

      {/* Minimal header */}
      <div className="border-b border-stone/8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
          <a href="/" className="font-serif text-lg text-stone">Balta Vista</a>
          <a
            href="/"
            className="rounded-full border border-stone/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted transition hover:border-stone/25 hover:text-stone"
          >
            Exit
          </a>
        </div>
      </div>

      {/* ─── Typeform Booking Flow ─── */}
      <section className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <BookingFlow />
      </section>

      {/* Trust note */}
      <div className="mx-auto max-w-lg px-5 pb-6 text-center md:px-8">
        <p className="text-[11px] text-muted/50 leading-6">
          No payment needed to inquire. The reservations team confirms availability and next steps directly.
        </p>
      </div>

      <FAQSection />
      <SubpageFooter />
    </main>
  );
}
