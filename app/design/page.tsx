import type { Metadata } from 'next';
import { SectionEyebrow, StudioCard } from '@/components/ui';
import { concepts } from '@/lib/site-data';
import { SubpageCTA, SubpageFooter, SubpageHeader, SubpageHero } from '@/components/subpage';
import { jsonLd, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Design Studies',
  description: 'Architectural studies for Balta Vista Nathiagali: ridge massing, courtyard arrival, and panorama deck concepts.',
  alternates: { canonical: '/design' }
};

function StudyDrawing() {
  return <svg viewBox="0 0 420 260" className="h-full w-full"><defs><pattern id="studyGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#eadcc4" strokeOpacity=".055"/></pattern></defs><rect width="420" height="260" fill="url(#studyGrid)"/><path d="M35 216 C100 176 150 232 218 190 C286 148 320 192 390 136" fill="none" stroke="#9aaa82" strokeOpacity=".14"/><path d="M94 180 216 108 330 164 202 236Z" fill="rgba(192,139,62,.035)" stroke="#eadcc4" strokeOpacity=".58"/><path d="M94 180V92l122-56v72M330 164V78L216 36M202 236V142L94 92M202 142l128-64" fill="none" stroke="#c08b3e" strokeOpacity=".6"/><path d="M130 164 230 108 290 140" fill="none" stroke="#9aaa82" strokeOpacity=".44" strokeDasharray="5 6"/><text x="238" y="58" fill="#eadcc4" fillOpacity=".52" fontSize="11" letterSpacing="2">VALLEY FACE</text><text x="62" y="84" fill="#c08b3e" fillOpacity=".65" fontSize="11" letterSpacing="2">STONE BASE</text></svg>;
}


function DesignJsonLd() {
  const base = siteUrl();
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Balta Vista architectural studies',
    url: `${base}/design`,
    description: 'Architectural studies for a luxury hill hotel in Nathiagali.'
  });
}

export default function DesignPage() {
  return (
    <main className="min-h-screen bg-charcoal text-stone">
      <DesignJsonLd />
      <SubpageHeader />
      <SubpageHero eyebrow="Architecture" title="Three studies for a mountain hotel in progress.">
        Early directions explore how the property can meet ridge, weather, and view — before final renders and photography arrive.
      </SubpageHero>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 md:px-8 md:grid-cols-3">
        {concepts.map((concept) => <StudioCard key={concept.title} className="p-5"><div className="mb-6 h-72 overflow-hidden rounded-[24px] border border-stone/10 bg-charcoal/45"><StudyDrawing /></div><SectionEyebrow>{concept.meta}</SectionEyebrow><h2 className="font-serif text-4xl leading-none">{concept.title}</h2><p className="mt-5 leading-7 text-muted">{concept.text}</p></StudioCard>)}
      </section>
      <SubpageCTA title="See how the architecture becomes a stay." text="Move from design studies into room tiers, availability, and opening-season inquiries." href="/rooms" label="Explore rooms" />
      <SubpageFooter />
    </main>
  );
}
