'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Accordion from '@radix-ui/react-accordion';
import { AirVent, ChevronDown, Eye, MapPin, MessageCircle, Snowflake, Star, Tv, Volume2, VolumeX, Wifi } from 'lucide-react';
import { BookingFormValues, BookingInput, bookingSchema } from '@/lib/booking-schema';
import { Button, SectionEyebrow, SectionTitle, StudioCard } from '@/components/ui';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#rooms', label: 'Rooms' },
  { href: '#experience', label: 'Experience' },
  { href: '#location', label: 'Location' },
  { href: '#contact', label: 'Contact' }
];

const concepts = [
  ['Design Concept 01', 'Terraced pine-facing suites stepping gently with the ridge line.'],
  ['Design Concept 02', 'A warmer courtyard lodge language for winter arrivals and bonfire nights.'],
  ['Design Concept 03', 'A glass-lined viewing deck structure designed around the valley panorama.']
];

const rooms = [
  {
    id: 'single' as const,
    name: 'Single Bedroom',
    image: '/assets/rooms/room-single-luxury.png',
    rate: 85000,
    price: 'PKR 85,000 / night',
    desc: 'A quiet mountain-facing retreat for solo guests or business stays. Warm timber, heated comfort, and morning pine views.'
  },
  {
    id: 'double' as const,
    name: 'Double Bedroom',
    image: '/assets/rooms/room-double-luxury.png',
    rate: 105000,
    price: 'PKR 105,000 / night',
    desc: 'A spacious hill-station room for couples or small families, balancing privacy, view, and generous lounge comfort.'
  },
  {
    id: 'suite' as const,
    name: 'Signature Suite',
    image: '/assets/rooms/room-suite-luxury.png',
    rate: 165000,
    price: 'PKR 165,000 / night',
    desc: 'Our flagship suite with a cinematic valley window, separate sitting area, elevated amenities, and reserved hosting touches.'
  }
];

const experiences = [
  ['Snowfall arrivals', 'Winter days framed by heated interiors, brass light, and quiet pine-covered slopes.', '/assets/experience/experience-snowfall-nathiagali.png', Snowflake],
  ['Green season trails', 'Step out toward forest walks, ridge viewpoints, and misty monsoon mornings.', '/assets/experience/experience-trails-nathiagali.png', Eye],
  ['Bonfire evenings', 'Slow dinners, local kahwa, ember-lit conversations, and crisp Nathiagali nights.', '/assets/experience/experience-bonfire-nathiagali.png', Star]
];

const faqs = [
  ['What is the nightly rate?', 'This MVP shows full-rate booking only. Single Bedroom starts at PKR 85,000, Double Bedroom at PKR 105,000, and Signature Suite at PKR 165,000 per night.'],
  ['Is payment collected online?', 'Not yet. Payment and deposit logic are intentionally out of scope for this MVP; inquiries are confirmed directly by the hotel team.'],
  ['Do all rooms include TV and AC?', 'Yes. TV, AC/heating comfort, WiFi, and a view-led experience are baseline expectations across all tiers.'],
  ['What are check-in and check-out times?', 'Placeholder operating policy: check-in from 2:00 PM and check-out by 12:00 PM. Final timings can be refined before launch.'],
  ['How is road access in snow season?', 'Access is weather-dependent. We recommend confirming road conditions through WhatsApp before travelling during snowfall.'],
  ['Is parking available?', 'Yes, on-site/managed parking is planned and will be confirmed in operational details before opening.'],
  ['Can families book the Suite?', 'Yes. The Signature Suite is positioned for couples or small families who want a separate sitting area and the strongest valley-view experience.'],
  ['Is this connected to Google reviews yet?', 'Not yet. The review system is structured for a later Google Places or CMS integration once the property is operational.']
];

const stats = [
  { value: 2410, suffix: 'm', label: 'approx. Nathiagali elevation' },
  { value: 86, suffix: 'km', label: 'from Islamabad' },
  { value: 18, suffix: '', label: 'planned keys for opening' },
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

function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const nav = document.querySelector('[data-nav]');
    let lastY = window.scrollY;
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
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header data-nav className="fixed left-0 right-0 top-0 z-50 border-b border-stone/0 bg-charcoal/0 transition-all duration-500 [&.nav-solid]:border-stone/10 [&.nav-solid]:bg-charcoal/78 [&.nav-solid]:backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#hero" className="font-serif text-xl tracking-wide text-stone">Pine & Peak</a>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={cn('text-xs font-semibold uppercase tracking-[0.24em] text-muted transition hover:text-brass', active === link.href.slice(1) && 'text-brass')}>
                {link.label}
              </a>
            ))}
            <a data-track="cta_click" data-track-label="nav_book_now" href="#booking" className="magnetic rounded-full bg-brass px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-charcoal shadow-brass">Book Now</a>
          </nav>
          <button onClick={() => setOpen(true)} className="md:hidden rounded-full border border-stone/15 px-4 py-2 text-xs uppercase tracking-[0.22em]">Menu</button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-[70] bg-charcoal/96 p-6 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between"><span className="font-serif text-2xl">Pine & Peak</span><button onClick={() => setOpen(false)} className="rounded-full border border-stone/15 px-4 py-2">Close</button></div>
          <div className="mt-20 grid gap-7 font-serif text-5xl text-stone">
            {[...navLinks, { href: '#booking', label: 'Book Now' }].map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
          </div>
        </div>
      )}
    </>
  );
}

function AmbientSoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<{ context: AudioContext; source: AudioBufferSourceNode; gain: GainNode; filter: BiquadFilterNode } | null>(null);

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.08);
    window.setTimeout(() => {
      try { audio.source.stop(); } catch {}
      void audio.context.close();
    }, 180);
    audioRef.current = null;
    setEnabled(false);
  };

  const start = async () => {
    if (audioRef.current) return stop();
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
  };

  useEffect(() => () => stop(), []);

  return (
    <button
      type="button"
      onClick={start}
      aria-pressed={enabled}
      data-track="ambient_toggle"
      data-track-label={enabled ? 'ambient_off' : 'ambient_on'}
      className="magnetic absolute bottom-10 left-5 z-20 hidden items-center gap-3 rounded-full border border-stone/12 bg-charcoal/42 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-stone/70 backdrop-blur transition hover:border-brass/40 hover:text-brass md:flex"
    >
      {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
      {enabled ? 'Ambient on' : 'Ambient off'}
    </button>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative flex h-[112vh] min-h-[760px] items-center justify-center overflow-hidden bg-charcoal">
      <Image data-hero-layer="0.10" src="/assets/hero/luxury-hero-nathiagali.png" alt="Luxury mountain hotel glowing above the pine valleys of Nathiagali" fill priority sizes="100vw" className="object-cover" />
      <Image data-hero-layer="0.22" src="/assets/hero/hero-mountains.svg" alt="Layered Nathiagali mountain atmosphere" fill priority className="object-cover opacity-30 mix-blend-multiply" />
      <div data-hero-layer="0.36" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_0,rgba(17,19,15,.14)_32%,rgba(17,19,15,.78)_100%)]" />
      <Image data-hero-layer="0.58" src="/assets/hero/hero-forest.svg" alt="Dark pine foreground silhouette" fill priority className="object-cover opacity-[.64]" />
      <div className="hero-vignette absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-sage">Opening in Nathiagali, KPK</p>
        <h1 className="font-serif text-6xl leading-[0.92] text-stone md:text-8xl lg:text-9xl">A quieter kind of luxury above the pines.</h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-stone/78 md:text-xl">A warm, cinematic hill-station retreat shaped for mountain air, winter light, and unhurried stays.</p>
        <div className="mt-9"><Button asChild size="lg"><a data-track="cta_click" data-track-label="hero_reserve" href="#booking">Reserve the first season</a></Button></div>
      </div>
      <AmbientSoundToggle />
      <div className="absolute bottom-10 left-1/2 z-10 grid -translate-x-1/2 place-items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-stone/55"><span>Scroll</span><span className="block h-14 w-px overflow-hidden bg-stone/16"><span className="block h-5 w-px animate-pulse bg-brass" /></span></div>
    </section>
  );
}

function WireframeBox({ label }: { label: string }) {
  return (
    <div className="wireframe relative h-64 overflow-hidden rounded-[22px] border border-stone/10 bg-charcoal/50 p-5">
      <svg viewBox="0 0 360 230" className="h-full w-full opacity-90">
        <defs><linearGradient id={`${label}g`} x1="0" x2="1"><stop stopColor="#c08b3e"/><stop offset="1" stopColor="#9aaa82"/></linearGradient></defs>
        <path d="M85 165 L190 104 L282 154 L174 214 Z" fill="none" stroke="#eadcc4" strokeOpacity=".55" />
        <path d="M85 165 V82 L190 26 V104" fill="none" stroke="#eadcc4" strokeOpacity=".3" />
        <path d="M282 154 V72 L190 26" fill="none" stroke="#eadcc4" strokeOpacity=".3" />
        <path d="M174 214 V128 L85 82 M174 128 L282 72" fill="none" stroke="#c08b3e" strokeOpacity=".55" />
        <path d="M40 190 H105 M40 190 V130 M40 190 L85 214" stroke="url(#${label}g)" strokeWidth="3" fill="none"/>
        <text x="110" y="195" fill="#c08b3e" fontSize="12">X</text><text x="28" y="126" fill="#9aaa82" fontSize="12">Y</text><text x="88" y="224" fill="#b78963" fontSize="12">Z</text>
      </svg>
      <span className="absolute left-5 top-5 rounded-full border border-brass/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-brass">Studio render placeholder</span>
    </div>
  );
}

function DesignConcepts() {
  return <section id="concepts" className="mx-auto max-w-7xl px-5 py-28 md:px-8"><SectionEyebrow>Architect Concepts</SectionEyebrow><SectionTitle>Intentional placeholders, built for real renders.</SectionTitle><div className="mt-12 grid gap-5 md:grid-cols-3">{concepts.map(([title, text]) => <StudioCard key={title} className="concept-card"><WireframeBox label={title}/><h3 className="mt-6 font-serif text-3xl">{title}</h3><p className="mt-3 leading-7 text-muted">{text}</p></StudioCard>)}</div></section>;
}

function StatsBar() {
  return (
    <section aria-label="Property highlights" className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <StudioCard key={stat.label} className="px-6 py-7">
            <p className="font-serif text-5xl text-brass md:text-6xl">
              <span data-count={stat.value}>0</span>{stat.suffix}
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted">{stat.label}</p>
          </StudioCard>
        ))}
      </div>
    </section>
  );
}

function RoomsPinned() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const h = (e: Event) => setActive((e as CustomEvent<number>).detail);
    window.addEventListener('roomIndex', h);
    return () => window.removeEventListener('roomIndex', h);
  }, []);
  const jump = (i: number) => {
    setActive(i);
    const top = sectionRef.current?.offsetTop ?? 0;
    window.scrollTo({ top: top + window.innerHeight * 0.72 * i + 8, behavior: 'smooth' });
  };
  const room = rooms[active];
  return (
    <section id="rooms" ref={sectionRef} className="rooms-pin relative min-h-screen overflow-hidden bg-pine/40 py-20">
      <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-5 md:grid-cols-[1.08fr_.92fr] md:px-8">
        <div className="room-visual relative aspect-[1.18] overflow-hidden rounded-card border border-stone/10 bg-card-gradient shadow-soft">
          <Image key={room.image} src={room.image} alt={room.name} fill className="object-cover" />
        </div>
        <div className="room-copy">
          <SectionEyebrow>Rooms & Suites</SectionEyebrow>
          <h2 key={room.name} className="font-serif text-5xl leading-none text-stone md:text-7xl">{room.name}</h2>
          <p key={room.desc} className="mt-6 max-w-xl text-lg leading-8 text-muted">{room.desc}</p>
          <p className="mt-7 font-serif text-3xl text-brass">{room.price}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[Tv,'TV'],[AirVent,'AC'],[Wifi,'WiFi'],[Eye,'View']].map(([Icon, label]) => { const I = Icon as typeof Tv; return <div key={label as string} className="rounded-2xl border border-stone/10 bg-stone/6 p-4"><I className="mb-3 h-5 w-5 text-sage"/><span className="text-sm text-stone/75">{label as string}</span></div>;})}</div>
          <div className="mt-9 flex flex-wrap items-center gap-4"><Button asChild><a href="#booking">Book this room</a></Button><div className="flex gap-2">{rooms.map((r, i) => <button key={r.id} onClick={() => jump(i)} aria-label={`Jump to ${r.name}`} className={cn('h-1.5 w-14 rounded-full bg-stone/18 transition', active === i && 'bg-brass')} />)}</div></div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return <section id="experience" className="mx-auto max-w-7xl px-5 py-28 md:px-8"><div className="grid gap-10 md:grid-cols-[.82fr_1.18fr]"><div><SectionEyebrow>Experience Nathiagali</SectionEyebrow><SectionTitle>Not just a room. A season in the mountains.</SectionTitle><p className="mt-6 max-w-xl text-lg leading-8 text-muted">The property is positioned around place: snowfall weekends, green-season walks, pine-scented breakfasts, and evenings designed to slow the city down.</p></div><div className="grid gap-5">{experiences.map(([title, text, image, Icon]) => { const I = Icon as typeof Star; return <StudioCard key={title as string} className="group grid gap-5 overflow-hidden p-4 md:grid-cols-[220px_1fr]"><div className="relative min-h-44 overflow-hidden rounded-[22px]"><Image src={image as string} alt={title as string} fill sizes="220px" className="object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent"/></div><div className="flex gap-5 p-2"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass"><I /></div><div><h3 className="font-serif text-3xl">{title as string}</h3><p className="mt-2 leading-7 text-muted">{text as string}</p></div></div></StudioCard>;})}</div></div></section>;
}

function VisualMoodboard() {
  const images = [
    { src: '/assets/hero/luxury-hero-nathiagali.png', label: 'Ridge arrival', className: 'md:col-span-2 md:row-span-2' },
    { src: '/assets/experience/experience-bonfire-nathiagali.png', label: 'Bonfire terrace', className: '' },
    { src: '/assets/rooms/room-suite-luxury.png', label: 'Suite atmosphere', className: '' }
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
      <div className="mb-10 max-w-3xl">
        <SectionEyebrow>Opening Moodboard</SectionEyebrow>
        <SectionTitle>Warmer, more cinematic placeholders for the client preview.</SectionTitle>
      </div>
      <div className="grid auto-rows-[260px] gap-5 md:grid-cols-3 md:auto-rows-[310px]">
        {images.map((image) => (
          <div key={image.src} className={cn('group relative overflow-hidden rounded-card border border-stone/12 bg-card-gradient shadow-soft', image.className)}>
            <Image src={image.src} alt={image.label} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/78 via-charcoal/10 to-transparent" />
            <p className="absolute bottom-5 left-5 font-serif text-3xl text-stone">{image.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustAndStory() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <Link data-track="reviews_click" data-track-label="homepage_trust_bar" href="/reviews" className="group mb-16 grid w-full max-w-3xl gap-4 rounded-[28px] border border-stone/12 bg-card-gradient p-4 shadow-soft transition hover:border-brass/35 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex -space-x-3">
          {['A', 'H', 'S', 'B'].map((letter) => <span key={letter} className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-charcoal bg-gradient-to-br from-clay to-pine-soft font-serif text-stone">{letter}</span>)}
        </div>
        <div>
          <p className="font-serif text-2xl text-stone">4.9 average from +128 preview reviews</p>
          <p className="mt-1 text-sm text-muted">Rating breakdown and review-card structure ready for Google Places data.</p>
        </div>
        <span className="flex text-brass transition group-hover:scale-105"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></span>
      </Link>

      <StudioCard className="grid items-center gap-8 overflow-hidden p-4 md:grid-cols-[420px_1fr] md:p-5">
        <div className="relative min-h-[430px] overflow-hidden rounded-[24px]">
          <Image src="/assets/story/owner-lounge-placeholder.png" alt="Warm owner lounge placeholder for Pine & Peak" fill sizes="420px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 rounded-full border border-brass/30 bg-charcoal/55 px-4 py-2 text-xs uppercase tracking-[0.22em] text-brass backdrop-blur">Owner hospitality mood</p>
        </div>
        <div className="p-2 md:p-8">
          <SectionEyebrow>Owner’s Note</SectionEyebrow>
          <h2 className="font-serif text-4xl md:text-6xl">Built for guests who come here to breathe.</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">We are shaping Pine & Peak as a personal mountain house at hotel scale: fewer distractions, warmer service, and spaces that respect the weather, forest, and silence of Nathiagali.</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-stone/72">Until the real founder portrait is ready, this warm lounge visual keeps the section feeling intentional instead of unfinished.</p>
          <p className="mt-7 font-serif text-3xl text-brass">— The Founding Family</p>
        </div>
      </StudioCard>
    </section>
  );
}

function Booking() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState<{ reference: string } | null>(null);
  const [serverError, setServerError] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const { register, handleSubmit, setValue, watch, trigger, formState: { errors, isSubmitting } } = useForm<BookingFormValues, unknown, BookingInput>({ resolver: zodResolver(bookingSchema), defaultValues: { room: 'double', guests: 2, arrivalWindow: 'unsure', message: '', companyWebsite: '' } });
  const selectedRoom = watch('room') || 'double';
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const guests = watch('guests');
  const selected = rooms.find((r) => r.id === selectedRoom) ?? rooms[1];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000)) : 0;
  const estimate = nights * selected.rate;
  const fields: (keyof BookingFormValues)[][] = [['checkIn','checkOut'], ['room'], ['name','email','phone','guests','arrivalWindow'], []];
  const stepTitles = ['Pick dates', 'Choose room', 'Guest details', 'Confirm'];
  const next = async () => { if (await trigger(fields[step])) { setServerError(''); setStep((s) => Math.min(3, s + 1)); } };
  const onSubmit = async (data: BookingInput) => {
    setServerError('');
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) { setServerError(payload.error || 'Could not send inquiry. Please try WhatsApp.'); return; }
    if (typeof window !== 'undefined') {
      void fetch('/api/events', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'booking_submit_success', path: window.location.pathname, label: selectedRoom, value: payload.reference || 'PP-PREVIEW', timestamp: new Date().toISOString() }), keepalive: true });
    }
    setSent({ reference: payload.reference || 'PP-PREVIEW' });
  };

  useEffect(() => {
    gsap.fromTo('.booking-step', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' });
    if (typeof window !== 'undefined') {
      void fetch('/api/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'booking_step_view', path: window.location.pathname, label: stepTitles[step], value: String(step + 1), timestamp: new Date().toISOString() }),
        keepalive: true
      });
    }
  }, [step]);

  return (
    <section id="booking" className="mx-auto max-w-6xl px-5 py-28 md:px-8">
      <div className="grid gap-10 md:grid-cols-[.82fr_1.18fr] md:items-start">
        <div className="md:sticky md:top-28">
          <SectionEyebrow>Book the first season</SectionEyebrow>
          <SectionTitle>Full-rate inquiry, shaped like a private concierge flow.</SectionTitle>
          <p className="mt-6 text-lg leading-8 text-muted">No deposit, no card capture, no fake checkout. Guests send a polished inquiry and the hotel confirms availability directly.</p>
          <StudioCard className="mt-8 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-sage">Live estimate</p>
            <p className="mt-4 font-serif text-4xl text-brass">{estimate ? `PKR ${estimate.toLocaleString('en-PK')}` : 'Select dates'}</p>
            <p className="mt-2 text-sm text-muted">{nights ? `${nights} night${nights > 1 ? 's' : ''} · ${selected.name} · full-rate only` : 'Estimate appears after valid dates.'}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-muted">
              <span className="rounded-2xl bg-stone/7 px-2 py-3">No deposit</span>
              <span className="rounded-2xl bg-stone/7 px-2 py-3">Validated</span>
              <span className="rounded-2xl bg-stone/7 px-2 py-3">Concierge reply</span>
            </div>
          </StudioCard>
        </div>

        <form id="contact" onSubmit={handleSubmit(onSubmit)} className="rounded-card border border-stone/12 bg-card-gradient p-5 shadow-soft md:p-8">
          <input className="hidden" tabIndex={-1} autoComplete="off" {...register('companyWebsite')} />
          {sent ? (
            <div className="py-16 text-center">
              <p className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brass/15 text-brass"><Star fill="currentColor" /></p>
              <h3 className="font-serif text-5xl">Inquiry received.</h3>
              <p className="mt-4 text-muted">Reference <span className="text-brass">{sent.reference}</span>. We’ll confirm availability and next steps through your provided contact details.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild><a href="#hero">Back to top</a></Button>
                <Button asChild variant="secondary">
                  <a
                    data-track="whatsapp_click"
                    data-track-label="booking_success_whatsapp"
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I submitted a Pine & Peak booking inquiry. Reference: ${sent.reference}. Room: ${selected.name}. Dates: ${checkIn || 'TBC'} to ${checkOut || 'TBC'}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp reference
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-3 md:grid-cols-4">
                {stepTitles.map((title, i) => <button type="button" key={title} onClick={() => i <= step ? setStep(i) : undefined} className={cn('rounded-2xl border border-stone/10 bg-stone/6 p-3 text-left transition', i === step && 'border-brass/50 bg-brass/12', i < step && 'text-brass')}><span className="block text-[10px] uppercase tracking-[0.22em] text-muted">Step {i + 1}</span><span className="mt-1 block font-serif text-xl">{title}</span></button>)}
              </div>

              <div className="booking-step min-h-[410px]">
                {step === 0 && <div><h3 className="mb-5 font-serif text-4xl">When should the mountains expect you?</h3><div className="grid gap-4 md:grid-cols-2"><label className="text-sm uppercase tracking-[0.16em] text-muted">Check-in<input min={today} type="date" className="mt-2 w-full rounded-2xl p-4 text-base normal-case tracking-normal" {...register('checkIn')}/><span className="mt-2 block text-sm normal-case tracking-normal text-brass">{errors.checkIn?.message}</span></label><label className="text-sm uppercase tracking-[0.16em] text-muted">Check-out<input min={checkIn || today} type="date" className="mt-2 w-full rounded-2xl p-4 text-base normal-case tracking-normal" {...register('checkOut')}/><span className="mt-2 block text-sm normal-case tracking-normal text-brass">{errors.checkOut?.message}</span></label></div><p className="mt-6 rounded-2xl border border-stone/10 bg-charcoal/30 p-4 text-sm leading-6 text-muted">Tip: snowfall weekends and school holidays should be confirmed early through WhatsApp after the inquiry is sent.</p></div>}

                {step === 1 && <div><h3 className="mb-5 font-serif text-4xl">Choose a room tier.</h3><div className="grid gap-4 md:grid-cols-3">{rooms.map(r => <button type="button" key={r.id} onClick={() => setValue('room', r.id, { shouldValidate:true })} className={cn('group rounded-[24px] border p-3 text-left transition', selectedRoom===r.id?'border-brass bg-brass/12':'border-stone/12 bg-stone/6 hover:border-stone/24')}><span className="relative mb-4 block aspect-[4/3] overflow-hidden rounded-2xl"><Image src={r.image} alt={r.name} fill sizes="240px" className="object-cover transition duration-700 group-hover:scale-105"/></span><h3 className="font-serif text-2xl">{r.name}</h3><p className="mt-2 text-sm text-brass">{r.price}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{r.desc}</p></button>)}</div></div>}

                {step === 2 && <div><h3 className="mb-5 font-serif text-4xl">Who should our concierge contact?</h3><div className="grid gap-4 md:grid-cols-2"><input placeholder="Full name" className="rounded-2xl p-4" {...register('name')}/><input placeholder="Email" className="rounded-2xl p-4" {...register('email')}/><input placeholder="Phone / WhatsApp" className="rounded-2xl p-4" {...register('phone')}/><input type="number" min={1} max={8} placeholder="Guests" className="rounded-2xl p-4" {...register('guests')}/><select className="rounded-2xl border border-stone/16 bg-stone/6 p-4 text-stone md:col-span-2" {...register('arrivalWindow')}><option value="unsure">Arrival window: not sure yet</option><option value="morning">Morning approach</option><option value="afternoon">Afternoon arrival</option><option value="evening">Evening arrival</option></select><textarea placeholder="Anything we should know? Road concerns, family needs, celebration plans…" className="min-h-32 rounded-2xl p-4 md:col-span-2" {...register('message')}/><p className="text-sm text-brass md:col-span-2">{errors.name?.message || errors.email?.message || errors.phone?.message || errors.guests?.message}</p></div></div>}

                {step === 3 && <div><h3 className="mb-5 font-serif text-4xl">Confirm the inquiry.</h3><div className="grid gap-4"><div className="rounded-[24px] border border-stone/12 bg-charcoal/35 p-6"><p className="text-xs uppercase tracking-[0.24em] text-sage">Room</p><p className="mt-2 font-serif text-3xl text-stone">{selected.name}</p><p className="mt-2 text-brass">{selected.price}</p></div><div className="grid gap-4 md:grid-cols-3"><div className="rounded-[22px] bg-stone/7 p-4"><p className="text-xs uppercase tracking-[0.18em] text-muted">Dates</p><p className="mt-2 text-stone">{checkIn || '—'} → {checkOut || '—'}</p></div><div className="rounded-[22px] bg-stone/7 p-4"><p className="text-xs uppercase tracking-[0.18em] text-muted">Guests</p><p className="mt-2 text-stone">{String(guests || '—')}</p></div><div className="rounded-[22px] bg-stone/7 p-4"><p className="text-xs uppercase tracking-[0.18em] text-muted">Estimate</p><p className="mt-2 text-brass">{estimate ? `PKR ${estimate.toLocaleString('en-PK')}` : '—'}</p></div></div><p className="rounded-2xl border border-brass/20 bg-brass/10 p-4 text-sm leading-6 text-muted">No deposit or card payment will be taken. This sends a full-rate availability inquiry only.</p></div></div>}
              </div>

              {serverError && <p className="mt-4 rounded-2xl border border-brass/30 bg-brass/10 p-4 text-sm text-brass">{serverError}</p>}
              <div className="mt-8 flex justify-between gap-3"><Button type="button" variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))}>Back</Button>{step < 3 ? <Button type="button" onClick={next}>Continue</Button> : <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending' : 'Send inquiry'}</Button>}</div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Location() {
  const mapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  return (
    <section id="location" className="relative overflow-hidden py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[.82fr_1.18fr] md:px-8">
        <div>
          <SectionEyebrow>How to reach us</SectionEyebrow>
          <SectionTitle>Follow the gold line into the hills.</SectionTitle>
          <p className="mt-6 text-lg leading-8 text-muted">Approach from Islamabad/Rawalpindi toward Murree and onward to Nathiagali. The journey is part of the experience, but winter road conditions should always be confirmed before departure.</p>

          <div className="mt-8 grid gap-3">
            {routeStops.map(([title, text], i) => (
              <div key={title} className="grid grid-cols-[44px_1fr] gap-4 rounded-[24px] border border-stone/10 bg-stone/6 p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brass/15 font-serif text-xl text-brass">{i + 1}</span>
                <div>
                  <p className="font-serif text-2xl text-stone">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 text-muted">
            <p><MapPin className="mr-2 inline text-brass"/>Pine & Peak, Nathiagali, Khyber Pakhtunkhwa</p>
            <p>Approx. 2.5–3.5 hours from Islamabad depending on season, traffic, and snowfall.</p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="map-shell relative min-h-[540px] overflow-hidden rounded-card border border-stone/12 shadow-soft">
            {mapUrl ? (
              <iframe src={mapUrl} className="absolute inset-0 h-full w-full border-0 opacity-80 grayscale-[.25] sepia-[.18]" loading="lazy" title="Pine & Peak Google Map" />
            ) : (
              <>
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 620" aria-hidden="true">
                  <defs>
                    <radialGradient id="mapGlow" cx="72%" cy="18%" r="42%"><stop stopColor="#9aaa82" stopOpacity=".28"/><stop offset="1" stopColor="#9aaa82" stopOpacity="0"/></radialGradient>
                    <linearGradient id="routeGold" x1="0" x2="1"><stop stopColor="#8f642b"/><stop offset=".45" stopColor="#d6ad69"/><stop offset="1" stopColor="#c08b3e"/></linearGradient>
                  </defs>
                  <rect width="900" height="620" fill="url(#mapGlow)" />
                  <path d="M0 430 C110 390 170 460 285 405 C420 342 460 250 610 268 C760 286 780 172 900 128" fill="none" stroke="#eadcc4" strokeOpacity=".06" strokeWidth="72" />
                  <path d="M0 438 C110 398 170 468 285 413 C420 350 460 258 610 276 C760 294 780 180 900 136" fill="none" stroke="#11130f" strokeOpacity=".42" strokeWidth="46" />
                  <path d="M78 532 C178 438 214 374 350 371 C477 368 492 232 622 228 C735 224 748 136 835 92" fill="none" stroke="url(#routeGold)" strokeWidth="5" className="route-dash route-line" />
                  <g className="route-stop" transform="translate(78 532)"><circle r="11" fill="#11130f" stroke="#c08b3e" strokeWidth="4"/><text x="20" y="7" fill="#a79a84" fontSize="17">Islamabad / Rawalpindi</text></g>
                  <g className="route-stop" transform="translate(480 265)"><circle r="11" fill="#11130f" stroke="#c08b3e" strokeWidth="4"/><text x="18" y="-14" fill="#a79a84" fontSize="17">Murree ridge</text></g>
                  <g className="branded-pin" transform="translate(835 92)">
                    <path d="M0 -34 C20 -34 36 -18 36 2 C36 29 0 52 0 52 C0 52 -36 29 -36 2 C-36 -18 -20 -34 0 -34Z" fill="#c08b3e"/>
                    <circle r="13" fill="#11130f"/>
                    <path d="M-8 6 0 -9 9 6" fill="none" stroke="#eadcc4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <text x="610" y="72" fill="#eadcc4" fontSize="30" fontFamily="Georgia">Pine & Peak</text>
                  <text x="612" y="103" fill="#c08b3e" fontSize="18">Nathiagali, KPK</text>
                  <path d="M110 120 L180 62 L255 154 L335 88 L420 190" fill="none" stroke="#9aaa82" strokeOpacity=".16" strokeWidth="3"/>
                  <path d="M70 210 L145 158 L220 232 L300 170 L370 270" fill="none" stroke="#9aaa82" strokeOpacity=".12" strokeWidth="3"/>
                </svg>
                <div className="absolute bottom-6 left-6 right-6 grid gap-3 rounded-[24px] border border-stone/12 bg-charcoal/72 p-4 backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
                  <div><p className="font-serif text-2xl">Custom map placeholder</p><p className="text-sm leading-6 text-muted">Set <code className="text-brass">NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL</code> to replace this with the styled embed.</p></div>
                  <span className="rounded-full bg-brass/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-brass">Branded pin ready</span>
                </div>
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {nearbyPlaces.map(([name, type]) => (
              <div key={name} className="rounded-[24px] border border-stone/10 bg-stone/6 p-4">
                <p className="font-serif text-2xl text-stone">{name}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-sage">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() { return <section className="mx-auto max-w-4xl px-5 py-20 md:px-8"><SectionEyebrow>FAQ</SectionEyebrow><SectionTitle>Answers before WhatsApp gets crowded.</SectionTitle><Accordion.Root type="single" collapsible className="mt-10 grid gap-3">{faqs.map(([q,a],i)=><Accordion.Item key={q} value={`item-${i}`} className="rounded-[22px] border border-stone/12 bg-card-gradient px-5"><Accordion.Trigger className="flex w-full items-center justify-between py-5 text-left font-serif text-2xl"><span>{q}</span><ChevronDown className="h-5 w-5 text-brass"/></Accordion.Trigger><Accordion.Content className="pb-5 leading-7 text-muted">{a}</Accordion.Content></Accordion.Item>)}</Accordion.Root></section> }

function Footer() { const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567'; return <footer className="border-t border-stone/10 px-5 py-12 md:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row"><div><p className="font-serif text-3xl">Pine & Peak</p><p className="mt-2 text-muted">Luxury hill hotel MVP · Nathiagali, Pakistan</p></div><a className="text-brass" href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi, I would like to inquire about Pine & Peak Nathiagali bookings.')}`}>WhatsApp inquiry</a></div></footer>; }

function FloatingWhatsApp() { const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567'; return <a data-track="whatsapp_click" data-track-label="floating_whatsapp" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f6f43] text-stone shadow-soft" href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi, I would like to inquire about Pine & Peak Nathiagali bookings.')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle /></a>; }

function PolishOverlay() {
  const chapters = [
    ['hero', 'Arrival'],
    ['rooms', 'Rooms'],
    ['experience', 'Place'],
    ['booking', 'Book'],
    ['location', 'Route']
  ];
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const onScroll = () => {
      const current = chapters.find(([id]) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.52 && rect.bottom > window.innerHeight * 0.52;
      });
      if (current) setActive(current[0]);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[60] h-px origin-left scale-x-0 bg-brass/80 scroll-progress-bar" />
      <nav aria-label="Page chapters" className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
        {chapters.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="group flex items-center gap-3">
            <span className={cn('translate-x-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100', active === id && 'translate-x-0 text-brass opacity-100')}>{label}</span>
            <span className={cn('block h-1.5 w-1.5 rounded-full bg-stone/28 transition group-hover:bg-brass', active === id && 'h-10 w-1 rounded-full bg-brass')} />
          </a>
        ))}
      </nav>
    </>
  );
}

function HotelJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pine-peak-nathiagali.example';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: 'Pine & Peak Nathiagali',
    url: siteUrl,
    image: `${siteUrl}/assets/hero/hero-sky.svg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nathiagali',
      addressRegion: 'Khyber Pakhtunkhwa',
      addressCountry: 'PK'
    },
    priceRange: 'PKR 85,000–165,000 per night',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'TV', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'AC / heating comfort', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Mountain view', value: true }
    ],
    makesOffer: rooms.map((room) => ({
      '@type': 'Offer',
      name: room.name,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/PreOrder',
      description: room.desc
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const track = (name: string, label?: string, value?: string) => {
      const payload = JSON.stringify({ name, label, value, path: window.location.pathname, timestamp: new Date().toISOString() });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/events', new Blob([payload], { type: 'application/json' }));
      } else {
        void fetch('/api/events', { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload, keepalive: true });
      }
    };
    const onTrackClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest('[data-track]') as HTMLElement | null;
      if (!target) return;
      track(target.dataset.track || 'cta_click', target.dataset.trackLabel, target.dataset.trackValue);
    };
    document.addEventListener('click', onTrackClick);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    if (!sessionStorage.getItem('pp-loader')) {
      sessionStorage.setItem('pp-loader', 'seen');
      gsap.fromTo('.loader-wipe', { yPercent: 0 }, { yPercent: -100, duration: 0.9, delay: 0.25, ease: 'power3.inOut' });
    } else gsap.set('.loader-wipe', { yPercent: -100 });

    gsap.to('.scroll-progress-bar', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true } });

    gsap.utils.toArray<HTMLElement>('[data-hero-layer]').forEach((layer) => {
      gsap.to(layer, { yPercent: Number(layer.dataset.heroLayer) * 100, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    });

    gsap.utils.toArray<HTMLElement>('.studio-card').forEach((card) => {
      gsap.fromTo(card, { y: 34, autoAlpha: 0.72 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
    });

    gsap.utils.toArray<HTMLElement>('.concept-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        gsap.to(card, { rotateY: x * 5, rotateX: -y * 5, transformPerspective: 900, transformOrigin: 'center', duration: 0.35, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.5, ease: 'power3.out' }));
    });

    let lastRoom = -1;
    const roomsTrigger = ScrollTrigger.create({ trigger: '#rooms', start: 'top top', end: '+=240%', pin: true, scrub: true, anticipatePin: 1, onUpdate: (self) => {
      const i = Math.min(2, Math.floor(self.progress * 3));
      if (i !== lastRoom) {
        lastRoom = i;
        window.dispatchEvent(new CustomEvent('roomIndex', { detail: i }));
      }
    }});
    const onRoom = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      const buttons = document.querySelectorAll('#rooms button[aria-label^="Jump"]');
      buttons.forEach((b, idx) => b.classList.toggle('bg-brass', idx === i));
      gsap.fromTo(['.room-visual', '.room-copy'], { autoAlpha: 0.72, y: 18, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.04 });
    };
    window.addEventListener('roomIndex', onRoom);

    document.querySelectorAll('.reveal-title').forEach((el) => {
      const split = new SplitType(el as HTMLElement, { types: 'words' });
      gsap.from(split.words, { yPercent: 70, opacity: 0, stagger: 0.035, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } });
    });

    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count || 0);
      const obj = { value: 0 };
      gsap.to(obj, { value: target, duration: 1.4, ease: 'power2.out', snap: { value: 1 }, onUpdate: () => { el.textContent = Math.round(obj.value).toLocaleString('en-PK'); }, scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });

    gsap.fromTo('.route-line', { strokeDashoffset: 560 }, { strokeDashoffset: 0, scrollTrigger: { trigger: '#location', start: 'top 70%', end: 'center center', scrub: true } });
    gsap.to('.branded-pin', { y: -8, repeat: -1, yoyo: true, duration: 1.6, ease: 'sine.inOut', scrollTrigger: { trigger: '#location', start: 'top 80%', toggleActions: 'play pause resume pause' } });
    gsap.to(':root', { '--mood': '#18231c', scrollTrigger: { trigger: '#rooms', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to(':root', { '--mood': '#1b231d', scrollTrigger: { trigger: '#experience', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to(':root', { '--mood': '#211a14', scrollTrigger: { trigger: '#booking', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to(':root', { '--mood': '#121a18', scrollTrigger: { trigger: '#location', start: 'top bottom', end: 'bottom top', scrub: true } });

    const cursor = document.querySelector('.cursor-ring') as HTMLElement | null;
    const move = (e: MouseEvent) => { gsap.to(cursor, { x: e.clientX, y: e.clientY, opacity: 1, duration: 0.18 }); };
    window.addEventListener('mousemove', move);
    document.querySelectorAll('a,button').forEach((el) => { el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.8, duration: .2 })); el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: .2 })); });
    document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => { el.addEventListener('mousemove', (e) => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width/2) * .16, y: (e.clientY - r.top - r.height/2) * .16, duration: .25 }); }); el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .35 })); });

    gsap.set('.route-wipe', { yPercent: -100 });
    const routeClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      const isInternalPage = url.origin === window.location.origin && url.pathname !== window.location.pathname && !anchor.target;
      if (!isInternalPage) return;
      event.preventDefault();
      gsap.to('.route-wipe', { yPercent: 0, duration: 0.45, ease: 'power3.inOut', onComplete: () => { window.location.href = anchor.href; } });
    };
    document.addEventListener('click', routeClick);

    return () => { roomsTrigger.kill(); document.removeEventListener('click', onTrackClick); document.removeEventListener('click', routeClick); window.removeEventListener('mousemove', move); window.removeEventListener('roomIndex', onRoom); lenis?.destroy(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return <main id="main-content"><a href="#main-content" className="skip-link">Skip to content</a><HotelJsonLd/><div className="loader-wipe fixed inset-0 z-[80] flex items-center justify-center"><div className="grid place-items-center gap-4"><div className="h-12 w-12 rounded-full border border-brass/30 bg-brass/10 p-3"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 28 17 9l6 11 4-7 8 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div className="font-serif text-4xl text-brass">Pine & Peak</div></div></div><div className="route-wipe fixed inset-0 z-[79] flex items-center justify-center"><div className="font-serif text-4xl text-brass">Pine & Peak</div></div><div className="cursor-ring"/><PolishOverlay/><Navigation/><Hero/><DesignConcepts/><StatsBar/><RoomsPinned/><Experience/><VisualMoodboard/><TrustAndStory/><Booking/><FAQ/><Location/><Footer/><FloatingWhatsApp/></main>;
}
