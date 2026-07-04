import type { Metadata } from 'next';
import Link from 'next/link';
import { SubpageFooter } from '@/components/subpage';
import { SectionEyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Cancellation Policy — Balta Vista Nathiagali',
  description: 'Cancellation and refund policy for bookings at Balta Vista Nathiagali.',
  alternates: { canonical: '/cancellation' }
};

export default function CancellationPage() {
  return (
    <main className="min-h-screen bg-charcoal text-stone">
      <div className="border-b border-stone/8">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="font-serif text-lg text-stone">Balta Vista</Link>
          <Link href="/booking" className="rounded-full border border-stone/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted transition hover:border-stone/25 hover:text-stone">Book now</Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <SectionEyebrow>Opening season policy — subject to refinement</SectionEyebrow>
        <h1 className="mb-8 font-serif text-5xl leading-tight text-stone md:text-7xl">Cancellation &amp; Refund Policy</h1>
        <p className="mb-12 text-lg leading-8 text-muted">This policy applies to all bookings confirmed at Balta Vista Nathiagali during the opening season. Terms may be updated as the hotel establishes standard operating procedures.</p>

        <SectionBlock title="1. Payment Confirmation">
          <p>Bookings are confirmed only after payment has been verified by the Hotel. Upon verification, you will receive a written confirmation via email. Until verification, no booking is guaranteed.</p>
        </SectionBlock>

        <SectionBlock title="2. Cancellation by Guest">
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-stone/10 bg-stone/6 p-5">
              <p className="font-serif text-xl text-stone">More than 14 days before check-in</p>
              <p className="mt-2 text-sm leading-6 text-muted">Full refund minus a processing fee of PKR 5,000. Refund processed within 7 business days.</p>
            </div>
            <div className="rounded-2xl border border-stone/10 bg-stone/6 p-5">
              <p className="font-serif text-xl text-stone">7–14 days before check-in</p>
              <p className="mt-2 text-sm leading-6 text-muted">50% refund of the total booking amount. Refund processed within 7 business days.</p>
            </div>
            <div className="rounded-2xl border border-stone/10 bg-stone/6 p-5">
              <p className="font-serif text-xl text-stone">Less than 7 days before check-in</p>
              <p className="mt-2 text-sm leading-6 text-muted">No refund. However, if we can rebook the room for the same dates, a 50% refund may be issued at the Hotel&rsquo;s discretion.</p>
            </div>
            <div className="rounded-2xl border border-brass/15 bg-brass/8 p-5">
              <p className="font-serif text-xl text-stone">No-show</p>
              <p className="mt-2 text-sm leading-6 text-muted">No refund. The full booking amount is forfeited.</p>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock title="3. Cancellation by Hotel">
          <p>In the rare event that the Hotel must cancel your booking (due to unforeseen circumstances, weather conditions, or operational issues), you will receive:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">A full refund of all amounts paid, processed within 5 business days</li>
            <li className="leading-7 text-muted list-disc">Priority rebooking for alternative dates if desired</li>
            <li className="leading-7 text-muted list-disc">Road condition guidance: if access roads to Nathiagali are closed by authorities, cancellation fees will be waived</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="4. Weather and Road Conditions">
          <p>Nathiagali is a hill station at approximately 2,410 metres elevation. Snowfall and road conditions can affect access, particularly in winter months. We recommend:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">Confirming road conditions with the Hotel before travelling during snowfall</li>
            <li className="leading-7 text-muted list-disc">Allowing extra travel time during weekends and public holidays</li>
            <li className="leading-7 text-muted list-disc">If government-issued road closures prevent arrival, the cancellation policy under Section 3 applies</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="5. Refund Processing">
          <p>Refunds are processed to the original payment method where possible:</p>
          <ul className="mt-4 space-y-2 pl-5">
            <li className="leading-7 text-muted list-disc">Easypaisa/JazzCash payments: refunded to the same mobile account within 7 business days</li>
            <li className="leading-7 text-muted list-disc">Bank transfers: refunded to the originating bank account within 7 business days</li>
            <li className="leading-7 text-muted list-disc">All refunds are processed in Pakistani Rupee (PKR)</li>
          </ul>
        </SectionBlock>

        <SectionBlock title="6. Amendments">
          <p>Date changes are treated as a cancellation of the original booking and a new booking request. The cancellation policy applies to the original booking. We recommend contacting us directly via WhatsApp for date changes to explore flexible options.</p>
        </SectionBlock>

        <SectionBlock title="7. Contact for Cancellations">
          <div className="rounded-2xl border border-stone/10 bg-stone/6 p-5">
            <p className="text-sm text-muted">WhatsApp: <span className="text-brass">+92 300 1234567</span></p>
            <p className="mt-2 text-sm text-muted">Email: <span className="text-brass">[email to be configured]</span></p>
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
