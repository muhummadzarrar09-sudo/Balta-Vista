import { BrandMark } from '@/components/ui';

export default function Loading() {
  return (
    <div className="loader-wipe grid min-h-screen place-items-center text-stone">
      <div className="grid place-items-center gap-5 px-6 text-center">
        <div className="brand-loader-mark"><BrandMark className="h-16 w-16 rounded-[24px]" /></div>
        <p className="loader-word font-serif text-5xl leading-none text-brass md:text-6xl">Balta Vista</p>
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sage">Nathiagali · opening preview</p>
        <div className="loader-route-line" />
      </div>
    </div>
  );
}
