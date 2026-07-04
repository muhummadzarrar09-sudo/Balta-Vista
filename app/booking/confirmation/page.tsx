'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, ArrowLeft, Loader2, ShieldCheck, AlertTriangle, Clock, FileText, Copy, ExternalLink } from 'lucide-react';
import { Button, StudioCard, SectionEyebrow } from '@/components/ui';
import { PaymentMethods } from '@/components/payment-methods';
import { BookingStatusTimeline } from '@/components/booking-status-timeline';
import { SubpageFooter } from '@/components/subpage';
import type { BookingStatus, PaymentMethodId, BookingRecord } from '@/lib/booking-types';
import { cn } from '@/lib/utils';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('ref');

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!reference) {
      setError('No booking reference provided.');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/booking/${reference}`);
        if (!res.ok) throw new Error('Booking not found');
        const data = await res.json();
        setBooking(data);
      } catch {
        setError('Could not load booking details. Please check your reference.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
    // Refresh every 30 seconds if waiting for verification
    const interval = setInterval(() => {
      const statusEl = document.getElementById('booking-status');
      if (statusEl?.dataset.autoRefresh === 'true') {
        fetch(`/api/booking/${reference}`).then(r => r.json()).then(data => {
          if (data.status !== booking?.status) setBooking(data);
        }).catch(() => {});
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [reference]);

  const handlePaymentSubmit = async (
    methodId: PaymentMethodId,
    methodName: string,
    transactionId: string,
    notes: string,
    receiptFile?: File
  ) => {
    if (!reference) return;
    setPaymentSubmitting(true);
    setPaymentError('');

    try {
      // Use FormData for multipart upload (receipt file + metadata)
      if (receiptFile) {
        const formData = new FormData();
        formData.append('receipt', receiptFile);
        formData.append('methodId', methodId);
        formData.append('methodName', methodName);
        formData.append('transactionId', transactionId);
        formData.append('notes', notes);

        const res = await fetch(`/api/booking/${reference}/receipt`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit payment');
      } else {
        // Fallback to JSON-only (no receipt — shouldn't happen with new UI)
        const res = await fetch(`/api/booking/${reference}/payment`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ methodId, methodName, transactionId, notes }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit payment');
      }

      setPaymentDone(true);

      // Refresh booking data
      const refreshRes = await fetch(`/api/booking/${reference}`);
      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setBooking(refreshed);
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const copyReference = () => {
    if (!reference) return;
    navigator.clipboard.writeText(reference);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-PK', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-brass" />
          <p className="mt-4 text-sm text-muted">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <StudioCard className="mx-auto max-w-lg p-8 text-center">
          <p className="text-4xl">🔍</p>
          <h1 className="mt-4 font-serif text-3xl text-stone">Booking not found</h1>
          <p className="mt-3 leading-7 text-muted">{error}</p>
          <Button asChild className="mt-6">
            <a href="/booking">Make a new inquiry</a>
          </Button>
        </StudioCard>
      </div>
    );
  }

  if (!booking) return null;

  const showPayment = ['inquiry_received', 'payment_pending'].includes(booking.status);
  const waitingVerification = booking.status === 'payment_submitted' || booking.status === 'payment_verifying';
  const isConfirmed = ['confirmed', 'checked_in', 'checked_out'].includes(booking.status);
  const isExpired = booking.status === 'expired';
  const isCancelled = booking.status === 'cancelled';

  const expiresAt = new Date(booking.expiresAt);
  const hoursLeft = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)));

  return (
    <main className="min-h-screen bg-charcoal text-stone">
      {/* Header */}
      <div className="border-b border-stone/12 bg-charcoal/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="/" className="font-serif text-xl text-stone">Balta Vista</a>
          <Button variant="ghost" size="sm" asChild>
            <a href="/booking">New inquiry</a>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        {/* Hero Status Banner */}
        <div className="mb-12 text-center">
          {isConfirmed ? (
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brass/15 text-brass">
              <Check size={28} />
            </span>
          ) : waitingVerification ? (
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-soft/15 text-amber-soft">
              <Loader2 size={28} className="animate-spin" />
            </span>
          ) : showPayment ? (
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brass/15 text-brass">
              <ShieldCheck size={28} />
            </span>
          ) : (
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-stone/10 text-stone/40">
              <AlertTriangle size={28} />
            </span>
          )}

          <h1 className="font-serif text-5xl leading-none text-stone md:text-7xl">
            {isConfirmed && 'Booking Confirmed ✓'}
            {waitingVerification && 'Payment Submitted — Being Verified'}
            {showPayment && !paymentDone && 'Complete Your Payment'}
            {isExpired && 'Payment Window Closed'}
            {isCancelled && 'Booking Cancelled'}
            {paymentDone && 'Payment Proof Received!'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted">
            {isConfirmed && 'Your booking is fully confirmed. We look forward to welcoming you to Balta Vista.'}
            {waitingVerification && 'Your receipt is being reviewed by the team. You will receive a confirmation within 24 hours.'}
            {showPayment && !paymentDone && `Choose a payment method and upload your receipt. Your booking is held until ${formatDate(booking.expiresAt)}.`}
            {isExpired && 'The payment window for this booking has closed. Please make a new inquiry.'}
            {isCancelled && 'This booking has been cancelled.'}
            {paymentDone && 'Your receipt has been received. The team will verify and confirm your booking shortly.'}
          </p>

          {/* Payment urgency banner */}
          {showPayment && !paymentDone && (
            <div className={cn(
              'mx-auto mt-6 flex max-w-lg items-center justify-center gap-3 rounded-full px-6 py-3 text-sm',
              hoursLeft < 6 ? 'bg-brass/10 text-brass' : 'bg-stone/8 text-muted'
            )}>
              <Clock size={16} />
              <span>
                {hoursLeft < 6 
                  ? `⚠️ Payment due within ${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} — booking will expire`
                  : `Booking held for ${hoursLeft} hours`
                }
              </span>
            </div>
          )}
        </div>

        {/* QR Code / Reference reminder for payment */}
        {(showPayment || waitingVerification) && (
          <StudioCard className="mb-10 border-brass/15 bg-brass/6 p-5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sage">Your Booking Reference</p>
            <button onClick={copyReference} className="group mt-2 flex items-center justify-center gap-3">
              <span className="font-mono text-3xl tracking-widest text-brass">{booking.reference}</span>
              <span className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition',
                copySuccess ? 'bg-brass text-charcoal' : 'bg-charcoal/45 text-brass group-hover:bg-brass/20'
              )}>
                {copySuccess ? <Check size={14} /> : <Copy size={14} />}
              </span>
            </button>
            <p className="mt-3 text-sm text-muted">
              Include this reference in your transfer note. 
              {waitingVerification && ' Our team is cross-verifying it now.'}
            </p>
          </StudioCard>
        )}

        {/* Status Timeline */}
        <div id="booking-status" data-auto-refresh={waitingVerification ? 'true' : 'false'}>
          <BookingStatusTimeline booking={booking} />
        </div>

        {/* Payment Section */}
        {showPayment && !paymentDone && (
          <div className="mt-12">
            <div className="mb-8 text-center">
              <SectionEyebrow>Secure Your Booking</SectionEyebrow>
              <h2 className="font-serif text-4xl text-stone md:text-5xl">Choose a payment method</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
                Select a mobile wallet or bank transfer. You must upload a receipt to verify your payment.
              </p>
            </div>

            <PaymentMethods
              bookingReference={booking.reference}
              estimatedTotal={booking.estimatedTotal}
              onPaymentSubmit={handlePaymentSubmit}
              isSubmitting={paymentSubmitting}
              submitError={paymentError}
            />
          </div>
        )}

        {/* Post-payment success */}
        {paymentDone && (
          <StudioCard className="mt-8 border-brass/20 bg-brass/8 p-8 text-center">
            <Check size={32} className="mx-auto text-brass" />
            <h3 className="mt-4 font-serif text-3xl text-stone">Receipt Received ✓</h3>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">
              Your receipt and transaction details have been submitted. The Balta Vista team will verify your payment 
              and confirm your booking. This usually takes less than 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="secondary">
                <a href={`/booking/status?ref=${booking.reference}`}>Check verification status</a>
              </Button>
              <Button asChild>
                <a href="/">Return home</a>
              </Button>
            </div>
          </StudioCard>
        )}

        {/* Expired / Cancelled state */}
        {(isExpired || isCancelled) && (
          <div className="mt-8 text-center">
            <Button asChild>
              <a href="/booking">Make a new booking inquiry</a>
            </Button>
          </div>
        )}

        {/* WhatsApp */}
        {!isExpired && !isCancelled && (
          <div className="mt-12 text-center border-t border-stone/10 pt-8">
            <p className="text-sm text-muted">
              {waitingVerification ? 'Need to follow up on your verification?' : 'Questions about payment?'}
            </p>
            <Button asChild variant="ghost" className="mt-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=${encodeURIComponent(
                  waitingVerification
                    ? `Hi, I submitted payment proof for booking ${booking.reference}. Can you confirm receipt?`
                    : `Hi, I have a question about my booking (Reference: ${booking.reference}).`
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Contact us on WhatsApp
              </a>
            </Button>
          </div>
        )}
      </div>

      <SubpageFooter />
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <Loader2 size={32} className="animate-spin text-brass" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
