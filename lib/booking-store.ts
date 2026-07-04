import fs from 'node:fs';
import path from 'node:path';
import type { BookingRecord, BookingStatus, PaymentInfo, AuditEntry, PaymentReceipt } from '@/lib/booking-types';
import { canTransition, PAYMENT_WINDOW_HOURS } from '@/lib/booking-types';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const RECEIPTS_DIR = path.join(DATA_DIR, 'receipts');
const AUDIT_LOG_FILE = path.join(DATA_DIR, 'audit-log.json');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath: string, data: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Audit Trail ───

function appendAudit(entry: AuditEntry) {
  const log = readJsonFile<AuditEntry[]>(AUDIT_LOG_FILE, []);
  log.push(entry);
  // Keep only last 1000 entries to prevent file bloat
  if (log.length > 1000) log.splice(0, log.length - 1000);
  writeJsonFile(AUDIT_LOG_FILE, log);
}

export function getAuditLog(limit = 100): AuditEntry[] {
  const log = readJsonFile<AuditEntry[]>(AUDIT_LOG_FILE, []);
  return log.slice(-limit).reverse();
}

export function getBookingAuditLog(reference: string): AuditEntry[] {
  const booking = getBooking(reference);
  return booking?.auditLog ?? [];
}

// ─── Booking CRUD ───

function readBookings(): BookingRecord[] {
  return readJsonFile<BookingRecord[]>(BOOKINGS_FILE, []);
}

function writeBookings(bookings: BookingRecord[]) {
  writeJsonFile(BOOKINGS_FILE, bookings);
}

export function generateReference(): string {
  const prefix = 'BV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export function createBooking(record: Omit<BookingRecord, 'createdAt' | 'updatedAt' | 'status' | 'expiresAt' | 'auditLog'>): BookingRecord {
  const bookings = readBookings();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PAYMENT_WINDOW_HOURS * 60 * 60 * 1000);
  
  const entry: AuditEntry = {
    timestamp: now.toISOString(),
    action: 'booking_created',
    performedBy: 'guest',
    notes: `Booking created for ${record.name}, ${record.roomName}, ${record.estimatedNights} nights`,
  };

  const booking: BookingRecord = {
    ...record,
    status: 'inquiry_received',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    auditLog: [entry],
  };

  bookings.push(booking);
  writeBookings(bookings);
  appendAudit(entry);
  return booking;
}

export function getBooking(reference: string): BookingRecord | undefined {
  const bookings = readBookings();
  return bookings.find((b) => b.reference === reference);
}

export function getAllBookings(): BookingRecord[] {
  const bookings = readBookings();
  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── Status Transitions (with validation) ───

export function transitionBookingStatus(
  reference: string, 
  toStatus: BookingStatus, 
  performedBy: 'guest' | 'admin' | 'system',
  options?: { notes?: string; performedByEmail?: string; ipAddress?: string }
): { success: boolean; booking?: BookingRecord; error?: string } {
  const bookings = readBookings();
  const index = bookings.findIndex((b) => b.reference === reference);
  if (index === -1) return { success: false, error: 'Booking not found' };

  const booking = bookings[index];
  const fromStatus = booking.status;

  if (!canTransition(fromStatus, toStatus)) {
    // Special case: expired can happen anytime if payment window passed
    if (toStatus !== 'expired' || fromStatus !== 'payment_pending') {
      return { 
        success: false, 
        error: `Cannot transition from "${fromStatus}" to "${toStatus}". Allowed: ${canTransition(fromStatus, toStatus) ? 'yes' : 'no'}`
      };
    }
  }

  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    action: `status_${fromStatus}_to_${toStatus}`,
    fromStatus,
    toStatus,
    performedBy,
    performedByEmail: options?.performedByEmail,
    notes: options?.notes,
    ipAddress: options?.ipAddress,
  };

  booking.status = toStatus;
  booking.updatedAt = new Date().toISOString();
  booking.auditLog.push(entry);

  // If cancelled or expired, clear the expiry
  if (toStatus === 'cancelled' || toStatus === 'expired') {
    // Keep the record but it's done
  }

  writeBookings(bookings);
  appendAudit(entry);
  return { success: true, booking };
}

export function confirmBooking(
  reference: string, 
  confirmedBy: string,
  verifiedByIp?: string
): { success: boolean; booking?: BookingRecord; error?: string } {
  const result = transitionBookingStatus(reference, 'confirmed', 'admin', {
    performedByEmail: confirmedBy,
    ipAddress: verifiedByIp,
    notes: `Payment verified by ${confirmedBy}`,
  });

  if (result.success && result.booking) {
    const bookings = readBookings();
    const index = bookings.findIndex((b) => b.reference === reference);
    if (index !== -1 && bookings[index].payment) {
      bookings[index].payment!.confirmedAt = new Date().toISOString();
      bookings[index].payment!.verifiedBy = confirmedBy;
      bookings[index].confirmedBy = confirmedBy;
      writeBookings(bookings);
      result.booking = bookings[index];
    }
  }

  return result;
}

// ─── Payment Submission (with receipt) ───

export function submitPayment(
  reference: string,
  payment: PaymentInfo,
  options?: { ipAddress?: string }
): { success: boolean; booking?: BookingRecord; error?: string } {
  // First, validate the booking is in a state that can receive payment
  const bookings = readBookings();
  const index = bookings.findIndex((b) => b.reference === reference);
  if (index === -1) return { success: false, error: 'Booking not found' };

  const booking = bookings[index];
  if (!['inquiry_received', 'payment_pending'].includes(booking.status)) {
    return { success: false, error: `Cannot submit payment for booking in "${booking.status}" status` };
  }

  // Store payment info
  booking.payment = payment;
  booking.updatedAt = new Date().toISOString();

  // Transition to payment_submitted
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    action: 'payment_submitted',
    fromStatus: booking.status,
    toStatus: 'payment_submitted',
    performedBy: 'guest',
    notes: `Payment submitted via ${payment.methodName}. Transaction: ${payment.transactionId}`,
    ipAddress: options?.ipAddress,
  };

  booking.status = 'payment_submitted';
  booking.auditLog.push(entry);

  writeBookings(bookings);
  appendAudit(entry);
  return { success: true, booking };
}

export function markPaymentVerifying(
  reference: string,
  adminEmail: string
): { success: boolean; booking?: BookingRecord; error?: string } {
  return transitionBookingStatus(reference, 'payment_verifying', 'admin', {
    performedByEmail: adminEmail,
    notes: 'Admin started payment verification',
  });
}

// ─── Receipt Storage ───

export function saveReceipt(
  reference: string,
  buffer: Buffer,
  originalName: string,
  mimeType: string
): PaymentReceipt {
  ensureDir(RECEIPTS_DIR);
  const ext = path.extname(originalName) || '.png';
  const filename = `${reference}-${Date.now()}${ext}`;
  const filePath = path.join(RECEIPTS_DIR, filename);
  
  fs.writeFileSync(filePath, buffer);

  return {
    filename,
    originalName,
    mimeType,
    sizeBytes: buffer.length,
    uploadedAt: new Date().toISOString(),
  };
}

export function getReceiptPath(filename: string): string | null {
  const filePath = path.join(RECEIPTS_DIR, filename);
  if (fs.existsSync(filePath)) return filePath;
  return null;
}

// ─── Expiry Checker ───

export function checkAndExpireBookings(): string[] {
  const bookings = readBookings();
  const now = new Date();
  const expired: string[] = [];

  for (let i = 0; i < bookings.length; i++) {
    const b = bookings[i];
    // Only expire bookings in payment_pending or inquiry_received that have passed their expiry
    if ((b.status === 'payment_pending' || b.status === 'inquiry_received') && new Date(b.expiresAt) < now) {
      const entry: AuditEntry = {
        timestamp: now.toISOString(),
        action: 'auto_expired',
        fromStatus: b.status,
        toStatus: 'expired',
        performedBy: 'system',
        notes: `Auto-expired: payment window closed at ${b.expiresAt}`,
      };
      b.status = 'expired';
      b.updatedAt = now.toISOString();
      b.auditLog.push(entry);
      appendAudit(entry);
      expired.push(b.reference);
    }
  }

  if (expired.length > 0) {
    writeBookings(bookings);
  }

  return expired;
}

// ─── Admin Note ───

export function addAdminNote(
  reference: string, 
  note: string, 
  adminEmail: string
): { success: boolean; booking?: BookingRecord; error?: string } {
  const bookings = readBookings();
  const index = bookings.findIndex((b) => b.reference === reference);
  if (index === -1) return { success: false, error: 'Booking not found' };

  bookings[index].adminNotes = note;
  bookings[index].updatedAt = new Date().toISOString();
  
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    action: 'admin_note_added',
    performedBy: 'admin',
    performedByEmail: adminEmail,
    notes: note.substring(0, 200),
  };
  bookings[index].auditLog.push(entry);
  appendAudit(entry);

  writeBookings(bookings);
  return { success: true, booking: bookings[index] };
}

// ─── Payment Verification (Webhook) ───

export function verifyPaymentViaWebhook(
  reference: string,
  webhookPayload: Record<string, unknown>
): { success: boolean; booking?: BookingRecord; error?: string } {
  const bookings = readBookings();
  const index = bookings.findIndex((b) => b.reference === reference);
  if (index === -1) return { success: false, error: 'Booking not found' };

  const booking = bookings[index];
  
  if (booking.payment) {
    booking.payment.webhookConfirmed = true;
    booking.payment.webhookPayload = webhookPayload;
  }

  // Auto-confirm if webhook says payment is complete
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    action: 'payment_webhook_received',
    fromStatus: booking.status,
    toStatus: 'confirmed',
    performedBy: 'system',
    notes: `Payment confirmed via webhook from ${webhookPayload.source || 'payment provider'}`,
  };

  booking.status = 'confirmed';
  booking.updatedAt = new Date().toISOString();
  booking.auditLog.push(entry);
  if (booking.payment) {
    booking.payment.confirmedAt = new Date().toISOString();
    booking.payment.verifiedBy = 'webhook_auto';
  }
  booking.confirmedBy = 'webhook_auto';

  writeBookings(bookings);
  appendAudit(entry);
  return { success: true, booking };
}

// ─── Dashboard Stats ───

export function getDashboardStats() {
  const bookings = getAllBookings();
  const now = new Date();

  return {
    total: bookings.length,
    pendingPayment: bookings.filter((b) => b.status === 'inquiry_received' || b.status === 'payment_pending').length,
    paymentSubmitted: bookings.filter((b) => b.status === 'payment_submitted').length,
    paymentVerifying: bookings.filter((b) => b.status === 'payment_verifying').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    active: bookings.filter((b) => b.status === 'confirmed' || b.status === 'checked_in').length,
    completed: bookings.filter((b) => b.status === 'checked_out').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    expired: bookings.filter((b) => b.status === 'expired').length,
    totalRevenue: bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'checked_out')
      .reduce((sum, b) => sum + b.estimatedTotal, 0),
    expiringSoon: bookings.filter((b) => {
      if (b.status !== 'payment_pending' && b.status !== 'inquiry_received') return false;
      const expiresAt = new Date(b.expiresAt);
      const hoursLeft = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursLeft > 0 && hoursLeft < 6;
    }).length,
  };
}
