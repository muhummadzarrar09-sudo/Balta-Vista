export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-charcoal text-stone">
      <div className="grid place-items-center gap-4">
        <div className="h-12 w-12 rounded-full border border-brass/30 bg-brass/10 p-3 text-brass">
          <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 28 17 9l6 11 4-7 8 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <p className="font-serif text-4xl text-brass">Pine & Peak</p>
      </div>
    </div>
  );
}
