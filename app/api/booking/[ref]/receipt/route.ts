import { NextRequest, NextResponse } from 'next/server';
import { getBooking, saveReceipt, submitPayment } from '@/lib/booking-store';
import { notify } from '@/lib/notifications';
import { guardRequest, sanitizeInput } from '@/lib/security/request-guard';
import { logSecurityEvent } from '@/lib/security/auditor';
import type { PaymentMethodId } from '@/lib/booking-types';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  // ─── HARDENED: Strict security guard ───
  const guard = await guardRequest(req, {
    validateOrigin: true,
    blockBots: true,
    rateLimit: { limit: 3, windowMs: 60_000 }, // Strict: max 3 uploads per minute
    maxBodyBytes: MAX_FILE_SIZE + 10_000, // File + form data
  });
  if (!guard.passed) return guard.response!;

  const { ref } = await params;
  const reference = ref.toUpperCase();

  // ─── HARDENED: Validate reference ───
  if (!reference || !/^BV-[A-Z0-9]{6,}$/.test(reference)) {
    return NextResponse.json({ error: 'Invalid booking reference' }, { status: 400 });
  }

  const booking = getBooking(reference);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (!['inquiry_received', 'payment_pending'].includes(booking.status)) {
    return NextResponse.json({ 
      error: `Cannot submit payment for booking in "${booking.status}" status` 
    }, { status: 400 });
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  // ─── HARDENED: Get and validate file ───
  const receiptFile = formData.get('receipt') as File | null;
  if (!receiptFile) {
    return NextResponse.json({ error: 'Receipt image is required' }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(receiptFile.type)) {
    logSecurityEvent({
      type: 'suspicious_payload',
      ip: guard.ip,
      method: 'POST',
      path: '/api/booking/[ref]/receipt',
      details: `Invalid file type: ${receiptFile.type}`,
    });
    return NextResponse.json({ 
      error: `Invalid file type. Allowed: PNG, JPEG, WebP, PDF` 
    }, { status: 400 });
  }

  if (receiptFile.size > MAX_FILE_SIZE) {
    return NextResponse.json({ 
      error: `File too large. Maximum is 5MB. Your file: ${(receiptFile.size / 1024 / 1024).toFixed(1)}MB` 
    }, { status: 400 });
  }

  // ─── HARDENED: Validate all form fields ───
  const methodId = sanitizeInput(formData.get('methodId') as string || '', 30);
  const methodName = sanitizeInput(formData.get('methodName') as string || '', 60);
  const transactionId = sanitizeInput(formData.get('transactionId') as string || '', 100);
  const notes = sanitizeInput(formData.get('notes') as string || '', 300);

  if (!methodId || !methodName) {
    return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
  }
  if (!transactionId || transactionId.length < 3) {
    return NextResponse.json({ error: 'Transaction ID is required (min 3 characters)' }, { status: 400 });
  }

  // ─── HARDENED: Save receipt with sanitized filename ───
  const arrayBuffer = await receiptFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const receipt = saveReceipt(reference, buffer, receiptFile.name, receiptFile.type);

  const result = submitPayment(reference, {
    methodId: methodId as PaymentMethodId,
    methodName,
    transactionId,
    receipt,
    submittedAt: new Date().toISOString(),
    adminNotes: notes || undefined,
  }, { ipAddress: guard.ip });

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to process payment' }, { status: 500 });
  }

  // Notify admin
  await notify('payment_submitted', result.booking!);

  return NextResponse.json({
    ok: true,
    reference,
    status: result.booking!.status,
    receipt: {
      filename: receipt.filename,
      sizeBytes: receipt.sizeBytes,
      mimeType: receipt.mimeType,
    },
    message: 'Receipt received. The team will verify your payment and confirm your booking within 24 hours.',
  });
}
