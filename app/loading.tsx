import { BrandMark } from '@/components/ui';

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-charcoal text-stone">
      <div className="grid place-items-center gap-4">
        <BrandMark className="h-12 w-12 rounded-full" />
        <p className="font-serif text-4xl text-brass">Balta Vista</p>
      </div>
    </div>
  );
}
