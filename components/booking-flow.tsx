'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { BookingFormValues, BookingInput, bookingSchema } from '@/lib/booking-schema';
import { rooms } from '@/lib/site-data';
import { Button, StudioCard } from '@/components/ui';
import { cn } from '@/lib/utils';

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState<{ reference: string } | null>(null);
  const [serverError, setServerError] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const { register, handleSubmit, setValue, watch, trigger, formState: { errors, isSubmitting } } = useForm<BookingFormValues, unknown, BookingInput>({ resolver: zodResolver(bookingSchema), defaultValues: { room: 'double', guests: 2, arrivalWindow: 'unsure', message: '', companyWebsite: '' } });
  const selectedRoom = watch('room') || 'double';
  const selected = rooms.find((room) => room.id === selectedRoom) ?? rooms[1];
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000)) : 0;
  const estimate = nights * selected.rate;
  const fields: (keyof BookingFormValues)[][] = [['checkIn', 'checkOut'], ['room'], ['name', 'email', 'phone', 'guests', 'arrivalWindow'], []];
  const stepTitles = ['Dates', 'Room', 'Details', 'Confirm'];

  useEffect(() => {
    const roomParam = new URLSearchParams(window.location.search).get('room');
    if (roomParam === 'single' || roomParam === 'double' || roomParam === 'suite') {
      setValue('room', roomParam, { shouldValidate: true });
      setStep(1);
    }
  }, [setValue]);

  const next = async () => { if (await trigger(fields[step])) { setServerError(''); setStep((s) => Math.min(3, s + 1)); } };
  const onSubmit = async (data: BookingInput) => {
    setServerError('');
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) { setServerError(payload.error || 'Could not send inquiry. Please try WhatsApp.'); return; }
    setSent({ reference: payload.reference || 'PP-PREVIEW' });
  };

  if (sent) {
    return (
      <StudioCard className="p-8 text-center md:p-12">
        <p className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brass/15 text-brass"><Star fill="currentColor" /></p>
        <h2 className="font-serif text-5xl text-stone">Inquiry received.</h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-muted">Reference <span className="text-brass">{sent.reference}</span>. The reservations team will confirm availability and next steps directly.</p>
        <Button asChild className="mt-8"><a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567'}?text=${encodeURIComponent(`Hi, I submitted a Balta Vista booking inquiry. Reference: ${sent.reference}.`)}`} target="_blank" rel="noreferrer">Continue on WhatsApp</a></Button>
      </StudioCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-card border border-stone/12 bg-card-gradient p-5 shadow-soft md:p-8">
      <input className="hidden" tabIndex={-1} autoComplete="off" {...register('companyWebsite')} />
      <div className="mb-8 grid gap-3 md:grid-cols-4">
        {stepTitles.map((title, i) => <button type="button" key={title} onClick={() => i <= step ? setStep(i) : undefined} className={cn('rounded-2xl border border-stone/10 bg-stone/6 p-3 text-left transition', i === step && 'border-brass/50 bg-brass/12', i < step && 'text-brass')}><span className="block text-[10px] uppercase tracking-[0.22em] text-muted">Step {i + 1}</span><span className="mt-1 block font-serif text-xl">{title}</span></button>)}
      </div>

      <div className="min-h-[420px]">
        {step === 0 && <div><h2 className="mb-5 font-serif text-4xl text-stone">Select your dates.</h2><div className="grid gap-4 md:grid-cols-2"><label className="text-sm uppercase tracking-[0.16em] text-muted">Check-in<input min={today} type="date" className="mt-2 w-full rounded-2xl p-4 text-base normal-case tracking-normal" {...register('checkIn')}/><span className="mt-2 block text-sm normal-case tracking-normal text-brass">{errors.checkIn?.message}</span></label><label className="text-sm uppercase tracking-[0.16em] text-muted">Check-out<input min={checkIn || today} type="date" className="mt-2 w-full rounded-2xl p-4 text-base normal-case tracking-normal" {...register('checkOut')}/><span className="mt-2 block text-sm normal-case tracking-normal text-brass">{errors.checkOut?.message}</span></label></div></div>}
        {step === 1 && <div><h2 className="mb-5 font-serif text-4xl text-stone">Choose your room.</h2><div className="grid gap-4 md:grid-cols-3">{rooms.map((room) => <button type="button" key={room.id} onClick={() => setValue('room', room.id, { shouldValidate: true })} className={cn('rounded-[24px] border p-3 text-left transition', selectedRoom === room.id ? 'border-brass bg-brass/12' : 'border-stone/12 bg-stone/6 hover:border-stone/24')}><span className="relative mb-4 block aspect-[4/3] overflow-hidden rounded-2xl"><Image src={room.image} alt={room.name} fill quality={95} sizes="240px" className="object-cover" /></span><h3 className="font-serif text-2xl text-stone">{room.name}</h3><p className="mt-2 text-sm text-brass">{room.price}</p><p className="mt-3 text-sm leading-6 text-muted">{room.bestFor}</p></button>)}</div></div>}
        {step === 2 && <div><h2 className="mb-5 font-serif text-4xl text-stone">Guest details.</h2><div className="grid gap-4 md:grid-cols-2"><input placeholder="Full name" className="rounded-2xl p-4" {...register('name')}/><input placeholder="Email" className="rounded-2xl p-4" {...register('email')}/><input placeholder="Phone / WhatsApp" className="rounded-2xl p-4" {...register('phone')}/><input type="number" min={1} max={8} placeholder="Guests" className="rounded-2xl p-4" {...register('guests')}/><select className="rounded-2xl border border-stone/16 bg-stone/6 p-4 text-stone md:col-span-2" {...register('arrivalWindow')}><option value="unsure">Arrival window: not sure yet</option><option value="morning">Morning approach</option><option value="afternoon">Afternoon arrival</option><option value="evening">Evening arrival</option></select><textarea placeholder="Anything we should know?" className="min-h-32 rounded-2xl p-4 md:col-span-2" {...register('message')}/><p className="text-sm text-brass md:col-span-2">{errors.name?.message || errors.email?.message || errors.phone?.message || errors.guests?.message}</p></div></div>}
        {step === 3 && <div><h2 className="mb-5 font-serif text-4xl text-stone">Confirm inquiry.</h2><div className="grid gap-4 md:grid-cols-3"><div className="rounded-[22px] bg-stone/7 p-4"><p className="text-xs uppercase tracking-[0.18em] text-muted">Room</p><p className="mt-2 text-stone">{selected.name}</p></div><div className="rounded-[22px] bg-stone/7 p-4"><p className="text-xs uppercase tracking-[0.18em] text-muted">Dates</p><p className="mt-2 text-stone">{checkIn || '—'} → {checkOut || '—'}</p></div><div className="rounded-[22px] bg-stone/7 p-4"><p className="text-xs uppercase tracking-[0.18em] text-muted">Estimate</p><p className="mt-2 text-brass">{estimate ? `PKR ${estimate.toLocaleString('en-PK')}` : '—'}</p></div></div><p className="mt-5 rounded-2xl border border-brass/20 bg-brass/10 p-4 text-sm leading-6 text-muted">This sends a full-rate availability inquiry only. The reservations team confirms next steps directly.</p></div>}
      </div>

      {serverError && <p className="mt-4 rounded-2xl border border-brass/30 bg-brass/10 p-4 text-sm text-brass">{serverError}</p>}
      <div className="mt-8 flex justify-between gap-3"><Button type="button" variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))}>Back</Button>{step < 3 ? <Button type="button" onClick={next}>Continue</Button> : <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending' : 'Send inquiry'}</Button>}</div>
    </form>
  );
}
