'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { Loader2, Check, X, Eye, RefreshCw, Phone, Mail, ShieldCheck, Clock, FileText, History, AlertTriangle, LogIn, Lock } from 'lucide-react';
import { Button, StudioCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { STATUS_LABELS, type BookingStatus, type BookingRecord } from '@/lib/booking-types';

function AdminDashboard() {
  const [key, setKey] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [logginIn, setLoggingIn] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [actionMsg, setActionMsg] = useState('');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/bookings', { headers: { 'Authorization': `Bearer ${key}` } });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBookings(data.bookings);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally { setLoading(false); }
  }, [key]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) throw new Error('Invalid admin key');
      setLoggedIn(true);
      fetchBookings();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally { setLoggingIn(false); }
  };

  const handleAction = async (reference: string, action: string, extra?: Record<string, string>) => {
    setActionMsg('');
    try {
      const res = await fetch(`/api/admin/bookings/${reference}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
      if (!res.ok) throw new Error('Action failed');
      const data = await res.json();
      setActionMsg(`${reference}: ${data.status}`);
      fetchBookings();
      setTimeout(() => setActionMsg(''), 4000);
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : 'Failed');
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const formatPrice = (amount: number) => `PKR ${amount.toLocaleString('en-PK')}`;

  const filteredBookings = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <StudioCard className="w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <Lock size={24} className="mx-auto text-brass" />
            <h1 className="mt-4 font-serif text-2xl text-stone">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-muted">Enter the admin key to manage bookings and verify payments.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full rounded-[14px] border border-stone/15 bg-stone/6 p-4 font-mono text-lg text-stone focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
              autoFocus
            />
            {loginError && <p className="flex items-center gap-2 text-sm text-brass"><AlertTriangle size={14} />{loginError}</p>}
            <Button type="submit" className="w-full" disabled={!key || logginIn}>
              {logginIn ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <><LogIn size={16} /> Sign in</>}
            </Button>
          </form>
          <p className="mt-6 text-center text-[11px] text-muted">Session lasts 6 hours. Set ADMIN_KEY in your environment.</p>
        </StudioCard>
      </div>
    );
  }

  const statusBadge = (status: BookingStatus) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-brass/15 text-brass', checked_in: 'bg-brass/15 text-brass',
      checked_out: 'bg-sage/15 text-sage', cancelled: 'bg-red/8 text-red',
      expired: 'bg-red/8 text-red/70', payment_submitted: 'bg-amber-soft/15 text-amber-soft',
      payment_verifying: 'bg-amber-soft/15 text-amber-soft', inquiry_received: 'bg-stone/10 text-stone/50',
      payment_pending: 'bg-stone/10 text-stone/60',
    };
    return (
      <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]', styles[status] || 'bg-stone/10 text-stone/50')}>
        {STATUS_LABELS[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-charcoal text-stone">
      <div className="sticky top-0 z-30 border-b border-stone/12 bg-charcoal/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <div>
            <h1 className="font-serif text-xl text-stone">Balta Vista — Admin</h1>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Payment Verification & Booking Management</p>
          </div>
          <div className="flex items-center gap-3">
            {actionMsg && <span className="animate-pulse text-xs text-brass">{actionMsg}</span>}
            <Button variant="ghost" size="sm" onClick={fetchBookings} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
            {[
              ['Total', stats.total, ''],
              ['Awaiting Payment', stats.pendingPayment, 'text-amber-soft'],
              ['Payment Submitted', stats.paymentSubmitted, 'text-amber-soft'],
              ['Being Verified', stats.paymentVerifying, 'text-amber-soft'],
              ['Confirmed', stats.confirmed, 'text-brass'],
              ['Active Stays', stats.active, 'text-brass'],
              ['Completed', stats.completed, 'text-sage'],
              ['Cancelled', stats.cancelled, ''],
              ['Expired', stats.expired, 'text-red/70'],
              ['Revenue', formatPrice(stats.totalRevenue), 'text-brass font-serif'],
            ].map(([label, value, color]) => (
              <StudioCard key={label as string} className="p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label as string}</p>
                <p className={cn('mt-2 text-2xl font-bold', color as string)}>{value as string}</p>
              </StudioCard>
            ))}
          </div>
        )}

        {stats?.expiringSoon > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-[18px] border border-brass/25 bg-brass/8 p-4">
            <Clock size={18} className="shrink-0 text-brass" />
            <p className="text-sm text-stone"><strong>{stats.expiringSoon} booking{stats.expiringSoon > 1 ? 's' : ''}</strong> expiring within 6 hours</p>
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', 'inquiry_received', 'payment_pending', 'payment_submitted', 'payment_verifying', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'expired'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f as BookingStatus | 'all')}
              className={cn('rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition', filter === f ? 'bg-brass text-charcoal' : 'bg-stone/8 text-muted hover:bg-stone/15')}
            >{f === 'all' ? 'All' : STATUS_LABELS[f as BookingStatus]}</button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brass" /></div>}
        {!loading && filteredBookings.length === 0 && (
          <div className="py-20 text-center"><p className="font-serif text-2xl text-stone/40">No bookings found</p></div>
        )}

        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <StudioCard key={booking.reference} className={cn('overflow-hidden transition', booking.status === 'payment_submitted' && 'ring-1 ring-amber-soft/30', booking.status === 'confirmed' && 'ring-1 ring-brass/20')}>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm text-brass">{booking.reference}</span>
                      {statusBadge(booking.status)}
                      {booking.status === 'payment_submitted' && <span className="animate-pulse text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-soft">NEW</span>}
                    </div>
                    <p className="mt-2 font-serif text-2xl text-stone">{booking.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl text-brass">{formatPrice(booking.estimatedTotal)}</p>
                    <p className="text-[10px] text-muted">{booking.estimatedNights} night{booking.estimatedNights > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                  <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Room</p><p className="mt-1 text-stone">{booking.roomName}</p></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Dates</p><p className="mt-1 text-stone/80">{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</p></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Contact</p><div className="mt-1 space-y-1"><a href={`tel:${booking.phone}`} className="flex items-center gap-1 text-stone/80 hover:text-brass text-xs"><Phone size={12} />{booking.phone}</a><a href={`mailto:${booking.email}`} className="flex items-center gap-1 text-stone/80 hover:text-brass text-xs"><Mail size={12} />{booking.email}</a></div></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Guests</p><p className="mt-1 text-stone">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p></div>
                </div>

                {booking.payment && (
                  <div className="mt-4 rounded-[16px] border border-brass/15 bg-brass/8 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sage">Payment Details</p>
                      {booking.payment.webhookConfirmed && <span className="flex items-center gap-1 text-[10px] font-semibold text-sage"><ShieldCheck size={10} /> Webhook Verified</span>}
                    </div>
                    <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                      <p><span className="text-muted">Method:</span> {booking.payment.methodName}</p>
                      <p className="md:col-span-2"><span className="text-muted">Transaction:</span> <span className="font-mono text-brass">{booking.payment.transactionId}</span></p>
                      {booking.payment.submittedAt && <p><span className="text-muted">Submitted:</span> {formatDateTime(booking.payment.submittedAt)}</p>}
                    </div>
                    {booking.payment.receipt && (
                      <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-stone/10 bg-charcoal/30 p-3">
                        <FileText size={16} className="text-brass shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-stone truncate">{booking.payment.receipt.originalName}</p>
                          <p className="text-[10px] text-muted">{(booking.payment.receipt.sizeBytes / 1024).toFixed(0)}KB</p>
                        </div>
                        <button type="button" onClick={async () => {
                          if (!booking.payment?.receipt?.filename) return;
                          const res = await fetch('/api/admin/receipt-token', { method: 'POST', headers: { 'Authorization': `Bearer ${key}`, 'content-type': 'application/json' }, body: JSON.stringify({ filename: booking.payment.receipt.filename }) });
                          if (res.ok) { const { url } = await res.json(); window.open(url, '_blank'); }
                        }} className="flex items-center gap-1.5 rounded-full border border-brass/20 px-3 py-1.5 text-[10px] font-semibold text-brass hover:bg-brass/10"><Eye size={12} /> View</button>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-stone/10 pt-4">
                  {booking.status === 'payment_submitted' && (
                    <><Button size="sm" onClick={() => handleAction(booking.reference, 'status', { status: 'payment_verifying' })}><ShieldCheck size={14} /> Start Verification</Button><span className="text-[10px] text-amber-soft animate-pulse">⚠️ Action needed</span></>
                  )}
                  {booking.status === 'payment_verifying' && (
                    <><Button size="sm" onClick={() => handleAction(booking.reference, 'confirm', { confirmedBy: 'Admin' })}><Check size={14} /> ✓ Confirm Booking</Button><Button size="sm" variant="secondary" onClick={() => handleAction(booking.reference, 'status', { status: 'payment_pending' })}><X size={14} /> Reject</Button></>
                  )}
                  {booking.status === 'payment_pending' && (
                    <Button size="sm" variant="secondary" onClick={() => handleAction(booking.reference, 'status', { status: 'payment_submitted' })}>Guest Paid (Manual)</Button>
                  )}
                  {booking.status === 'confirmed' && <Button size="sm" variant="secondary" onClick={() => handleAction(booking.reference, 'status', { status: 'checked_in' })}>Check In</Button>}
                  {booking.status === 'checked_in' && <Button size="sm" variant="secondary" onClick={() => handleAction(booking.reference, 'status', { status: 'checked_out' })}>Check Out</Button>}
                  {!['checked_out', 'cancelled', 'expired'].includes(booking.status) && <Button size="sm" variant="ghost" onClick={() => handleAction(booking.reference, 'status', { status: 'cancelled' })}><X size={14} /> Cancel</Button>}
                  <Button size="sm" variant="ghost" className="ml-auto" asChild><a href={`/booking/confirmation?ref=${booking.reference}`} target="_blank"><Eye size={14} /> Guest View</a></Button>
                  <Button size="sm" variant="ghost" onClick={() => setExpandedBooking(expandedBooking === booking.reference ? null : booking.reference)}><History size={14} />{expandedBooking === booking.reference ? 'Hide Log' : 'Audit Log'}</Button>
                </div>

                {expandedBooking === booking.reference && (
                  <div className="mt-4 border-t border-stone/10 pt-4">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Audit Trail</p>
                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {[...booking.auditLog].reverse().map((entry, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-[12px] bg-stone/6 p-3">
                          <div className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', entry.performedBy === 'system' ? 'bg-sage' : entry.performedBy === 'admin' ? 'bg-brass' : 'bg-stone/40')} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{entry.performedBy}</span><span className="text-[10px] text-muted">{formatDateTime(entry.timestamp)}</span></div>
                            <p className="mt-1 text-xs text-stone/80">{entry.notes || entry.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </StudioCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-charcoal"><Loader2 size={32} className="animate-spin text-brass" /></div>}>
      <AdminDashboard />
    </Suspense>
  );
}
