'use client';

import { useState, Suspense } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button, StudioCard, SectionEyebrow } from '@/components/ui';
import { BookingStatusTimeline } from '@/components/booking-status-timeline';
import { SubpageFooter } from '@/components/subpage';
import type { BookingRecord } from '@/lib/booking-types';

function StatusLookupForm() {
  const [refInput, setRefInput] = useState('');
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim()) return;

    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const ref = refInput.trim().toUpperCase();
      const res = await fetch(`/api/booking/${ref}`);
      if (!res.ok) throw new Error('Booking not found. Check your reference number.');
      const data = await res.json();
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-stone">
      <div className="border-b border-stone/12 bg-charcoal/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="/" className="font-serif text-xl text-stone">Balta Vista</a>
          <Button variant="ghost" size="sm" asChild>
            <a href="/booking">Book now</a>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-5xl leading-none text-stone md:text-7xl">Check Your Booking</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted">
            Enter your booking reference to see your current status, payment details, and timeline.
          </p>
        </div>

        {/* Search Form */}
        <StudioCard className="p-6 md:p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Booking Reference
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g., BV-XXXXXX"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value.toUpperCase())}
                  className="flex-1 rounded-[14px] p-4 text-lg font-mono tracking-widest uppercase"
                  autoFocus
                />
                <Button type="submit" disabled={loading || !refInput.trim()} size="lg">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  Search
                </Button>
              </div>
              {error && (
                <p className="mt-3 rounded-[12px] border border-brass/30 bg-brass/10 p-3 text-sm text-brass">{error}</p>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-[16px] border border-stone/10 bg-stone/6 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Don&apos;t have a reference?</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Your booking reference was shown after you submitted your inquiry and sent to your email. 
              If you lost it, contact us on WhatsApp with your name and dates.
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-3">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=${encodeURIComponent('Hi, I lost my booking reference. Can you help?')}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp us
              </a>
            </Button>
          </div>
        </StudioCard>

        {/* Booking Result */}
        {booking && (
          <div className="mt-10">
            <BookingStatusTimeline booking={booking} />

            {/* Actions */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['inquiry_received', 'payment_pending'].includes(booking.status) && (
                <Button asChild>
                  <a href={`/booking/confirmation?ref=${booking.reference}`}>Complete payment</a>
                </Button>
              )}
              <Button asChild variant="secondary">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=${encodeURIComponent(`Hi, I'm checking my booking (Reference: ${booking.reference}).`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ask a question
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!booking && !loading && !error && (
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-sm">
              <Search size={40} className="mx-auto text-stone/20" />
              <p className="mt-4 font-serif text-2xl text-stone/40">Enter a reference to begin</p>
            </div>
          </div>
        )}
      </div>

      <SubpageFooter />
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <Loader2 size={32} className="animate-spin text-brass" />
      </div>
    }>
      <StatusLookupForm />
    </Suspense>
  );
}
