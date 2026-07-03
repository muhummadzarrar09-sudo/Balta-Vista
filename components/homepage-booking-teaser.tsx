import Link from 'next/link';
import { CalendarDays, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button, SectionEyebrow, StudioCard } from '@/components/ui';

export function HomepageBookingTeaser() {
  return (
    <section id="booking" className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <StudioCard className="relative overflow-hidden p-6 md:p-10 lg:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brass/10 blur-3xl" />
        <div className="grid gap-10 md:grid-cols-[1fr_.9fr] md:items-center">
          <div>
            <SectionEyebrow>Reservations</SectionEyebrow>
            <h2 className="max-w-3xl font-serif text-5xl leading-[0.95] text-stone md:text-7xl">Ready to ask about opening-season dates?</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">The full inquiry flow now has its own quieter space. Choose dates, select a room tier, and let the reservations team confirm availability directly.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/booking">Start booking inquiry</Link></Button>
              <Button asChild variant="secondary" size="lg"><a href="https://wa.me/923001234567?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20Balta%20Vista%20Nathiagali%20bookings." target="_blank" rel="noreferrer">WhatsApp reservations</a></Button>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              [CalendarDays, 'Step-based inquiry', 'Dates, room tier, guest details, and confirmation stay focused on one dedicated page.'],
              [ShieldCheck, 'Direct confirmation', 'No noisy checkout screen — the reservations team replies with availability and next steps.'],
              [MessageCircle, 'WhatsApp continuation', 'Guests can continue the conversation with their reference once the inquiry is sent.']
            ].map(([Icon, title, text]) => { const I = Icon as typeof CalendarDays; return <div key={title as string} className="rounded-[24px] border border-stone/10 bg-stone/6 p-5"><I className="mb-4 h-5 w-5 text-brass"/><p className="font-serif text-2xl text-stone">{title as string}</p><p className="mt-2 text-sm leading-6 text-muted">{text as string}</p></div>; })}
          </div>
        </div>
      </StudioCard>
    </section>
  );
}
