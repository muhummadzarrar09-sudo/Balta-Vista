'use client';

import { BrandMark, Button, SectionEyebrow, StudioCard } from '@/components/ui';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal px-5 py-16 text-stone">
      <StudioCard className="max-w-3xl p-8 text-center md:p-12">
        <BrandMark className="mx-auto mb-6 h-14 w-14" />
        <SectionEyebrow>Temporary weather shift</SectionEyebrow>
        <h1 className="font-serif text-6xl leading-none md:text-8xl">Something drifted off-route.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">The page hit an unexpected issue. Try again, or return to the homepage if the problem persists.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="secondary"><a href="/">Back to homepage</a></Button>
        </div>
      </StudioCard>
    </main>
  );
}
