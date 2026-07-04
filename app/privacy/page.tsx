import type { Metadata } from 'next';
import Link from 'next/link';
import { SubpageFooter } from '@/components/subpage';
import { SectionEyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Privacy Policy — Balta Vista Nathiagali',
  description: 'How Balta Vista collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy' }
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-charcoal text-stone">
      <div className="border-b border-stone/8">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="font-serif text-lg text-stone">Balta Vista</Link>
          <Link href="/booking" className="rounded-full border border-stone/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted transition hover:border-stone/25 hover:text-stone">Book now</Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <SectionEyebrow>Last updated: July 2026</SectionEyebrow>
        <h1 className="mb-8 font-serif text-5xl leading-tight text-stone md:text-7xl">Privacy Policy</h1>
        <p className="mb-12 text-lg leading-8 text-muted">Balta Vista Nathiagali (owned and operated by [Hotel Company Name], registered in Pakistan) respects your privacy. This policy explains how we collect, use, and protect your personal information.</p>

        <SectionBlock title="1. Information We Collect">
          <p>When you use our website or submit a booking inquiry, we collect:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Contact information:</strong> name, email address, phone number, city, province</li>
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Booking details:</strong> check-in/out dates, room preferences, number of guests, arrival window</li>
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Payment information:</strong> transaction IDs, payment method used (we do not store full bank account numbers or credit card details)</li>
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Technical data:</strong> IP address, browser type, pages visited, referral source via analytics events</li>
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Receipt images:</strong> uploaded screenshots of payment confirmations (stored securely, accessible only to authorised admin)</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="2. How We Use Your Information">
          <ul className="space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">To process and respond to your booking inquiry</li>
            <li className="leading-7 text-muted list-disc">To verify payment and confirm reservations</li>
            <li className="leading-7 text-muted list-disc">To communicate with you about your booking (via email, phone, or WhatsApp)</li>
            <li className="leading-7 text-muted list-disc">To improve our website and guest experience through analytics</li>
            <li className="leading-7 text-muted list-disc">To comply with legal obligations in Pakistan</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="3. Data Storage and Security">
          <p>Your data is stored on servers within or outside Pakistan, managed by our hosting provider (Vercel Inc.). We implement reasonable technical and organisational measures to protect your data, including:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">Encrypted connections (HTTPS) for all data transmission</li>
            <li className="leading-7 text-muted list-disc">Strict access controls — only authorised admin personnel can view booking records</li>
            <li className="leading-7 text-muted list-disc">Receipt files stored with anonymised filenames, not directly accessible from the web</li>
            <li className="leading-7 text-muted list-disc">Automatic backup of booking data with limited retention</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="4. Data Retention">
          <p>We retain your booking information for as long as necessary to fulfil your reservation and for a period of up to 3 years thereafter for record-keeping and legal compliance. Receipt images are retained for 1 year after check-out. Analytics data is retained for 26 months.</p>
        </SectionBlock>

        <SectionBlock title="5. Your Rights Under Pakistani Law">
          <p>Under the Pakistan Prevention of Electronic Crimes Act 2016 (PECA) and applicable data protection regulations, you have the right to:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">Request access to the personal data we hold about you</li>
            <li className="leading-7 text-muted list-disc">Request correction of inaccurate data</li>
            <li className="leading-7 text-muted list-disc">Request deletion of your data (subject to legal retention requirements)</li>
            <li className="leading-7 text-muted list-disc">Withdraw consent for marketing communications at any time</li>
          </ul>
          <p className="mt-4 leading-7 text-muted">To exercise these rights, contact us at <span className="text-brass">[email to be configured]</span> or via WhatsApp.</p>
        </SectionBlock>

        <SectionBlock title="6. Cookies">
          <p>We use only essential cookies required for the functioning of the website:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Session cookie (bv_session):</strong> Used for CSRF protection and security. Strictly necessary.</li>
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Admin session cookie (admin_session):</strong> Used only on the admin dashboard for authenticated access.</li>
          </ul>
          <p className="mt-4 leading-7 text-muted">We do not use tracking cookies, advertising cookies, or third-party marketing cookies. No personal data is sold to third parties.</p>
        </SectionBlock>

        <SectionBlock title="7. Third-Party Services">
          <p>We use the following third-party services that may process your data:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Vercel Inc.</strong> — hosting and deployment</li>
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">Resend</strong> — transactional email delivery</li>
            <li className="leading-7 text-muted list-disc"><strong className="text-stone">WhatsApp (Meta)</strong> — guest communication via wa.me links</li>
          </ul>
          <p className="mt-4 leading-7 text-muted">Each service has its own privacy policy and data processing agreement. We do not authorise any third party to use your data for their own purposes.</p>
        </SectionBlock>

        <SectionBlock title="8. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of the website after changes constitutes acceptance of the updated policy.</p>
        </SectionBlock>

        <SectionBlock title="9. Contact">
          <p>For privacy-related inquiries:</p>
          <div className="mt-4 rounded-2xl border border-stone/10 bg-stone/6 p-5">
            <p className="text-sm text-muted">Email: <span className="text-brass">[email to be configured]</span></p>
            <p className="mt-2 text-sm text-muted">WhatsApp: <span className="text-brass">+92 300 1234567</span></p>
            <p className="mt-2 text-sm text-muted">Address: Balta Vista, Nathiagali, Khyber Pakhtunkhwa, Pakistan</p>
          </div>
        </SectionBlock>
      </div>

      <SubpageFooter />
    </main>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 font-serif text-3xl text-stone md:text-4xl">{title}</h2>
      <div className="text-base leading-7 text-muted">{children}</div>
    </div>
  );
}
