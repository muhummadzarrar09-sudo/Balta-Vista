export type BookingStatus = 
  | 'inquiry_received'   
  | 'payment_pending'    
  | 'payment_submitted'  
  | 'payment_verifying'  
  | 'confirmed'          
  | 'checked_in'         
  | 'checked_out'        
  | 'cancelled'
  | 'expired';           

export type PaymentMethodId = 'easypaisa' | 'jazzcash' | 'hbl' | 'ubl' | 'mcb' | 'alfalah' | 'meezan' | 'other';

export interface AuditEntry {
  timestamp: string;
  action: string;
  fromStatus?: BookingStatus;
  toStatus?: BookingStatus;
  performedBy: 'guest' | 'admin' | 'system';
  performedByEmail?: string;
  notes?: string;
  ipAddress?: string;
}

export interface PaymentReceipt {
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedByIp?: string;
}

export interface PaymentInfo {
  methodId: PaymentMethodId;
  methodName: string;
  transactionId: string;
  receipt?: PaymentReceipt;
  submittedAt: string;
  confirmedAt?: string;
  verifiedBy?: string;
  adminNotes?: string;
  /** If Easypaisa/JazzCash sends a webhook confirmation */
  webhookConfirmed?: boolean;
  webhookPayload?: Record<string, unknown>;
}

export interface BookingRecord {
  reference: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string; // Payment must be confirmed before this

  // Guest details
  name: string;
  email: string;
  phone: string;
  guests: number;
  
  // Booking details
  checkIn: string;
  checkOut: string;
  room: 'single' | 'double' | 'suite';
  roomName: string;
  rate: number;
  estimatedNights: number;
  estimatedTotal: number;
  arrivalWindow?: string;
  message?: string;

  // Payment
  payment?: PaymentInfo;

  // Audit
  auditLog: AuditEntry[];
  
  // Admin
  adminNotes?: string;
  confirmedBy?: string;
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  inquiry_received: 'Inquiry Received',
  payment_pending: 'Payment Pending',
  payment_submitted: 'Payment Submitted — Verification in Progress',
  payment_verifying: 'Payment Being Verified',
  confirmed: 'Booking Confirmed ✓',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
  expired: 'Expired — Payment Window Closed',
};

export const STATUS_FLOW: BookingStatus[] = [
  'inquiry_received',
  'payment_pending',
  'payment_submitted',
  'payment_verifying',
  'confirmed',
  'checked_in',
  'checked_out',
];

export function getStatusIndex(status: BookingStatus): number {
  const idx = STATUS_FLOW.indexOf(status);
  return idx >= 0 ? idx : -1;
}

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  const allowed: Record<BookingStatus, BookingStatus[]> = {
    inquiry_received: ['payment_pending', 'cancelled'],
    payment_pending: ['payment_submitted', 'cancelled', 'expired'],
    payment_submitted: ['payment_verifying', 'cancelled'],
    payment_verifying: ['confirmed', 'cancelled', 'payment_pending'],
    confirmed: ['checked_in', 'cancelled'],
    checked_in: ['checked_out', 'cancelled'],
    checked_out: [],
    cancelled: [],
    expired: [],
  };
  return allowed[from]?.includes(to) ?? false;
}

export const ROOM_RATES: Record<string, number> = {
  single: 85000,
  double: 105000,
  suite: 165000,
};

export const ROOM_NAMES: Record<string, string> = {
  single: 'Single Bedroom',
  double: 'Double Bedroom',
  suite: 'Signature Suite',
};

/** Payment window: guest has 24 hours to submit payment */
export const PAYMENT_WINDOW_HOURS = 24;
/** After payment submitted, admin has 48 hours to verify */
export const VERIFICATION_WINDOW_HOURS = 48;
