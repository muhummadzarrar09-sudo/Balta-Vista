/**
 * Skeleton Loading Components
 * Used for page transitions and content loading states.
 */

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[16px] bg-stone/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      <Skeleton className="h-6 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-[24px] border border-stone/10 bg-stone/5 p-6 ${className}`} aria-hidden="true">
      <Skeleton className="mb-4 h-48 w-full" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="flex h-[112vh] min-h-[760px] items-center justify-center bg-charcoal" aria-hidden="true">
      <div className="w-full max-w-7xl px-5 md:px-8">
        <Skeleton className="mb-6 h-4 w-48" />
        <Skeleton className="mb-4 h-32 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  );
}
