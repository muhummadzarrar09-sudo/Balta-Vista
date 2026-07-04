'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Check, Star, Calendar, BedDouble, User, Send, Loader2 } from 'lucide-react';
import { BookingFormValues, BookingInput, bookingSchema } from '@/lib/booking-schema';
import { rooms } from '@/lib/site-data';
import { Button } from '@/components/ui';
import { CustomDatePicker } from '@/components/custom-date-picker';
import { cn } from '@/lib/utils';

// ─── Steps ───
const STEPS = [
  { id: 'dates',    icon: Calendar,   question: 'When are you thinking of visiting?',     hint: 'Pick your arrival and departure.' },
  { id: 'room',     icon: BedDouble,  question: 'Which room speaks to you?',               hint: 'Each tier suits a different kind of stay.' },
  { id: 'details',  icon: User,       question: 'Who should we expect?',                   hint: 'So the reservations desk can reach you.' },
  { id: 'review',   icon: Send,       question: 'Ready to send your inquiry?',             hint: 'No payment needed yet — just the details.' },
];

const formatDate = (d: string) => {
  if (!d) return '';
  const date = new Date(d + 'T12:00:00');
  return date.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const formatPrice = (n: number) => `PKR ${n.toLocaleString('en-PK')}`;

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [serverError, setServerError] = useState('');
  const [animKey, setAnimKey] = useState(0);
  const today = new Date().toISOString().slice(0, 10);
  
  const { register, handleSubmit, setValue, watch, trigger, formState: { errors, isSubmitting } } = useForm<BookingFormValues, unknown, BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { room: 'double', guests: 2, arrivalWindow: 'unsure', message: '', companyWebsite: '' }
  });

  const selectedRoom = watch('room') || 'double';
  const selected = rooms.find((r) => r.id === selectedRoom) ?? rooms[1];
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut + 'T12:00:00').getTime() - new Date(checkIn + 'T12:00:00').getTime()) / 86_400_000)) : 0;
  const estimate = nights * selected.rate;

  // URL param pre-fill for room
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const roomParam = new URLSearchParams(window.location.search).get('room');
      if (roomParam === 'single' || roomParam === 'double' || roomParam === 'suite') {
        setValue('room', roomParam, { shouldValidate: true });
      }
    }
  }, [setValue]);

  // ─── Navigation ───
  const goNext = async () => {
    const fieldsForStep: (keyof BookingFormValues)[][] = [
      ['checkIn', 'checkOut'],
      ['room'],
      ['name', 'email', 'phone', 'guests'],
      [],
    ];
    if (await trigger(fieldsForStep[step])) {
      setServerError('');
      setDirection('forward');
      setStep((s) => Math.min(3, s + 1));
      setAnimKey((k) => k + 1);
    }
  };

  const goBack = () => {
    setDirection('back');
    setStep((s) => Math.max(0, s - 1));
    setAnimKey((k) => k + 1);
  };

  const onSubmit = async (data: BookingInput) => {
    setServerError('');
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) { setServerError(payload.error || 'Could not send. Try WhatsApp.'); return; }
    window.location.href = `/booking/confirmation?ref=${payload.reference}`;
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!checkIn && !!checkOut && new Date(checkOut + 'T12:00:00') > new Date(checkIn + 'T12:00:00');
      case 1: return true;
      case 2: return true; // validation happens in goNext
      case 3: return true;
      default: return false;
    }
  };

  // Keyboard: Enter to advance
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && step < 3 && canProceed()) {
      e.preventDefault();
      goNext();
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="relative min-h-[520px] w-full" onKeyDown={handleKeyDown}>
      {/* Hidden honeypot */}
      <input className="hidden" tabIndex={-1} autoComplete="off" {...register('companyWebsite')} />

      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
        {/* ─── Progress Bar ─── */}
        <div className="mb-10 h-1 w-full overflow-hidden rounded-full bg-stone/10">
          <div
            className="h-full rounded-full bg-brass transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ─── Question Area ─── */}
        <div className="flex-1" key={animKey}>
          <div
            className={cn(
              'transition-all duration-400 ease-out',
              direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
            )}
          >
            {/* Step indicator */}
            <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-sage/70">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brass/15 text-[10px] text-brass">
                {String(step + 1).padStart(2, '0')}
              </span>
              <span>{STEPS[step].id}</span>
              <span className="text-stone/20">/</span>
              <span className="text-stone/30">0{STEPS.length}</span>
            </div>

            {/* Question */}
            <h2 className="mb-2 font-serif text-5xl leading-[1.05] tracking-tight text-stone md:text-6xl">
              {STEPS[step].question}
            </h2>
            <p className="mb-10 text-base leading-7 text-muted/70">{STEPS[step].hint}</p>

            {/* ─── STEP 0: Date Picker ─── */}
            {step === 0 && (
              <CustomDatePicker
                checkIn={checkIn || ''}
                checkOut={checkOut || ''}
                onCheckInChange={(v) => setValue('checkIn', v, { shouldValidate: true })}
                onCheckOutChange={(v) => setValue('checkOut', v, { shouldValidate: true })}
              />
            )}

            {/* ─── STEP 1: Room Selection ─── */}
            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-3">
                {rooms.map((room) => {
                  const isSelected = selectedRoom === room.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setValue('room', room.id, { shouldValidate: true })}
                      className={cn(
                        'group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300',
                        isSelected
                          ? 'border-brass/50 bg-brass/8 shadow-lg shadow-brass/5'
                          : 'border-stone/10 bg-stone/6 hover:border-stone/25 hover:bg-stone/8'
                      )}
                    >
                      {isSelected && (
                        <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-brass text-charcoal">
                          <Check size={14} />
                        </span>
                      )}
                      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                          src={room.image}
                          alt={room.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={cn('object-cover transition duration-500', isSelected ? 'scale-105' : 'group-hover:scale-102')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                        <p className="absolute bottom-3 left-3 rounded-full bg-charcoal/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brass backdrop-blur">
                          {room.price}
                        </p>
                      </div>
                      <h3 className="font-serif text-2xl text-stone">{room.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{room.bestFor}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ─── STEP 2: Guest Details ─── */}
            {step === 2 && (
              <div className="mx-auto max-w-lg space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Full name</p>
                    <input
                      placeholder="e.g. Ahmad Khan"
                      className="w-full rounded-2xl border border-stone/15 bg-stone/6 p-4 text-lg text-stone placeholder:text-stone/30 focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
                      {...register('name')}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-brass">{errors.name.message}</p>}
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Email</p>
                    <input
                      placeholder="ahmad@example.com"
                      className="w-full rounded-2xl border border-stone/15 bg-stone/6 p-4 text-lg text-stone placeholder:text-stone/30 focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
                      {...register('email')}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-brass">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Phone / WhatsApp</p>
                    <input
                      placeholder="03XX-XXXXXXX"
                      className="w-full rounded-2xl border border-stone/15 bg-stone/6 p-4 text-lg text-stone placeholder:text-stone/30 focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
                      {...register('phone')}
                    />
                    {errors.phone && <p className="mt-1.5 text-xs text-brass">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Guests</p>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      placeholder="2"
                      className="w-full rounded-2xl border border-stone/15 bg-stone/6 p-4 text-lg text-stone placeholder:text-stone/30 focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
                      {...register('guests', { valueAsNumber: true })}
                    />
                    {errors.guests && <p className="mt-1.5 text-xs text-brass">{errors.guests.message}</p>}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Arrival window</p>
                  <select
                    className="w-full rounded-2xl border border-stone/15 bg-stone/6 p-4 text-lg text-stone focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
                    {...register('arrivalWindow')}
                  >
                    <option value="unsure">Not sure yet — just inquiring</option>
                    <option value="morning">Morning — before noon</option>
                    <option value="afternoon">Afternoon — 12pm to 5pm</option>
                    <option value="evening">Evening — after 5pm</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Anything else? <span className="text-stone/40">(optional)</span></p>
                  <textarea
                    placeholder="Allergies, anniversary, special requests..."
                    className="min-h-24 w-full rounded-2xl border border-stone/15 bg-stone/6 p-4 text-lg text-stone placeholder:text-stone/30 focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
                    {...register('message')}
                  />
                </div>
              </div>
            )}

            {/* ─── STEP 3: Review ─── */}
            {step === 3 && (
              <div className="mx-auto max-w-lg space-y-5">
                <div className="rounded-3xl border border-brass/15 bg-brass/8 p-6">
                  <p className="font-serif text-4xl text-brass">{formatPrice(estimate)}</p>
                  <p className="mt-1 text-xs text-muted">{nights} night{nights !== 1 ? 's' : ''} · {selected.name}</p>
                </div>

                <div className="space-y-3">
                  <ReviewRow label="Check-in" value={formatDate(checkIn)} />
                  <ReviewRow label="Check-out" value={formatDate(checkOut)} />
                  <ReviewRow label="Room" value={selected.name} />
                  <ReviewRow label="Guests" value={String(watch('guests') || 2)} />
                  <ReviewRow label="Arrival" value={(watch('arrivalWindow') || 'unsure').replace('unsure', 'Not sure yet')} />
                  <ReviewRow label="Name" value={watch('name')} />
                  <ReviewRow label="Email" value={watch('email')} />
                  <ReviewRow label="Phone" value={watch('phone')} />
                </div>

                {serverError && (
                  <p className="rounded-2xl border border-brass/20 bg-brass/8 p-4 text-sm text-brass">{serverError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── Bottom Navigation ─── */}
        <div className="mt-10 flex items-center justify-between border-t border-stone/8 pt-6">
          <div>
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-muted transition hover:bg-stone/8 hover:text-stone"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed()}
                className={cn(
                  'flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition',
                  canProceed()
                    ? 'bg-brass text-charcoal hover:bg-amber-soft'
                    : 'bg-stone/8 text-stone/30 cursor-not-allowed'
                )}
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-full bg-brass px-8 py-3 text-sm font-semibold text-charcoal transition hover:bg-amber-soft disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Inquiry</>
                )}
              </button>
            )}
            {step < 3 && <span className="text-[11px] text-muted/40">press ↵</span>}
          </div>
        </div>
      </form>

      {/* ─── Global keyframes ─── */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-in-left { animation: slide-in-left 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}

// ─── Review Row ───
function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between rounded-2xl border border-stone/10 bg-stone/5 px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="font-serif text-xl text-stone">{value || '—'}</p>
    </div>
  );
}
