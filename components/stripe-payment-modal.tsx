'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, Copy, ArrowRight, Upload, X, FileText, AlertTriangle, ShieldCheck, Loader2, Eye, CreditCard, Building, Smartphone, ChevronRight, Lock, Banknote, Clock } from 'lucide-react';
import { paymentMethods, walletMethods, bankMethods, type PaymentMethodId } from '@/lib/payment-methods';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// ─── Props ───
interface StripePaymentModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Booking reference */
  bookingReference: string;
  /** Room name */
  roomName: string;
  /** Check-in date */
  checkIn: string;
  /** Check-out date */
  checkOut: string;
  /** Number of nights */
  nights: number;
  /** Estimated total in PKR */
  estimatedTotal: number;
  /** Submit handler */
  onPaymentSubmit: (methodId: PaymentMethodId, methodName: string, transactionId: string, notes: string, receiptFile?: File) => Promise<void>;
  /** Whether submission is in progress */
  isSubmitting: boolean;
  /** Error from submission */
  submitError: string;
}

// ─── Icons by method type ───
const methodIcon = (id: string, icon: string) => {
  if (id === 'easypaisa') return <span className="text-lg font-black tracking-tight">EP</span>;
  if (id === 'jazzcash') return <span className="text-lg font-black tracking-tight">JC</span>;
  return <span className="text-sm font-bold">{icon}</span>;
};

// ─── Main Component ───
export function StripePaymentModal({
  isOpen,
  onClose,
  bookingReference,
  roomName,
  checkIn,
  checkOut,
  nights,
  estimatedTotal,
  onPaymentSubmit,
  isSubmitting,
  submitError,
}: StripePaymentModalProps) {
  const [step, setStep] = useState<'method' | 'details'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState('');
  const [amountAgreed, setAmountAgreed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('method');
      setSelectedMethod(null);
      setTransactionId('');
      setNotes('');
      setReceiptFile(null);
      setReceiptPreview(null);
      setReceiptError('');
      setAmountAgreed(false);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const method = selectedMethod ? paymentMethods.find((m) => m.id === selectedMethod) : null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptError('');
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) { setReceiptError('Invalid file type. Use PNG, JPEG, WebP, or PDF.'); return; }
    if (file.size > 5 * 1024 * 1024) { setReceiptError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 5MB.`); return; }
    setReceiptFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setReceiptPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else { setReceiptPreview(null); }
  };

  const clearReceipt = () => {
    setReceiptFile(null); setReceiptPreview(null); setReceiptError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatPrice = (amount: number) => `PKR ${amount.toLocaleString('en-PK')}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

  const isDetailsValid = selectedMethod && transactionId.trim().length >= 3 && receiptFile && amountAgreed;

  const handleSubmit = async () => {
    if (!method) return;
    await onPaymentSubmit(method.id, method.name, transactionId, notes, receiptFile || undefined);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/85 backdrop-blur-sm md:items-center"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Modal */}
        <div
          ref={modalRef}
          className="relative flex w-full max-w-[820px] flex-col overflow-hidden rounded-t-3xl border border-stone/15 bg-charcoal shadow-2xl shadow-black/50 md:max-h-[90vh] md:rounded-3xl"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone/10 text-stone/50 transition hover:bg-stone/20 hover:text-stone md:right-4 md:top-4"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Header bar */}
          <div className="flex items-center gap-3 border-b border-stone/10 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brass/15 text-brass">
              <Lock size={14} />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone">Secure Payment</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Balta Vista Nathiagali</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-[10px] text-sage md:inline">🔒 Encrypted</span>
              <span className="rounded-full bg-brass/10 px-3 py-1 text-[10px] font-semibold text-brass">TEST MODE</span>
            </div>
          </div>

          {/* Body — Two column on desktop */}
          <div className="flex flex-1 flex-col overflow-y-auto md:flex-row">
            {/* ─── LEFT COLUMN: Summary ─── */}
            <div className="border-stone/10 bg-stone/4 p-6 md:w-[300px] md:border-r md:shrink-0">
              <div className="space-y-4">
                {/* Total */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Total</p>
                  <p className="mt-1 font-serif text-4xl tracking-tight text-brass">{formatPrice(estimatedTotal)}</p>
                </div>

                {/* Booking details */}
                <div className="space-y-3 rounded-[16px] border border-stone/10 bg-charcoal/50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-serif text-lg text-stone">{roomName}</p>
                      <p className="mt-1 text-xs text-muted">{nights} night{nights > 1 ? 's' : ''}</p>
                    </div>
                    <p className="text-sm font-semibold text-stone">{formatPrice(estimatedTotal)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <CalendarIcon />
                    <span>{formatDate(checkIn)} <span className="text-brass/60">→</span> {formatDate(checkOut)}</span>
                  </div>
                </div>

                {/* Reference */}
                <div className="rounded-[14px] border border-brass/15 bg-brass/6 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sage">Reference</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-sm tracking-widest text-brass">{bookingReference}</span>
                    <button
                      onClick={() => copyToClipboard(bookingReference, 'ref')}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal/30 text-brass transition hover:bg-brass/20"
                    >
                      {copied === 'ref' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="space-y-2">
                  <TrustBadge icon={<Lock size={12} />} text="256-bit encrypted connection" />
                  <TrustBadge icon={<ShieldCheck size={12} />} text="Receipt verified by admin team" />
                  <TrustBadge icon={<Clock size={12} />} text="Booking held for 24 hours" />
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Payment Form ─── */}
            <div className="flex-1 p-6 md:overflow-y-auto">
              {/* STEP 1: Choose Method */}
              {step === 'method' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-stone">Choose payment method</h2>
                    <p className="mt-1 text-sm text-muted">Select how you'd like to pay for your stay.</p>
                  </div>

                  {/* Wallets */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">Mobile Wallets</p>
                    <div className="space-y-2">
                      {walletMethods.map((m) => (
                        <MethodCard
                          key={m.id}
                          icon={methodIcon(m.id, m.icon)}
                          name={m.name}
                          subtitle={m.details.phoneNumber}
                          secondary="Instant · No bank needed"
                          selected={selectedMethod === m.id}
                          onClick={() => { setSelectedMethod(m.id); setStep('details'); }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Banks */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">Bank Transfer</p>
                    <div className="space-y-2">
                      {bankMethods.map((m) => (
                        <MethodCard
                          key={m.id}
                          icon={methodIcon(m.id, m.icon)}
                          name={m.name}
                          subtitle={m.details.accountNumber ? `A/C ${m.details.accountNumber}` : ''}
                          secondary={m.details.iban?.substring(0, 15) + '...' || ''}
                          selected={selectedMethod === m.id}
                          onClick={() => { setSelectedMethod(m.id); setStep('details'); }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Payment Details + Upload */}
              {step === 'details' && method && (
                <div className="space-y-5">
                  {/* Back */}
                  <button
                    onClick={() => setStep('method')}
                    className="flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-muted transition hover:text-stone"
                  >
                    <ChevronRight size={14} className="rotate-180" /> Back to methods
                  </button>

                  <div>
                    <h2 className="font-serif text-2xl text-stone">{method.name}</h2>
                    <p className="mt-1 text-sm text-muted">Send the exact amount and upload your receipt.</p>
                  </div>

                  {/* Amount */}
                  <div className="rounded-[16px] border-2 border-brass/20 bg-brass/8 p-5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">Send exactly</p>
                    <p className="mt-1 font-serif text-4xl tracking-tight text-brass">{formatPrice(estimatedTotal)}</p>
                  </div>

                  {/* Account details */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Deposit to</p>
                    {method.type === 'wallet' ? (
                      <>
                        <CopyRow label="Account Title" value={method.details.accountTitle || 'Balta Vista Nathiagali'} onCopy={() => copyToClipboard(method.details.accountTitle || '', 'title')} copied={copied === 'title'} />
                        <CopyRow label="Phone Number" value={method.details.phoneNumber || ''} onCopy={() => copyToClipboard(method.details.phoneNumber || '', 'phone')} copied={copied === 'phone'} />
                      </>
                    ) : (
                      <>
                        <CopyRow label="Account Title" value={method.details.accountTitle || 'Balta Vista Nathiagali'} onCopy={() => copyToClipboard(method.details.accountTitle || '', 'title')} copied={copied === 'title'} />
                        {method.details.iban && <CopyRow label="IBAN" value={method.details.iban} onCopy={() => copyToClipboard(method.details.iban || '', 'iban')} copied={copied === 'iban'} />}
                        {method.details.accountNumber && <CopyRow label="Account Number" value={method.details.accountNumber} onCopy={() => copyToClipboard(method.details.accountNumber || '', 'acc')} copied={copied === 'acc'} />}
                        {method.details.bankName && <InfoRow label="Bank" value={method.details.bankName} />}
                      </>
                    )}
                    <CopyRow
                      label="Your reference (put this in transfer note)"
                      value={bookingReference}
                      onCopy={() => copyToClipboard(bookingReference, 'ref')}
                      copied={copied === 'ref'}
                      highlight
                    />
                  </div>

                  {/* Upload receipt */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                      Upload receipt <span className="text-brass">*</span>
                    </p>
                    {!receiptFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex cursor-pointer items-center justify-center gap-3 rounded-[16px] border-2 border-dashed border-stone/15 bg-stone/5 p-6 transition hover:border-brass/40 hover:bg-brass/5"
                      >
                        <Upload size={20} className="text-stone/30 group-hover:text-brass" />
                        <p className="text-sm text-stone/50 group-hover:text-stone">Click to upload screenshot or PDF</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 rounded-[16px] border border-brass/15 bg-brass/6 p-4">
                        {receiptPreview ? (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px]">
                            <img src={receiptPreview} alt="" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[10px] bg-charcoal/30">
                            <FileText size={22} className="text-brass" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-mono text-stone">{receiptFile.name}</p>
                          <p className="text-xs text-muted">{(receiptFile.size / 1024).toFixed(0)}KB</p>
                        </div>
                        <div className="flex gap-1">
                          {receiptPreview && (
                            <button onClick={() => window.open(receiptPreview, '_blank')} className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/30 text-brass hover:bg-brass/15"><Eye size={14} /></button>
                          )}
                          <button onClick={clearReceipt} className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/30 text-muted hover:bg-red/10 hover:text-red"><X size={14} /></button>
                        </div>
                        <Check size={18} className="shrink-0 text-brass" />
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={handleFileSelect} className="hidden" />
                    {receiptError && <p className="flex items-center gap-2 rounded-[10px] border border-brass/20 bg-brass/8 p-3 text-xs text-brass"><AlertTriangle size={12} />{receiptError}</p>}
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Transaction ID <span className="text-brass">*</span></p>
                    <input
                      type="text"
                      placeholder="e.g., TPAY-12345678 or bank reference"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full rounded-[14px] border border-stone/12 bg-stone/6 p-4 font-mono text-sm text-stone placeholder:text-stone/30 focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
                    />
                    <p className="mt-1 text-[11px] text-muted">Found in your banking app after the transfer.</p>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Notes <span className="text-stone/40">(optional)</span></p>
                    <textarea
                      placeholder="Anything the team should know"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-20 w-full rounded-[14px] border border-stone/12 bg-stone/6 p-4 text-sm text-stone placeholder:text-stone/30 focus:border-brass/60 focus:outline-none focus:ring-2 focus:ring-brass/15"
                    />
                  </div>

                  {/* Agreement */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-[14px] border border-stone/10 bg-stone/5 p-4 transition hover:border-brass/20">
                    <input
                      type="checkbox"
                      checked={amountAgreed}
                      onChange={(e) => setAmountAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 appearance-none rounded-[4px] border border-stone/25 bg-stone/10 checked:border-brass checked:bg-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
                    />
                    <div>
                      <p className="text-xs leading-6 text-muted">
                        I confirm that I have sent <strong className="text-brass">{formatPrice(estimatedTotal)}</strong> via <strong className="text-stone">{method.name}</strong> 
                        {' '}with reference <strong className="font-mono text-brass">{bookingReference}</strong>.
                      </p>
                    </div>
                  </label>

                  {/* Error */}
                  {submitError && (
                    <div className="flex items-center gap-2 rounded-[12px] border border-brass/20 bg-brass/8 p-4 text-sm text-brass">
                      <AlertTriangle size={16} className="shrink-0" />
                      {submitError}
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isDetailsValid}
                  >
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Verifying...</>
                    ) : (
                      <><ShieldCheck size={18} /> Submit Payment Proof</>
                    )}
                  </Button>

                  <p className="text-center text-[10px] text-muted">
                    Your receipt is stored securely. We'll confirm within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-stone/8 px-6 py-3">
            <div className="flex items-center justify-between text-[10px] text-muted">
              <span>🔒 Powered by Balta Vista Secure Payments</span>
              <span>Need help? <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} target="_blank" rel="noreferrer" className="text-brass hover:underline">WhatsApp</a></span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

// ─── Sub-components ───

function MethodCard({ icon, name, subtitle, secondary, selected, onClick }: {
  icon: React.ReactNode; name: string; subtitle?: string; secondary?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-4 rounded-[16px] border p-4 text-left transition',
        selected ? 'border-brass/40 bg-brass/8 ring-1 ring-brass/20' : 'border-stone/10 bg-stone/5 hover:border-stone/25'
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass/12 text-brass">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-lg text-stone">{name}</p>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
      <div className="hidden text-right md:block">
        {secondary && <p className="text-[10px] text-muted">{secondary}</p>}
      </div>
      <ChevronRight size={16} className={cn('shrink-0 transition', selected ? 'text-brass' : 'text-stone/20')} />
    </button>
  );
}

function CopyRow({ label, value, onCopy, copied, highlight }: {
  label: string; value: string; onCopy?: () => void; copied?: boolean; highlight?: boolean;
}) {
  return (
    <div className={cn(
      'flex items-center justify-between rounded-[12px] border p-3',
      highlight ? 'border-brass/20 bg-brass/6' : 'border-stone/10 bg-stone/5'
    )}>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
        <p className={cn('mt-0.5 truncate font-mono text-sm', highlight ? 'font-bold text-brass' : 'text-stone')}>{value}</p>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal/30 text-brass transition hover:bg-brass/15" aria-label={`Copy ${label}`}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-stone/10 bg-stone/5 p-3">
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
        <p className="mt-0.5 truncate text-sm text-stone">{value}</p>
      </div>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-muted">
      <span className="text-brass/60">{icon}</span>
      {text}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M1 4.5h10" stroke="currentColor" strokeWidth="1" />
      <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
