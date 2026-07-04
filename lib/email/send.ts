/**
 * Email Sender — Powered by Resend
 * 
 * Sends transactional emails via Resend API.
 * Falls back to console.log if RESEND_API_KEY is not set (dev mode).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.EMAIL_FROM || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams): Promise<{ sent: boolean; id?: string; error?: string }> {
  // Dev mode fallback
  if (!RESEND_API_KEY) {
    console.log(`\n📧 [EMAIL] To: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`📧 [EMAIL] Subject: ${subject}`);
    console.log(`📧 [EMAIL] Preview: ${html.substring(0, 200)}...\n`);
    return { sent: false, id: 'dev-mode' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Balta Vista <${FROM_EMAIL}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        replyTo: replyTo || FROM_EMAIL,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send email');
    return { sent: true, id: data.id };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error(`📧 [EMAIL ERROR] ${error}`);
    return { sent: false, error };
  }
}

export async function sendAdminAlert(subject: string, html: string): Promise<{ sent: boolean; id?: string }> {
  return sendEmail({ to: ADMIN_EMAIL, subject, html });
}

export async function sendGuestEmail(to: string, subject: string, html: string): Promise<{ sent: boolean; id?: string }> {
  return sendEmail({ to, subject, html, replyTo: ADMIN_EMAIL });
}
