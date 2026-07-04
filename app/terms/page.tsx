import type { Metadata } from 'next';
import Link from 'next/link';
import { SubpageFooter } from '@/components/subpage';
import { SectionEyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Terms of Service — Balta Vista Nathiagali',
  description: 'Terms and conditions for using the Balta Vista website and booking services.',
  alternates: { canonical: '/terms' }
};

export default function TermsPage() {
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
        <h1 className="mb-8 font-serif text-5xl leading-tight text-stone md:text-7xl">Terms of Service</h1>
        <p className="mb-12 text-lg leading-8 text-muted">By using the Balta Vista website and submitting a booking inquiry, you agree to the following terms. Please read them carefully.</p>

        <SectionBlock title="1. General">
          <p>Balta Vista Nathiagali (&ldquo;the Hotel,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates this website for the purpose of providing information about our property and facilitating booking inquiries. These terms govern your use of the website and any booking services.</p>
        </SectionBlock>

        <SectionBlock title="2. Booking Inquiries">
          <p>Submitting a booking inquiry through our website constitutes a request for availability, not a guaranteed reservation. All inquiries are subject to confirmation by the Hotel&rsquo;s reservations team. Key points:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">Inquiries are processed during business hours, typically within 24 hours</li>
            <li className="leading-7 text-muted list-disc">Room rates are quoted in Pakistani Rupee (PKR) and are subject to change until confirmed</li>
            <li className="leading-7 text-muted list-disc">A booking is only confirmed when the Hotel sends a written confirmation via email or WhatsApp</li>
            <li className="leading-7 text-muted list-disc">The Hotel reserves the right to decline any inquiry at its discretion</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="3. Payments">
          <p>When payment is required to confirm a booking:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">Payments are accepted via Easypaisa, JazzCash, or bank transfer to designated accounts</li>
            <li className="leading-7 text-muted list-disc">All payments must be accompanied by a receipt or transaction reference for verification</li>
            <li className="leading-7 text-muted list-disc">The Hotel does not store or process credit/debit card information directly</li>
            <li className="leading-7 text-muted list-disc">A booking is considered confirmed only after payment is verified by the Hotel</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="4. Guest Responsibilities">
          <p>As a guest, you agree to:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">Provide accurate and complete information during the booking process</li>
            <li className="leading-7 text-muted list-disc">Comply with hotel policies and local laws during your stay</li>
            <li className="leading-7 text-muted list-disc">Not use the website for any unlawful or fraudulent purpose</li>
            <li className="leading-7 text-muted list-disc">Not attempt to manipulate pricing, booking data, or security systems</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="5. Website Use">
          <p>You may use this website for lawful purposes only. You agree not to:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">Use automated scripts, bots, or scrapers to access the site</li>
            <li className="leading-7 text-muted list-disc">Interfere with the security or functionality of the website</li>
            <li className="leading-7 text-muted list-disc">Submit false or misleading booking inquiries</li>
            <li className="leading-7 text-muted list-disc">Upload malicious files or attempt to compromise our systems</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="6. Limitation of Liability">
          <p>To the maximum extent permitted by law in Pakistan:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">The Hotel is not liable for any indirect, incidental, or consequential damages arising from your use of the website</li>
            <li className="leading-7 text-muted list-disc">The Hotel does not guarantee uninterrupted or error-free operation of the website</li>
            <li className="leading-7 text-muted list-disc">The Hotel&rsquo;s total liability for any claim shall not exceed the total amount paid for the booking in question</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="7. Governing Law">
          <p>These terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes arising from these terms shall be subject to the jurisdiction of the courts in Islamabad, Pakistan.</p>
        </SectionBlock>

        <SectionBlock title="8. Contact">
          <div className="rounded-2xl border border-stone/10 bg-stone/6 p-5">
            <p className="text-sm text-muted">Email: <span className="text-brass">[email to be configured]</span></p>
            <p className="mt-2 text-sm text-muted">WhatsApp: <span className="text-brass">+92 300 1234567</span></p>
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
