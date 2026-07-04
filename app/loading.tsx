import { SkeletonHero, SkeletonCard } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-charcoal">
      <SkeletonHero />
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </main>
  );
}
