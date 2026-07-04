/**
 * Notification Service — Email + WhatsApp + Admin Alerts
 * 
 * Called after every critical booking event.
 * Sends:
 *   1. Guest confirmation email
 *   2. Admin alert email
 *   3. WhatsApp links (guest-facing)
 *   4. Admin webhook (for Slack/Telegram/CRM)
 */

import { getServerEnv, getWhatsAppNumber, getSiteUrl } from '@/lib/env';
import type { BookingRecord } from '@/lib/booking-types';
import { sendEmail, sendAdminAlert, sendGuestEmail } from '@/lib/email/send';
import {
  bookingConfirmationGuest,
  adminNewInquiryAlert,
  adminPaymentAlert,
  bookingConfirmedGuest,
} from '@/lib/email/templates';

export type NotificationEvent = 
  | 'booking_created'
  | 'payment_submitted'
  | 'payment_verified'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_expired'
  | 'admin_alert';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function generateAdminLink(reference: string): string {
  return `${getSiteUrl()}/admin?ref=${reference}`;
}

/**
 * Get a WhatsApp deep link for the guest
 */
export function getGuestWhatsAppUrl(reference: string, event: NotificationEvent, guestPhone?: string): string {
  const number = guestPhone || getWhatsAppNumber();
  const cleanNumber = number.replace(/[^0-9]/g, '');

  const messages: Record<string, string> = {
    booking_created: `Hi! I've submitted a booking inquiry at Balta Vista Nathiagali. My reference is: ${reference}.`,
    payment_submitted: `Hi! I've submitted payment for my Balta Vista booking (Reference: ${reference}). Please verify and confirm.`,
    payment_verified: `Hi! I see my payment for booking ${reference} is being verified.`,
    booking_confirmed: `Thank you! My Balta Vista booking (${reference}) has been confirmed. I look forward to my stay!`,
  };

  const message = messages[event] || `Hi! I have a question about my Balta Vista booking. Reference: ${reference}`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Primary notification function — called after every critical event.
 * Sends emails, console logs, and webhooks.
 */
export async function notify(event: NotificationEvent, booking: BookingRecord, extra?: { message?: string }): Promise<void> {
  const siteUrl = getSiteUrl();
  const adminUrl = generateAdminLink(booking.reference);

  switch (event) {
    // ─── New Inquiry ───
    case 'booking_created': {
      console.log(`[BOOKING] New inquiry: ${booking.reference} — ${booking.name}`);

      // 1. Send guest confirmation email
      const guestEmailTpl = bookingConfirmationGuest({
        name: booking.name,
        reference: booking.reference,
        roomName: booking.roomName,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        nights: booking.estimatedNights,
        estimatedTotal: booking.estimatedTotal,
        siteUrl,
      });
      await sendGuestEmail(booking.email, guestEmailTpl.subject, guestEmailTpl.html);

      // 2. Send admin alert email
      const adminTpl = adminNewInquiryAlert({
        name: booking.name,
        reference: booking.reference,
        roomName: booking.roomName,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        estimatedTotal: booking.estimatedTotal,
        phone: booking.phone,
        email: booking.email,
        adminUrl,
      });
      await sendAdminAlert(adminTpl.subject, adminTpl.html);
      break;
    }

    // ─── Payment Submitted — Needs Admin Action ───
    case 'payment_submitted': {
      console.log(`[PAYMENT] Payment submitted: ${booking.reference} — ${booking.payment?.methodName}`);

      const tpl = adminPaymentAlert({
        name: booking.name,
        reference: booking.reference,
        roomName: booking.roomName,
        amount: booking.estimatedTotal,
        methodName: booking.payment?.methodName || 'Unknown',
        transactionId: booking.payment?.transactionId || 'N/A',
        adminUrl,
      });
      await sendAdminAlert(tpl.subject, tpl.html);
      break;
    }

    // ─── Payment Verified by Admin ───
    case 'payment_verified': {
      console.log(`[PAYMENT] Payment verified: ${booking.reference}`);
      break;
    }

    // ─── Booking Confirmed ───
    case 'booking_confirmed': {
      console.log(`[BOOKING] Confirmed: ${booking.reference} — ${booking.name}`);

      const tpl = bookingConfirmedGuest({
        name: booking.name,
        reference: booking.reference,
        roomName: booking.roomName,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        nights: booking.estimatedNights,
        estimatedTotal: booking.estimatedTotal,
        siteUrl,
      });
      await sendGuestEmail(booking.email, tpl.subject, tpl.html);
      break;
    }

    // ─── Booking Cancelled ───
    case 'booking_cancelled': {
      console.log(`[BOOKING] Cancelled: ${booking.reference}`);
      break;
    }

    // ─── Booking Expired ───
    case 'booking_expired': {
      console.log(`[BOOKING] Expired: ${booking.reference} — payment window closed`);
      break;
    }

    // ─── Generic Admin Alert ───
    case 'admin_alert': {
      console.log(`[ALERT] ${extra?.message || 'Admin attention needed'} — ${booking.reference}`);
      await sendAdminAlert(
        `⚠️ Balta Vista Alert — ${booking.reference}`,
        `<p>${extra?.message || 'No details'}</p><p>Admin: <a href="${adminUrl}">${adminUrl}</a></p>`,
      );
      break;
    }
  }

  // Also forward to webhook if configured (Slack/Telegram/CRM)
  await forwardToWebhook(event, booking, extra);
}

/**
 * Forward event to BOOKING_WEBHOOK_URL for Slack / Telegram / CRM integration
 */
async function forwardToWebhook(event: string, booking: BookingRecord, extra?: { message?: string }) {
  const { BOOKING_WEBHOOK_URL, BOOKING_WEBHOOK_SECRET } = getServerEnv();
  if (!BOOKING_WEBHOOK_URL) return;

  try {
    await fetch(BOOKING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(BOOKING_WEBHOOK_SECRET ? { 'x-webhook-secret': BOOKING_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({
        event,
        reference: booking.reference,
        guestName: booking.name,
        room: booking.roomName,
        amount: booking.estimatedTotal,
        status: booking.status,
        adminUrl: generateAdminLink(booking.reference),
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Webhook delivery is non-critical
  }
}
