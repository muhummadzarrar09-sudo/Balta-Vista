'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback, memo, lazy, Suspense } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { AirVent, ChevronDown, Eye, MapPin, MessageCircle, Snowflake, Star, Tv, Volume2, VolumeX, Wifi } from 'lucide-react';
import { BrandMark, Button, SectionEyebrow, SectionTitle, StudioCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { HomepageBookingTeaser } from '@/components/homepage-booking-teaser';

const navLinks = [
  { href: '/rooms', label: 'Rooms' },
  { href: '/experience', label: 'Experience' },
  { href: '/location', label: 'Location' },
  { href: '/design', label: 'Design' },
  { href: '/booking/status', label: 'My Booking' }
];

const concepts = [
  ['Ridge Massing Study', 'Terraced pine-facing suites stepping gently with the ridge line.', 'Stone base · timber roofline · valley glass'],
  ['Courtyard Arrival Study', 'A warmer lodge language for winter arrivals, covered drop-off, and bonfire nights.', 'Arrival court · hearth lobby · sheltered service'],
  ['Panorama Deck Study', 'A glass-lined viewing structure designed around sunrise breakfasts and valley-facing evenings.', 'Viewing deck · warm glazing · horizon line']
];

const rooms = [
  {
    id: 'single' as const,
    name: 'Single Bedroom',
    image: '/assets/rooms/room-single-luxury.jpg',
    rate: 85000,
    price: 'PKR 85,000 / night',
    desc: 'A quiet mountain-facing retreat for solo guests or business stays. Warm timber, heated comfort, and morning pine views.'
  },
  {
    id: 'double' as const,
    name: 'Double Bedroom',
    image: '/assets/rooms/room-double-luxury.jpg',
    rate: 105000,
    price: 'PKR 105,000 / night',
    desc: 'A spacious hill-station room for couples or small families, balancing privacy, view, and generous lounge comfort.'
  },
  {
    id: 'suite' as const,
    name: 'Signature Suite',
    image: '/assets/rooms/room-suite-luxury.jpg',
    rate: 165000,
    price: 'PKR 165,000 / night',
    desc: 'Our flagship suite with a cinematic valley window, separate sitting area, elevated amenities, and reserved hosting touches.'
  }
];

const experiences = [
  ['Snowfall arrivals', 'Winter days framed by heated interiors, brass light, and quiet pine-covered slopes.', '/assets/experience/experience-snowfall-nathiagali.jpg', Snowflake],
  ['Green season trails', 'Step out toward forest walks, ridge viewpoints, and misty monsoon mornings.', '/assets/experience/experience-trails-nathiagali.jpg', Eye],
  ['Bonfire evenings', 'Slow dinners, local kahwa, ember-lit conversations, and crisp Nathiagali nights.', '/assets/experience/experience-bonfire-nathiagali.jpg', Star]
];

const faqs = [
  ['What is the nightly rate?', 'Opening inquiries are full-rate only. Single Bedroom starts at PKR 85,000, Double Bedroom at PKR 105,000, and Signature Suite at PKR 165,000 per night.'],
  ['Is payment collected online?', 'Online payment is not enabled for opening inquiries. The hotel team confirms availability and next steps directly with each guest.'],
  ['Do all rooms include TV and AC?', 'Yes. TV, AC/heating comfort, WiFi, and a view-led experience are baseline expectations across all tiers.'],
  ['What are check-in and check-out times?', 'Placeholder operating policy: check-in from 2:00 PM and check-out by 12:00 PM. Final timings can be refined before launch.'],
  ['How is road access in snow season?', 'Access is weather-dependent. We recommend confirming road conditions through WhatsApp before travelling during snowfall.'],
  ['Is parking available?', 'Yes, managed arrival and parking guidance can be confirmed directly with your inquiry.'],
  ['Can families book the Suite?', 'Yes. The Signature Suite is positioned for couples or small families who want a separate sitting area and the strongest valley-view experience.'],
  ['Where will guest feedback appear?', 'Verified guest feedback will be reflected on the reviews page after opening-season stays begin.']
];

const stats = [
  { value: 2410, suffix: ' m', label: 'approx. Nathiagali elevation' },
  { value: 86, suffix: ' km', label: 'from Islamabad by road' },
  { value: 18, suffix: '', label: 'intimate opening keys' },
  { value: 2026, suffix: '', label: 'first season target' }
];

const routeStops = [
  ['Islamabad / Rawalpindi', 'Start early for a calmer hill approach and flexible weather buffer.'],
  ['Murree ridge road', 'Expect traffic variation during weekends, snowfall, and school holidays.'],
  ['Nathiagali arrival', 'The hotel team confirms final road conditions before winter travel.']
];

const nearbyPlaces = [
  ['Dunga Gali pipeline walk', 'Forest trail'],
  ['Mushkpuri approach', 'Viewpoint'],
  ['Ayubia National Park', 'Nature reserve'],
  ['Murree interchange', 'Route marker']
];

// ─── Lazy-load heavy animation module ───
async function initAnimations() {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return gsap;
}

async function initLenis() {
  const [{ default: Lenis }] = await Promise.all([import('lenis')]);
  return Lenis;
}

async function initSplitType() {
  const [{ default: SplitType }] = await Promise.all([import('split-type')]);
  return SplitType;
}

// ─── Prefetch routes on idle ───
function prefetchKeyRoutes() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const routes = ['/booking', '/rooms', '/experience', '/location', '/design', '/booking/status'];
      routes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const desktopNavRef = useRef<HTMLElement>(null);
  const hasIndicatorPosition = useRef(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false, animated: false });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const nav = document.querySelector('[data-nav]');
    const onScroll = () => {
      const y = window.scrollY;
      nav?.classList.toggle('nav-solid', y > window.innerHeight * 0.68);
      nav?.classList.toggle('-translate-y-full', y > lastY && y > 180);
      lastY = y;
      const sections = ['rooms', 'experience', 'location', 'contact'];
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.45 && rect.bottom > window.innerHeight * 0.45;
      });
      if (current) setActive(current);
    };
    let lastY = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!active || !desktopNavRef.current) return;
    const updateIndicator = () => {
      const nav = desktopNavRef.current;
      const link = nav?.querySelector(`[data-nav-link="${active}"]`);
      if (!nav || !link) return;
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      setIndicator({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        visible: true,
        animated: hasIndicatorPosition.current
      });
      hasIndicatorPosition.current = true;
    };
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [active]);

  return (
    <>
      <nav data-nav className="fixed left-0 top-0 z-40 w-full transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <BrandMark className="h-10 w-10" />
            <span className="hidden font-serif text-xl text-stone md:inline">Balta Vista</span>
          </Link>
          <nav ref={desktopNavRef} className="relative hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-nav-link={link.label.toLowerCase().replace(' ', '_')}
                prefetch={true}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-stone/70 transition hover:text-stone"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              prefetch={true}
              className="magnetic rounded-full bg-brass px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-charcoal shadow-brass"
            >
              Book Now
            </Link>
          </nav>
          <button onClick={() => setOpen(true)} className="md:hidden rounded-full border border-stone/15 px-4 py-2 text-xs uppercase tracking-[0.22em]">Menu</button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-charcoal/98 backdrop-blur-lg">
          <div className="mx-auto flex h-full max-w-7xl flex-col px-5 py-5 md:px-8">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3"><BrandMark className="h-11 w-11" /><span className="font-serif text-2xl">Balta Vista</span></span>
              <button onClick={() => setOpen(false)} className="rounded-full border border-stone/15 px-4 py-2">Close</button>
            </div>
            <div className="mt-20 grid gap-7 font-serif text-5xl text-stone">
              {[...navLinks, { href: '/booking', label: 'Book Now' }].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} prefetch={true}>{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AmbientSoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<{ context: AudioContext; source: AudioBufferSourceNode; gain: GainNode; filter: BiquadFilterNode } | null>(null);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.08);
    setTimeout(() => { try { audio.source.stop(); } catch {} void audio.context.close(); }, 180);
    audioRef.current = null;
    setEnabled(false);
  }, []);

  const start = useCallback(async () => {
    if (audioRef.current) return stop();
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtor) return;
    const context = new AudioCtor();
    const seconds = 2;
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.32;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    gain.gain.value = 0;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    gain.gain.setTargetAtTime(0.018, context.currentTime, 0.22);
    audioRef.current = { context, source, gain, filter };
    setEnabled(true);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return (
    <button
      onClick={enabled ? stop : start}
      className="magnetic absolute bottom-10 left-5 z-20 hidden items-center gap-3 rounded-full border border-stone/12 bg-charcoal/42 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-stone/70 backdrop-blur transition hover:border-brass/40 hover:text-brass md:flex"
    >
      {enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      {enabled ? 'Ambient on' : 'Ambient off'}
    </button>
  );
}

// ─── Memoized section components ───
const Hero = memo(function Hero() {
  return (
    <section id="hero" className="relative flex h-[112vh] min-h-[760px] items-center justify-center overflow-hidden bg-charcoal">
      <Image data-hero-layer="0.03" src="/assets/hero/hero-sky.svg" alt="Mountain atmosphere sky gradient" fill priority className="object-cover" />
      <Image data-hero-layer="0.10" src="/assets/hero/luxury-hero-nathiagali.jpg" alt="Luxury mountain hotel glowing above the pine valleys of Nathiagali" fill priority quality={85} sizes="100vw" className="object-cover" />
      <Image data-hero-layer="0.22" src="/assets/hero/hero-mountains.svg" alt="Layered Nathiagali mountain atmosphere" fill priority className="object-cover opacity-25 mix-blend-multiply" />
      <div data-hero-layer="0.36" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_0,rgba(17,19,15,.18)_35%,rgba(17,19,15,.82)_100%)]" />
      <Image data-hero-layer="0.48" src="/assets/hero/hero-hotel.svg" alt="Hotel architectural silhouette" fill priority className="object-cover opacity-[.18] mix-blend-screen" />
      <Image data-hero-layer="0.58" src="/assets/hero/hero-forest.svg" alt="Dark pine foreground silhouette" fill priority className="object-cover opacity-[.72]" />
      <div className="hero-vignette absolute inset-0" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="max-w-5xl text-left">
          <p className="mb-6 w-fit border-b border-brass/35 pb-3 text-xs font-semibold uppercase tracking-[0.38em] text-sage">Opening in Nathiagali, KPK</p>
          <h1 id="hero-title" className="hero-title font-serif text-[4.35rem] leading-[0.82] tracking-[-0.075em] text-stone md:text-[8.8rem] lg:text-[11.2rem]">A quieter kind of luxury above the pines.</h1>
          <div className="mt-8 grid max-w-4xl gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl text-lg leading-8 text-stone/78 md:text-xl">A warm, cinematic hill-station retreat shaped for mountain air, winter light, and unhurried stays.</p>
            <Button asChild size="lg" variant="secondary" className="border-brass/35 bg-charcoal/30 text-brass backdrop-blur hover:bg-brass/10">
              <Link href="/booking" prefetch={true}>Reserve the first season</Link>
            </Button>
          </div>
        </div>
      </div>
      <AmbientSoundToggle />
      <div className="absolute bottom-10 left-1/2 z-10 grid -translate-x-1/2 place-items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-stone/55"><span>Scroll</span><span className="block h-14 w-px overflow-hidden bg-stone/16"><span className="block h-5 w-px animate-pulse bg-brass" /></span></div>
    </section>
  );
});

const WireframeBox = memo(function WireframeBox({ label }: { label: string }) {
  return (
    <div className="wireframe relative h-64 overflow-hidden rounded-[22px] border border-stone/10 bg-charcoal/50 p-5">
      <svg viewBox="0 0 360 230" className="h-full w-full opacity-95">
        <defs>
          <linearGradient id={`${label}g`} x1="0" x2="1"><stop stopColor="#c08b3e"/><stop offset="1" stopColor="#9aaa82"/></linearGradient>
          <pattern id={`${label}grid`} width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#eadcc4" strokeOpacity=".055"/></pattern>
        </defs>
        <rect width="360" height="230" fill={`url(#${label}grid)`} />
        <path d="M22 184 C70 160 112 196 160 174 C214 150 236 188 320 142" fill="none" stroke="#9aaa82" strokeOpacity=".13" />
        <path d="M18 202 C72 178 118 212 174 190 C226 170 260 198 334 164" fill="none" stroke="#9aaa82" strokeOpacity=".10" />
        <path d="M85 165 L190 104 L282 154 L174 214 Z" fill="rgba(192,139,62,.035)" stroke="#eadcc4" strokeOpacity=".58" />
        <path d="M85 165 V82 L190 26 V104" fill="none" stroke="#eadcc4" strokeOpacity=".34" />
        <path d="M282 154 V72 L190 26" fill="none" stroke="#eadcc4" strokeOpacity=".34" />
        <path d="M174 214 V128 L85 82 M174 128 L282 72" fill="none" stroke="#c08b3e" strokeOpacity=".62" />
        <path d="M112 150 L198 103 L248 130" fill="none" stroke="#9aaa82" strokeOpacity=".45" strokeDasharray="4 5" />
        <path d="M128 174 L214 126 L260 148" fill="none" stroke="#9aaa82" strokeOpacity=".28" strokeDasharray="4 5" />
        <path d="M40 190 H105 M40 190 V130 M40 190 L85 214" stroke={`url(#${label}g)`} strokeWidth="3" fill="none"/>
        <text x="110" y="195" fill="#c08b3e" fontSize="12">X</text><text x="28" y="126" fill="#9aaa82" fontSize="12">Y</text><text x="88" y="224" fill="#b78963" fontSize="12">Z</text>
        <text x="216" y="45" fill="#eadcc4" fillOpacity=".52" fontSize="10" letterSpacing="2">VALLEY FACE</text>
        <text x="56" y="74" fill="#c08b3e" fillOpacity=".65" fontSize="10" letterSpacing="2">STONE BASE</text>
        <text x="206" y="178" fill="#9aaa82" fillOpacity=".62" fontSize="10" letterSpacing="2">CONTOUR</text>
      </svg>
      <span className="absolute left-5 top-5 rounded-full border border-brass/30 bg-charcoal/45 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-brass backdrop-blur">Massing study</span>
      <span className="absolute bottom-5 right-5 rounded-full border border-stone/10 bg-stone/6 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted">Studio board</span>
    </div>
  );
});

const DesignConcepts = memo(function DesignConcepts() {
  return (
    <section id="concepts" className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <SectionEyebrow>Architect Concepts</SectionEyebrow>
      <SectionTitle>Architectural studies before the final reveal.</SectionTitle>
      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <p className="max-w-2xl text-lg leading-8 text-muted">Early massing directions for a mountain hotel shaped by ridge lines, winter arrival, and valley-facing glass.</p>
        <Button asChild variant="secondary"><Link href="/design" prefetch={true}>Explore design studies</Link></Button>
      </div>
      <div data-card-grid className="mt-12 grid gap-5 md:grid-cols-3">
        {concepts.map(([title, text, meta]) => (
          <StudioCard key={title} className="concept-card">
            <WireframeBox label={title}/>
            <h3 className="mt-6 font-serif text-3xl">{title}</h3>
            <p className="mt-3 leading-7 text-muted">{text}</p>
            <p className="mt-5 rounded-full border border-brass/20 bg-brass/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brass">{meta}</p>
          </StudioCard>
        ))}
      </div>
    </section>
  );
});

const ArchitectureTeaser = memo(function ArchitectureTeaser() {
  return (
    <section id="architecture" className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <StudioCard className="grid items-center gap-8 overflow-hidden p-5 md:grid-cols-[.9fr_1.1fr] md:p-8">
        <div className="order-2 md:order-1">
          <SectionEyebrow>Architecture</SectionEyebrow>
          <h2 className="max-w-3xl font-serif text-5xl leading-[0.96] text-stone md:text-7xl">Architecture shaped by ridge, weather, and view.</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">The early studies explore stone base, timber roofline, winter arrival, and valley-facing glass — a quieter mountain house before the final reveal.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link href="/design" prefetch={true}>Explore design studies</Link></Button>
            <Button asChild variant="secondary"><Link href="/rooms" prefetch={true}>View rooms</Link></Button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <WireframeBox label="Architecture Teaser" />
        </div>
      </StudioCard>
    </section>
  );
});

const StatsBar = memo(function StatsBar() {
  return (
    <section aria-label="Property highlights" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <StudioCard key={stat.label} className="px-6 py-7">
            <p className="stat-number text-5xl text-brass md:text-6xl">{stat.value}{stat.suffix}</p>
            <p className="mt-2 text-sm leading-5 text-muted">{stat.label}</p>
          </StudioCard>
        ))}
      </div>
    </section>
  );
});

const RoomsPinned = memo(function RoomsPinned() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const h = (e: Event) => setActive((e as CustomEvent).detail);
    window.addEventListener('roomIndex', h);
    return () => window.removeEventListener('roomIndex', h);
  }, []);
  const jump = useCallback((i: number) => {
    setActive(i);
    const top = sectionRef.current?.offsetTop ?? 0;
    window.scrollTo({ top: top + window.innerHeight * 0.72 * i + 8, behavior: 'smooth' });
  }, []);
  const room = rooms[active];

  return (
    <section id="rooms" ref={sectionRef} className="rooms-pin relative min-h-screen overflow-hidden bg-pine/40 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 md:px-8">
        <div className="relative min-h-[460px] overflow-hidden rounded-[24px] md:min-h-[600px]">
          <Image src={room.image} alt={room.name} fill quality={85} sizes="(min-width: 768px) 46vw, 100vw" className="room-visual object-cover" priority={active === 0} />
          <div className="absolute bottom-5 left-5 rounded-full border border-brass/30 bg-charcoal/55 px-4 py-2 text-xs uppercase tracking-[0.22em] text-brass backdrop-blur">{room.price}</div>
        </div>
        <div className="room-copy flex flex-col justify-center p-2 md:p-8">
          <SectionEyebrow>Rooms & Suites</SectionEyebrow>
          <h2 className="font-serif text-5xl leading-none text-stone md:text-7xl">{room.name}</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{room.desc}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link href={`/booking?room=${room.id}`} prefetch={true}>Book this room</Link></Button>
            <Button asChild variant="secondary"><Link href="/rooms" prefetch={true}>View all rooms</Link></Button>
          </div>
          <div className="mt-8 flex gap-3">
            {rooms.map((r, i) => (
              <button key={r.id} onClick={() => jump(i)} aria-label={`Jump to ${r.name}`} className={cn('h-1.5 w-14 rounded-full bg-stone/18 transition', active === i && 'bg-brass')} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

const Experience = memo(function Experience() {
  const [feature, ...supporting] = experiences;
  const [featureTitle, featureText, featureImage, FeatureIcon] = feature;
  const FIcon = FeatureIcon as typeof Star;

  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <SectionEyebrow>Experience Nathiagali</SectionEyebrow>
      <SectionTitle>Not just a room. A season in the mountains.</SectionTitle>
      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <p className="max-w-2xl text-lg leading-8 text-muted">The property is positioned around place: snowfall weekends, green-season walks, pine-scented breakfasts, and evenings designed to slow the city down.</p>
        <Button asChild variant="secondary"><Link href="/experience" prefetch={true}>Explore the experience</Link></Button>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-[1.15fr_.85fr]">
        <div className="relative min-h-[520px] overflow-hidden rounded-[24px] md:min-h-[620px]">
          <Image src={featureImage as string} alt={featureTitle as string} fill quality={85} sizes="(min-width: 768px) 56vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brass"><FIcon size={14} /> Seasonal signature</p>
            <h3 className="font-serif text-4xl leading-tight text-stone md:text-5xl">{featureTitle as string}</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone/80">{featureText as string}</p>
          </div>
        </div>
        <div className="grid gap-4">
          {supporting.map(([title, text, image, Icon]) => {
            const I = Icon as typeof Star;
            return (
              <div key={title as string} className="group relative min-h-56 overflow-hidden rounded-[22px]">
                <Image src={image as string} alt={title as string} fill quality={80} sizes="(min-width: 768px) 40vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <I className="mb-2 text-brass" size={18} />
                  <h3 className="font-serif text-2xl text-stone">{title as string}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{text as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

const VisualMoodboard = memo(function VisualMoodboard() {
  const images = [
    { src: '/assets/hero/luxury-hero-nathiagali.jpg', label: 'Ridge arrival', className: 'md:col-span-2 md:row-span-2' },
    { src: '/assets/experience/experience-bonfire-nathiagali.jpg', label: 'Bonfire terrace', className: '' },
    { src: '/assets/rooms/room-suite-luxury.jpg', label: 'Suite atmosphere', className: '' }
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionEyebrow>Opening Atmosphere</SectionEyebrow>
      <SectionTitle>A first look at the mood of the mountain house.</SectionTitle>
      <div className="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {images.map((image) => (
          <div key={image.label} className={`group relative min-h-64 overflow-hidden rounded-[24px] ${image.className}`}>
            <Image src={image.src} alt={image.label} fill quality={80} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 font-serif text-2xl text-stone">{image.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

const TrustAndStory = memo(function TrustAndStory() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <div className="grid gap-8 md:grid-cols-[.9fr_1.1fr] md:items-center">
        <div className="order-2 md:order-1">
          <SectionEyebrow>Owner hospitality mood</SectionEyebrow>
          <div className="flex gap-3 mb-6">
            {['A', 'H', 'S', 'B'].map((letter) => (
              <span key={letter} className="flex h-12 w-12 items-center justify-center rounded-full border border-brass/20 bg-brass/10 font-serif text-lg text-brass">{letter}</span>
            ))}
          </div>
          <SectionTitle>Built for guests who come here to breathe.</SectionTitle>
          <p className="mt-6 text-lg leading-8 text-muted">We are shaping Balta Vista as a personal mountain house at hotel scale: fewer distractions, warmer service, and spaces that respect the weather, forest, and silence of Nathiagali.</p>
          <p className="mt-6 text-sm leading-6 text-muted italic">Every detail is being shaped around warmth, privacy, and the quiet rhythm of the hills.</p>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted">— The Founding Family</p>
        </div>
        <div className="relative order-1 min-h-[430px] overflow-hidden rounded-[24px] md:order-2">
          <Image src="/assets/story/owner-lounge-placeholder.jpg" alt="Warm owner lounge for Balta Vista" fill quality={85} sizes="420px" className="object-cover" />
          <p className="absolute bottom-5 left-5 rounded-full border border-brass/30 bg-charcoal/55 px-4 py-2 text-xs uppercase tracking-[0.22em] text-brass backdrop-blur">Owner hospitality mood</p>
        </div>
      </div>
    </section>
  );
});

const FAQ = memo(function FAQ() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 md:px-8">
      <SectionEyebrow>FAQ</SectionEyebrow>
      <SectionTitle>Answers before WhatsApp gets crowded.</SectionTitle>
      <Accordion.Root type="single" collapsible className="mt-10 grid gap-3">
        {faqs.map(([q, a], i) => (
          <Accordion.Item key={q} value={`item-${i}`} className="group rounded-[26px] border border-stone/12 bg-card-gradient px-4 shadow-soft transition data-[state=open]:border-brass/35 data-[state=open]:bg-brass/8">
            <Accordion.Trigger className="flex w-full items-center justify-between gap-5 py-5 text-left">
              <span className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass/20 bg-brass/10 font-serif text-lg text-brass">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif text-2xl leading-tight text-stone">{q}</span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone/10 bg-stone/6 text-brass transition group-data-[state=open]:rotate-180 group-data-[state=open]:border-brass/30 group-data-[state=open]:bg-brass/10">
                <ChevronDown className="h-4 w-4" />
              </span>
            </Accordion.Trigger>
            <Accordion.Content className="px-14 pb-6 leading-7 text-muted">{a}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
});

const LocationTeaser = memo(function LocationTeaser() {
  const mapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

  return (
    <section id="location" className="relative overflow-hidden px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-5 md:grid-cols-[.75fr_1.25fr] md:items-end">
          <div>
            <SectionEyebrow>Getting here</SectionEyebrow>
            <SectionTitle>A journey into the pine belt.</SectionTitle>
          </div>
          <p className="text-base leading-7 text-muted md:pb-3">The approach through Murree into the pine belt sets the tone before arrival. The hotel team offers road guidance for snowfall and busy weekends.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-stone/10 bg-charcoal/30 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Travel notes</p>
            <div className="mt-6 space-y-5">
              {routeStops.map(([place, note]) => (
                <div key={place as string} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brass/20 bg-brass/10 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-brass" />
                  </span>
                  <div>
                    <p className="font-serif text-xl text-stone">{place as string}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{note as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-stone/10 bg-charcoal/30 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Nearby</p>
            <p className="mt-5 text-sm leading-6 text-muted">The hotel sits within reach of Nathiagali&apos;s most familiar ridge walks and forest approaches.</p>
            <div className="mt-6 space-y-3">
              {nearbyPlaces.map(([place, type]) => (
                <div key={place as string} className="flex items-center justify-between rounded-[16px] border border-stone/10 bg-stone/6 px-4 py-3">
                  <p className="font-serif text-xl text-stone">{place as string}</p>
                  <span className="rounded-full border border-stone/12 bg-charcoal/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{type as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="map-shell relative min-h-72 overflow-hidden rounded-[24px] md:min-h-full">
            {mapUrl ? (
              <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Balta Vista location" />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <div>
                  <MapPin size={32} className="mx-auto text-brass/50" />
                  <p className="mt-4 font-serif text-xl text-stone/60">Map view coming soon</p>
                  <p className="mt-2 text-xs leading-6 text-muted">The property pin will appear here once the final location is confirmed.</p>
                  <span className="mt-4 inline-block rounded-full bg-brass/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-brass">Branded pin ready</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

const Footer = memo(function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-stone/10 px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[26px] border border-stone/10 bg-charcoal/42 p-6 md:p-8">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brass/10 blur-3xl" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <BrandMark className="h-12 w-12 rounded-[18px]" />
                <p className="mt-4 font-serif text-5xl leading-none text-stone md:text-7xl">Balta Vista</p>
                <p className="mt-2 text-sm text-muted">Nathiagali, Khyber Pakhtunkhwa</p>
              </div>
              <div className="mt-8 flex gap-3">
                <Button asChild size="sm"><Link href="/booking" prefetch={true}>Book now</Link></Button>
                <Button asChild size="sm" variant="secondary">
                  <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} target="_blank" rel="noreferrer">WhatsApp</a>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-muted">Navigate</p>
            <div className="grid gap-2">
              {[['Home', '/'], ...navLinks.map(l => [l.label, l.href]), ['Booking', '/booking'], ['Check Status', '/booking/status']].map(([label, href]) => (
                <Link key={label as string} href={href as string} prefetch={true} className="group flex items-center justify-between rounded-2xl border border-stone/8 bg-stone/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted transition hover:border-brass/30 hover:text-brass">
                  {label as string}
                  <span className="text-stone/20 transition group-hover:text-brass/50">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-muted">Contact</p>
            <div className="space-y-4">
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-stone/8 bg-stone/5 px-4 py-3 text-sm text-muted transition hover:border-brass/30 hover:text-brass">
                <MessageCircle size={16} className="text-brass" /> WhatsApp
              </a>
              <a href="/booking" className="flex items-center gap-3 rounded-2xl border border-stone/8 bg-stone/5 px-4 py-3 text-sm text-muted transition hover:border-brass/30 hover:text-brass">
                <MapPin size={16} className="text-brass" /> Booking inquiry
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-stone/10 pt-5 text-sm text-muted md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Balta Vista Nathiagali. Opening preview.</p>
          <p className="text-xs text-muted/50">Crafted with warmth for the hills.</p>
        </div>
      </div>
    </footer>
  );
});

const FloatingWhatsApp = memo(function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=${encodeURIComponent('Hi, I would like to inquire about Balta Vista Nathiagali.')}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brass text-charcoal shadow-brass transition hover:bg-amber-soft md:bottom-8 md:right-8"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
});

const PolishOverlay = memo(function PolishOverlay() {
  return <div className="pointer-events-none fixed inset-0 z-[99] opacity-[0.035] mix-blend-soft-light" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\' viewBox=\'0 0 180 180\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.82\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'180\' height=\'180\' filter=\'url(%23n)\' opacity=\'.65\'/%3E%3C/svg%3E")' }} />;
});

function LoaderAndInit() {
  const [showLoader, setShowLoader] = useState(true);
  const initDone = useRef(false);

  useEffect(() => {
    // 1. Hide the loader after 1.5s — pure CSS, no GSAP dependency
    const hideTimer = setTimeout(() => setShowLoader(false), 1500);

    // 2. Prefetch key routes on idle
    prefetchKeyRoutes();

    // 3. Init GSAP in the background (non-blocking)
    if (!initDone.current) {
      initDone.current = true;
      initAnimations().then((gsap) => {
        // GSAP loaded — wire up lenis + scroll animations
        initLenis().then((LenisMod) => {
          const lenis = new LenisMod({ lerp: 0.08, smoothWheel: true });
          gsap.ticker.add((time: number) => lenis?.raf(time * 1000));
          gsap.ticker.lagSmoothing(0);
        }).catch(() => {});

        // Hero split text
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
          import('split-type').then(({ default: SplitType }) => {
            const split = new SplitType(heroTitle, { types: 'words' });
            if (split.words?.length) {
              gsap.set(split.words, { yPercent: 70, opacity: 0 });
              gsap.to(split.words, {
                yPercent: 0, opacity: 1, duration: 0.7,
                stagger: 0.028, ease: 'power3.out', delay: 0.3,
              });
            }
          }).catch(() => {});
        }

        // Parallax layers
        gsap.utils.toArray<HTMLElement>('[data-hero-layer]').forEach((layer) => {
          gsap.to(layer, {
            yPercent: Number(layer.dataset.heroLayer) * 100,
            scale: 1.06, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
          });
        });

        // Reveal animations
        gsap.utils.toArray<HTMLElement>('.section-eyebrow').forEach((eyebrow) => {
          gsap.fromTo(eyebrow, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: eyebrow, start: 'top 88%', once: true } });
        });

        gsap.utils.toArray<HTMLElement>('[data-card-grid]').forEach((grid) => {
          const cards = gsap.utils.toArray<HTMLElement>(grid.querySelectorAll('.studio-card'));
          if (!cards.length) return;
          gsap.fromTo(cards, { y: 34, autoAlpha: 0.72 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: grid, start: 'top 88%', once: true } });
        });

        gsap.utils.toArray<HTMLElement>('.studio-card').filter((card: HTMLElement) => !card.closest('[data-card-grid]')).forEach((card: HTMLElement) => {
          gsap.fromTo(card, { y: 34, autoAlpha: 0.72 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
        });

        gsap.utils.toArray<HTMLElement>('.concept-card').forEach((card) => {
          gsap.fromTo(card, { y: 40, autoAlpha: 0.6 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
        });

        gsap.utils.toArray<HTMLElement>('.stat-number').forEach((stat) => {
          gsap.fromTo(stat, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: stat, start: 'top 90%', once: true } });
        });

        // Pinned rooms
        const roomsSection = document.querySelector('.rooms-pin');
        if (roomsSection) {
          import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
            const roomImages = gsap.utils.toArray<HTMLElement>('.room-visual');
            const roomCopy = gsap.utils.toArray<HTMLElement>('.room-copy');
            const indicators = roomsSection.querySelectorAll('button');
            const total = 3;

            ScrollTrigger.create({
              trigger: roomsSection,
              start: 'top top',
              end: `+=${total * 100}%`,
              pin: true, pinSpacing: true,
              onUpdate: (self: any) => {
                const index = Math.min(total - 1, Math.floor(self.progress * total));
                window.dispatchEvent(new CustomEvent('roomIndex', { detail: index }));
              }
            });

            roomImages.forEach((img, i) => {
              ScrollTrigger.create({
                trigger: roomsSection,
                start: `top+=${(i / total) * 100}% top`,
                end: `top+=${((i + 1) / total) * 100}% top`,
                onEnter: () => {
                  gsap.set(roomImages, { autoAlpha: 0 });
                  gsap.set(roomCopy, { autoAlpha: 0 });
                  gsap.set(roomImages[i], { autoAlpha: 1 });
                  gsap.set(roomCopy[i], { autoAlpha: 1 });
                  indicators.forEach((dot, j) => dot.classList.toggle('bg-brass', j === i));
                },
                onEnterBack: () => {
                  gsap.set(roomImages, { autoAlpha: 0 });
                  gsap.set(roomCopy, { autoAlpha: 0 });
                  gsap.set(roomImages[i], { autoAlpha: 1 });
                  gsap.set(roomCopy[i], { autoAlpha: 1 });
                  indicators.forEach((dot, j) => dot.classList.toggle('bg-brass', j === i));
                }
              });
            });

            gsap.set(roomImages.filter((_: HTMLElement, i: number) => i !== 0), { autoAlpha: 0 });
            gsap.set(roomCopy.filter((_: HTMLElement, i: number) => i !== 0), { autoAlpha: 0 });
          }).catch(() => {});
        }

        // Progress bar
        gsap.to('.scroll-progress-bar', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true } });
      }).catch(() => {
        // GSAP failed — no problem, site still works without animations
      });
    }

    return () => clearTimeout(hideTimer);
  }, []);

  return (
    <>
      {showLoader && (
        <>
          <div className="brand-loader fixed inset-0 z-[80] flex items-center justify-center bg-charcoal">
            <div className="grid place-items-center gap-5 px-6 text-center animate-loader-fade">
              <div className="brand-loader-mark"><BrandMark className="h-16 w-16 rounded-[24px]" /></div>
              <div className="loader-word font-serif text-5xl leading-none text-brass md:text-6xl">Balta Vista</div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sage">Nathiagali · opening preview</p>
              <div className="loader-route-line" />
            </div>
          </div>
          <div className="route-wipe fixed inset-0 z-[79] flex items-center justify-center"><div className="font-serif text-4xl text-brass">Balta Vista</div></div>
        </>
      )}
      <div className="cursor-ring" />
    </>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    prefetchKeyRoutes();
  }, []);

  // Don't render full content until animations are ready
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-charcoal text-stone">
      {mounted && (
        <>
          <PolishOverlay />
          <Navigation />
          <Hero />
          <ArchitectureTeaser />
          <RoomsPinned />
          <Experience />
          <TrustAndStory />
          <HomepageBookingTeaser />
          <LocationTeaser />
          <Footer />
          <FloatingWhatsApp />
        </>
      )}
      <LoaderAndInit />
      <div className="scroll-progress-bar fixed left-0 top-0 z-50 h-[3px] w-full origin-left scale-x-0 bg-brass" />
      <div id="contact" />
    </main>
  );
}
