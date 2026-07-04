'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('bv_cookie_consent');
    if (!consent) {
      // Delay showing so it doesn't pop up immediately on load
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('bv_cookie_consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6">
      <div
        className="mx-auto max-w-4xl rounded-2xl border border-stone/12 bg-charcoal/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl md:flex md:items-center md:gap-6 md:p-6"
        style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="mb-4 flex items-start gap-4 md:mb-0 md:flex-1">
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass">
            <Cookie size={18} />
          </span>
          <div>
            <p className="font-serif text-xl text-stone">This site uses cookies</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              We use only essential cookies for security and functionality. No tracking or advertising cookies. 
              Read our <Link href="/privacy" className="text-brass underline underline-offset-2 hover:no-underline">Privacy Policy</Link> for details.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={accept}
            className="flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-charcoal transition hover:bg-amber-soft"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex items-center justify-center rounded-full border border-stone/15 p-3 text-muted transition hover:border-stone/30 hover:text-stone"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
