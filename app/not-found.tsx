import Link from 'next/link';
import { Button, SectionEyebrow, StudioCard } from '@/components/ui';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal px-5 py-16 text-stone">
      <StudioCard className="max-w-3xl p-8 text-center md:p-12">
        <SectionEyebrow>Lost in the hills</SectionEyebrow>
        <h1 className="font-serif text-6xl leading-none md:text-8xl">This path does not reach Nathiagali.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">The page may have moved, or the route was only a preview trail. Return to the main hotel experience.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild><Link href="/">Back to homepage</Link></Button>
          <Button asChild variant="secondary"><Link href="/#booking">Start inquiry</Link></Button>
        </div>
      </StudioCard>
    </main>
  );
}
