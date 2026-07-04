'use client';

import { useState, useRef } from 'react';
import { Check, Copy, ArrowRight, Building2, Smartphone, Banknote, Upload, X, FileText, AlertTriangle, ShieldCheck, Loader2, Eye } from 'lucide-react';
import { paymentMethods, walletMethods, bankMethods, type PaymentMethodId } from '@/lib/payment-methods';
import { Button, StudioCard, SectionEyebrow } from '@/components/ui';
import { cn } from '@/lib/utils';

interface PaymentMethodsProps {
  bookingReference: string;
  estimatedTotal: number;
  onPaymentSubmit: (methodId: PaymentMethodId, methodName: string, transactionId: string, notes: string, receiptFile?: File) => Promise<void>;
  isSubmitting: boolean;
  submitError: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];

export function PaymentMethods({ bookingReference, estimatedTotal, onPaymentSubmit, isSubmitting, submitError }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'select' | 'details' | 'confirm'>('select');

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

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setReceiptError(`Invalid file type. Please upload PNG, JPEG, WebP, or PDF.`);
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setReceiptError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 5MB.`);
      return;
    }

    setReceiptFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setReceiptPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const clearReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatPrice = (amount: number) => `PKR ${amount.toLocaleString('en-PK')}`;

  const handleContinue = async () => {
    if (!method) return;
    await onPaymentSubmit(method.id, method.name, transactionId, notes, receiptFile || undefined);
  };

  const isDetailsValid = selectedMethod && transactionId.trim().length >= 3 && receiptFile;

  return (
    <div className="space-y-8">
      {/* Booking Reference Banner — VERIFIABLE */}
      <StudioCard className="border-brass/20 bg-brass/8 p-6 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <ShieldCheck size={20} className="text-brass" />
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sage">Secure Payment</span>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sage">Booking Reference</p>
        <p className="mt-2 font-mono text-4xl tracking-tight text-brass">{bookingReference}</p>
        <p className="mt-3 text-sm leading-6 text-muted">
          Use this reference <strong>exactly as shown</strong> in your transfer note so the system can match your payment. 
          Keep a screenshot of your transaction for your records.
        </p>
        <button
          onClick={() => copyToClipboard(bookingReference, 'ref')}
          className="mx-auto mt-3 flex items-center gap-2 text-xs text-brass hover:text-amber-soft"
        >
          {copied === 'ref' ? <Check size={14} /> : <Copy size={14} />}
          {copied === 'ref' ? 'Copied!' : 'Copy reference'}
        </button>
      </StudioCard>

      {/* Step 1: Select Payment Method */}
      {step === 'select' && (
        <>
          {/* Wallet Methods */}
          <div>
            <SectionEyebrow>Mobile Wallets</SectionEyebrow>
            <p className="mb-5 text-sm leading-6 text-muted">Instant payments via Easypaisa or JazzCash. Funds are verified within minutes.</p>
            <div className="grid gap-4 md:grid-cols-2">
              {walletMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => { setSelectedMethod(method.id); setStep('details'); }}
                  className="group relative overflow-hidden rounded-[22px] border p-5 text-left transition hover:border-brass/40 hover:bg-brass/8 border-stone/12 bg-stone/6"
                >
                  <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brass/12 text-lg font-bold text-brass">
                    {method.icon}
                  </span>
                  <h3 className="font-serif text-2xl text-stone">{method.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{method.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-brass">
                    <Smartphone size={14} />
                    {method.details.phoneNumber}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bank Transfer Methods */}
          <div>
            <SectionEyebrow>Bank Transfers</SectionEyebrow>
            <p className="mb-5 text-sm leading-6 text-muted">Direct IBAN transfer from any Pakistani bank. May take 2–4 hours to reflect.</p>
            <div className="grid gap-4 md:grid-cols-2">
              {bankMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => { setSelectedMethod(method.id); setStep('details'); }}
                  className="group relative overflow-hidden rounded-[22px] border p-5 text-left transition hover:border-brass/40 hover:bg-brass/8 border-stone/12 bg-stone/6"
                >
                  <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brass/12 text-lg font-bold text-brass">
                    {method.icon}
                  </span>
                  <h3 className="font-serif text-xl text-stone">{method.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{method.description}</p>
                  {method.details.accountNumber && (
                    <p className="mt-3 font-mono text-xs text-brass/80">
                      A/C: {method.details.accountNumber}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Step 2: Payment Details + Upload Receipt */}
      {step === 'details' && method && (
        <StudioCard className="overflow-hidden border-brass/20 p-6">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setStep('select')}
            className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted hover:text-stone"
          >
            ← Change payment method
          </button>

          <SectionEyebrow>Step 2 of 3 — Payment Details</SectionEyebrow>
          <h3 className="mb-2 font-serif text-3xl text-stone">{method.name}</h3>
          <p className="mb-6 text-sm leading-6 text-muted">
            Send the exact amount to the account below, then upload your receipt.
          </p>

          {/* Amount Due — Clear and Bold */}
          <div className="mb-6 rounded-[18px] border-2 border-brass/25 bg-brass/10 p-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sage">Amount Due</p>
            <p className="mt-2 font-serif text-5xl tracking-tight text-brass">{formatPrice(estimatedTotal)}</p>
            <p className="mt-2 text-xs text-muted">This is your total for the stay</p>
          </div>

          {/* Payment Account Details */}
          <div className="mb-6 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sage">Send payment to</p>
            
            {method.type === 'wallet' && (
              <>
                <DetailRow
                  label="Account Title"
                  value={method.details.accountTitle || 'Balta Vista Nathiagali'}
                  onCopy={() => copyToClipboard(method.details.accountTitle || '', 'title')}
                  copied={copied === 'title'}
                />
                <DetailRow
                  label="Phone Number"
                  value={method.details.phoneNumber || ''}
                  onCopy={() => copyToClipboard(method.details.phoneNumber || '', 'phone')}
                  copied={copied === 'phone'}
                />
              </>
            )}

            {method.type === 'bank' && (
              <>
                <DetailRow
                  label="Account Title"
                  value={method.details.accountTitle || 'Balta Vista Nathiagali'}
                  onCopy={() => copyToClipboard(method.details.accountTitle || '', 'title')}
                  copied={copied === 'title'}
                />
                {method.details.iban && (
                  <DetailRow
                    label="IBAN (International Bank Account Number)"
                    value={method.details.iban}
                    onCopy={() => copyToClipboard(method.details.iban || '', 'iban')}
                    copied={copied === 'iban'}
                  />
                )}
                <DetailRow
                  label="Account Number"
                  value={method.details.accountNumber || ''}
                  onCopy={() => copyToClipboard(method.details.accountNumber || '', 'acc')}
                  copied={copied === 'acc'}
                />
                {method.details.bankName && (
                  <DetailRow label="Bank" value={method.details.bankName} />
                )}
                {method.details.branch && (
                  <DetailRow label="Branch" value={method.details.branch} />
                )}
              </>
            )}

            <DetailRow
              label="Your Reference (write this in the transfer note)"
              value={bookingReference}
              onCopy={() => copyToClipboard(bookingReference, 'ref')}
              copied={copied === 'ref'}
              highlight
            />
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-stone/12" />

          {/* Upload Receipt */}
          <div>
            <SectionEyebrow>Step 3 of 3 — Upload Payment Proof</SectionEyebrow>
            <h4 className="mb-2 font-serif text-2xl text-stone">Confirm your payment.</h4>
            <p className="mb-6 text-sm leading-6 text-muted">
              After sending the payment, upload a screenshot of the transaction confirmation. 
              This is how we verify your payment. Without a receipt, we <strong>cannot</strong> confirm your booking.
            </p>

            {/* Receipt Upload Area */}
            <div className="mb-6">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Upload Transaction Receipt/Screenshot <span className="text-brass">*</span>
              </label>
              
              {!receiptFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group cursor-pointer rounded-[18px] border-2 border-dashed border-stone/20 bg-stone/6 p-8 text-center transition hover:border-brass/40 hover:bg-brass/6"
                >
                  <Upload size={32} className="mx-auto text-stone/30 transition group-hover:text-brass" />
                  <p className="mt-4 font-serif text-lg text-stone/60 group-hover:text-stone">
                    Click to upload receipt
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    PNG, JPEG, or PDF (max 5MB)
                  </p>
                </div>
              ) : (
                <div className="rounded-[18px] border border-brass/20 bg-brass/8 p-4">
                  <div className="flex items-start gap-4">
                    {receiptPreview ? (
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[12px]">
                        <img src={receiptPreview} alt="Receipt preview" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[12px] bg-charcoal/40">
                        <FileText size={28} className="text-brass" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm text-stone truncate">{receiptFile.name}</p>
                      <p className="mt-1 text-xs text-muted">{(receiptFile.size / 1024 / 1024).toFixed(1)}MB</p>
                      <div className="mt-3 flex gap-2">
                        {receiptPreview && (
                          <button
                            type="button"
                            onClick={() => window.open(receiptPreview, '_blank')}
                            className="flex items-center gap-1.5 rounded-full border border-stone/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted hover:text-stone"
                          >
                            <Eye size={12} /> View
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={clearReceipt}
                          className="flex items-center gap-1.5 rounded-full border border-brass/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brass hover:bg-brass/10"
                        >
                          <X size={12} /> Remove
                        </button>
                      </div>
                    </div>
                    <Check size={20} className="shrink-0 text-brass" />
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              {receiptError && (
                <p className="mt-3 flex items-center gap-2 rounded-[12px] border border-brass/30 bg-brass/10 p-3 text-sm text-brass">
                  <AlertTriangle size={14} />
                  {receiptError}
                </p>
              )}
            </div>

            {/* Transaction ID */}
            <div className="mb-6">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Transaction / Reference ID <span className="text-brass">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., TPAY-12345678 or bank reference number"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full rounded-[14px] p-4 text-base font-mono tracking-wider"
              />
              <p className="mt-2 text-xs text-muted">
                This is the ID shown in your banking app after the transfer. We use it to cross-verify.
              </p>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Additional Notes <span className="text-stone/40">(optional)</span>
              </label>
              <textarea
                placeholder="Any details about the transfer — bank branch, time, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-24 w-full rounded-[14px] p-4 text-base"
              />
            </div>

            {/* Error */}
            {submitError && (
              <p className="mb-6 flex items-center gap-2 rounded-[14px] border border-brass/30 bg-brass/10 p-4 text-sm text-brass">
                <AlertTriangle size={16} />
                {submitError}
              </p>
            )}

            {/* Submit */}
            <div className="rounded-[18px] border border-stone/10 bg-stone/6 p-5">
              <div className="mb-4 flex items-start gap-3">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brass" />
                <p className="text-sm leading-6 text-muted">
                  By submitting, you confirm you have sent <strong>{formatPrice(estimatedTotal)}</strong> via <strong>{method.name}</strong> 
                  with reference <strong>{bookingReference}</strong>. The team will verify your receipt and confirm your booking within 24 hours.
                </p>
              </div>

              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={handleContinue}
                disabled={isSubmitting || !isDetailsValid}
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Submitting Payment Proof...</>
                ) : (
                  <><ShieldCheck size={18} /> Submit Payment Proof — Confirm Booking</>
                )}
              </Button>

              <p className="mt-3 text-center text-[10px] text-muted">
                Your receipt is stored securely. We never share your financial information.
              </p>
            </div>
          </div>
        </StudioCard>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  onCopy,
  copied,
  highlight,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      'flex items-center justify-between rounded-[16px] border p-4',
      highlight ? 'border-brass/25 bg-brass/8' : 'border-stone/12 bg-stone/6'
    )}>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
        <p className={cn(
          'mt-1 font-mono text-sm break-all',
          highlight ? 'text-brass font-bold' : 'text-stone'
        )}>{value}</p>
      </div>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal/45 text-brass transition hover:bg-brass/20"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
    </div>
  );
}
