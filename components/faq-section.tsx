'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { SectionEyebrow } from '@/components/ui';
import { cn } from '@/lib/utils';

const faqs = [
  ['What is the nightly rate?', 'Opening inquiries are full-rate only. Single Bedroom starts at PKR 85,000, Double Bedroom at PKR 105,000, and Signature Suite at PKR 165,000 per night.'],
  ['Is online payment collected?', 'Online payment is not enabled for opening inquiries. The reservations team confirms availability and next steps directly with each guest.'],
  ['Do all rooms include TV and climate comfort?', 'Yes. TV, climate comfort, WiFi, and a view-led experience are baseline expectations across all room tiers.'],
  ['What are check-in and check-out times?', 'Placeholder operating policy: check-in from 2:00 PM and check-out by 12:00 PM. Final timings can be confirmed with your inquiry.'],
  ['How is road access in snow season?', 'Access is weather-dependent. We recommend confirming road conditions before travelling during snowfall or long weekends.'],
  ['Can families book the Signature Suite?', 'Yes. The Signature Suite is positioned for couples or small families who want a separate sitting area and the strongest valley-view experience.']
];

export function FAQSection({ className }: { className?: string }) {
  return (
    <section className={cn('mx-auto max-w-5xl px-5 pb-24 md:px-8', className)}>
      <div className="mb-10 grid gap-5 md:grid-cols-[.75fr_1.25fr] md:items-end">
        <div>
          <SectionEyebrow>Guest notes</SectionEyebrow>
          <h2 className="font-serif text-5xl leading-none text-stone md:text-6xl">Before you plan the climb.</h2>
        </div>
        <p className="max-w-xl text-lg leading-8 text-muted md:justify-self-end">A quieter help section for the questions guests usually ask before choosing dates, rooms, and road timing.</p>
      </div>

      <Accordion.Root type="single" collapsible className="border-y border-stone/12">
        {faqs.map(([question, answer], index) => (
          <Accordion.Item key={question} value={`faq-${index}`} className="group border-b border-stone/10 last:border-b-0">
            <Accordion.Trigger className="grid w-full grid-cols-[52px_1fr_40px] items-center gap-4 py-6 text-left md:grid-cols-[70px_1fr_44px] md:py-7">
              <span className="font-serif text-2xl text-brass/80 md:text-3xl">{String(index + 1).padStart(2, '0')}</span>
              <span className="font-serif text-2xl leading-tight text-stone md:text-3xl">{question}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stone/12 bg-stone/5 text-brass transition group-data-[state=open]:rotate-180 group-data-[state=open]:border-brass/35 group-data-[state=open]:bg-brass/10">
                <ChevronDown className="h-4 w-4" />
              </span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none">
              <div className="pb-7 pl-[52px] pr-4 text-lg leading-8 text-muted md:pl-[70px] md:pr-16">{answer}</div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
