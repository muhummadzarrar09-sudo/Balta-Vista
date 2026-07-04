'use client';

import { Check, Clock, CreditCard, CalendarCheck, DoorOpen, DoorClosed, XCircle } from 'lucide-react';
import type { BookingStatus, BookingRecord } from '@/lib/booking-types';
import { STATUS_LABELS, STATUS_FLOW, getStatusIndex } from '@/lib/booking-types';
import { cn } from '@/lib/utils';
import { StudioCard, SectionEyebrow } from '@/components/ui';

interface StatusTimelineProps {
  booking: {
    status: BookingStatus;
    reference: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    estimatedNights: number;
    estimatedTotal: number;
    name: string;
    guests: number;
    createdAt: string;
    payment?: {
      methodName?: string;
      submittedAt?: string;
      confirmedAt?: string;
    };
  };
}

const statusIcons: Record<string, typeof Clock> = {
  inquiry_received: Clock,
  payment_pending: CreditCard,
  payment_submitted: CreditCard,
  confirmed: CalendarCheck,
  checked_in: DoorOpen,
  checked_out: DoorClosed,
  cancelled: XCircle,
};

export function BookingStatusTimeline({ booking }: StatusTimelineProps) {
  const currentIndex = getStatusIndex(booking.status);
  const isCancelled = booking.status === 'cancelled';
  const displayFlow = isCancelled ? STATUS_FLOW.slice(0, currentIndex) : STATUS_FLOW;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (amount: number) => `PKR ${amount.toLocaleString('en-PK')}`;

  return (
    <div className="space-y-6">
      {/* Booking Summary Card */}
      <StudioCard className="p-6">
        <SectionEyebrow>Booking Summary</SectionEyebrow>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Reference</p>
            <p className="mt-1 font-mono text-lg text-brass">{booking.reference}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Status</p>
            <span className={cn(
              'mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]',
              isCancelled ? 'bg-red/10 text-red' :
              booking.status === 'confirmed' || booking.status === 'checked_in' ? 'bg-brass/12 text-brass' :
              booking.status === 'checked_out' ? 'bg-sage/12 text-sage' :
              booking.status === 'payment_submitted' ? 'bg-amber-soft/12 text-amber-soft' :
              'bg-stone/10 text-stone/60'
            )}>
              {STATUS_LABELS[booking.status]}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Guest</p>
            <p className="mt-1 font-serif text-xl text-stone">{booking.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Room</p>
            <p className="mt-1 font-serif text-xl text-stone">{booking.roomName}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Dates</p>
            <p className="mt-1 text-sm text-stone/80">{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Guests</p>
            <p className="mt-1 font-serif text-xl text-stone">{booking.guests}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mt-6 rounded-[18px] border border-brass/20 bg-brass/10 p-5">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">{booking.estimatedNights} night{booking.estimatedNights > 1 ? 's' : ''}</p>
              <p className="mt-1 text-2xl font-serif text-stone">{formatPrice(booking.estimatedTotal)}</p>
            </div>
            <p className="text-xs text-muted">{formatPrice(booking.estimatedTotal / booking.estimatedNights)}/night</p>
          </div>
        </div>

        {/* Payment info if available */}
        {booking.payment?.methodName && (
          <div className="mt-4 rounded-[16px] border border-stone/12 bg-stone/6 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Payment Method</p>
            <p className="mt-1 font-serif text-lg text-stone">{booking.payment.methodName}</p>
            {booking.payment.submittedAt && (
              <p className="mt-1 text-xs text-muted">Submitted {formatDate(booking.payment.submittedAt)}</p>
            )}
            {booking.payment.confirmedAt && (
              <p className="mt-1 text-xs text-brass">Confirmed {formatDate(booking.payment.confirmedAt)}</p>
            )}
          </div>
        )}
      </StudioCard>

      {/* Status Timeline */}
      <StudioCard className="p-6">
        <SectionEyebrow>Booking Timeline</SectionEyebrow>
        <div className="mt-6">
          {displayFlow.map((status, index) => {
            const Icon = statusIcons[status] || Clock;
            const isComplete = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={status} className="relative flex gap-5 pb-8 last:pb-0">
                {/* Timeline line */}
                {index < displayFlow.length - 1 && (
                  <div className={cn(
                    'absolute left-[17px] top-10 h-full w-px',
                    isComplete ? 'bg-brass/30' : 'bg-stone/8'
                  )} />
                )}

                {/* Status icon */}
                <div className={cn(
                  'relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full',
                  isCurrent ? 'bg-brass text-charcoal ring-4 ring-brass/20' :
                  isComplete ? 'bg-brass/15 text-brass' :
                  'bg-stone/6 text-stone/30'
                )}>
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="min-w-0 pt-1">
                  <p className={cn(
                    'font-serif text-lg',
                    isCurrent ? 'text-brass' : isComplete ? 'text-stone' : 'text-stone/35'
                  )}>
                    {STATUS_LABELS[status as BookingStatus]}
                  </p>
                  <p className={cn(
                    'mt-1 text-xs',
                    isCurrent && status === 'payment_pending' ? 'text-amber-soft' :
                    isComplete ? 'text-muted' : 'text-stone/20'
                  )}>
                    {status === 'inquiry_received' && 'Your inquiry has been received. The team will review it shortly.'}
                    {status === 'payment_pending' && 'Choose a payment method and send the deposit to confirm your dates.'}
                    {status === 'payment_submitted' && 'Payment received! The team will verify and confirm your booking.'}
                    {status === 'confirmed' && 'Your booking is confirmed. We look forward to hosting you.'}
                    {status === 'checked_in' && 'Welcome to Balta Vista. Enjoy your stay in the hills.'}
                    {status === 'checked_out' && 'Thank you for staying with us. We hope to welcome you again.'}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Cancelled state */}
          {isCancelled && (
            <div className="relative flex gap-5 pt-4">
              <div className="relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-red/15 text-red">
                <XCircle size={16} />
              </div>
              <div className="min-w-0 pt-1">
                <p className="font-serif text-lg text-red">{STATUS_LABELS.cancelled}</p>
                <p className="mt-1 text-xs text-muted">This booking has been cancelled.</p>
              </div>
            </div>
          )}
        </div>
      </StudioCard>
    </div>
  );
}
