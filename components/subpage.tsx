import Link from 'next/link';
import { BrandMark, Button } from '@/components/ui';

export function SubpageHeader({ cta = true }: { cta?: boolean }) {
  return (
    <header className="border-b border-stone/10 bg-charcoal/88 px-5 py-5 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
        <Link href="/" className="group flex items-center gap-3" aria-label="Balta Vista home">
          <BrandMark className="h-10 w-10 transition group-hover:border-brass/55 group-hover:bg-brass/15" />
          <span className="font-serif text-xl text-stone">Balta Vista</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link className="text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:text-brass" href="/rooms">Rooms</Link>
          <Link className="text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:text-brass" href="/experience">Experience</Link>
          <Link className="text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:text-brass" href="/location">Location</Link>
          <Link className="text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:text-brass" href="/design">Design</Link>
        </nav>
        {cta ? <Button asChild size="sm"><Link href="/booking">Book Now</Link></Button> : null}
      </div>
    </header>
  );
}

export function SubpageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-stone/10 px-5 py-20 md:px-8 md:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_12%,rgba(192,139,62,.12),transparent_24rem),radial-gradient(circle_at_10%_90%,rgba(154,170,130,.10),transparent_28rem)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-sage">{eyebrow}</p>
          <span className="h-px flex-1 bg-stone/10" />
        </div>
        <div className="grid gap-8 md:grid-cols-[1fr_.48fr] md:items-end">
          <h1 className="max-w-5xl font-serif text-[4.4rem] leading-[0.84] tracking-[-0.065em] text-stone md:text-[7.8rem]">{title}</h1>
          <div className="max-w-3xl border-l border-brass/25 pl-5 text-lg leading-8 text-muted">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function EditorialBand({ items }: { items: Array<[string, string]> }) {
  return (
    <section className="px-5 py-8 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-0 border-y border-stone/10 md:grid-cols-3">
        {items.map(([label, value]) => (
          <div key={label} className="border-b border-stone/10 py-5 md:border-b-0 md:border-r md:px-6 md:last:border-r-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-sage">{label}</p>
            <p className="mt-2 font-serif text-2xl leading-tight text-stone">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SubpageCTA({ eyebrow = 'Next step', title, text, href = '/booking', label = 'Start booking inquiry' }: { eyebrow?: string; title: string; text: string; href?: string; label?: string }) {
  return (
    <section className="px-5 pb-20 md:px-8">
      <div className="mx-auto max-w-7xl rounded-card border border-stone/12 bg-card-gradient p-6 shadow-soft md:p-10">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-sage">{eyebrow}</p>
            <h2 className="max-w-3xl font-serif text-4xl leading-none text-stone md:text-6xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{text}</p>
          </div>
          <Button asChild size="lg"><Link href={href}>{label}</Link></Button>
        </div>
      </div>
    </section>
  );
}

export function SubpageFooter() {
  return (
    <footer className="border-t border-stone/10 px-5 py-10 text-muted md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <p className="font-serif text-2xl text-stone">Balta Vista</p>
        <div className="flex flex-wrap gap-5 text-sm">
          <Link href="/rooms" className="hover:text-brass">Rooms</Link>
          <Link href="/experience" className="hover:text-brass">Experience</Link>
          <Link href="/location" className="hover:text-brass">Location</Link>
          <Link href="/booking" className="hover:text-brass">Booking</Link>
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-center gap-4 border-t border-stone/8 pt-6 text-xs">
        <Link href="/privacy" className="font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-brass">Privacy Policy</Link>
        <span className="text-stone/30">·</span>
        <Link href="/terms" className="font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-brass">Terms of Service</Link>
        <span className="text-stone/30">·</span>
        <Link href="/cancellation" className="font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-brass">Cancellation Policy</Link>
      </div>
    </footer>
  );
}
