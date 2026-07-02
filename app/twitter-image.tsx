import { ImageResponse } from 'next/og';

export const alt = 'Pine & Peak Nathiagali — Luxury hill hotel above the pines';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #11130f 0%, #18231c 58%, #211a14 100%)', color: '#eadcc4', padding: 72 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 78% 18%, rgba(192,139,62,.34), transparent 330px), radial-gradient(circle at 18% 92%, rgba(154,170,130,.22), transparent 390px)' }} />
        <svg width="680" height="430" viewBox="0 0 680 430" style={{ position: 'absolute', right: -20, bottom: -18, opacity: 0.86 }}>
          <path d="M0 342 88 198 168 294 262 126 382 330 475 164 680 344 680 430 0 430Z" fill="#26372d" />
          <path d="M40 362 C164 306 260 364 394 310 C510 264 590 292 680 246 L680 430 L40 430Z" fill="#0b0d0a" opacity=".72" />
          <g transform="translate(215 232)"><path d="M0 72 110 0 252 72Z" fill="#292319" /><rect x="24" y="72" width="204" height="92" fill="#171d15" /><rect x="52" y="96" width="36" height="46" fill="#c08b3e" opacity=".72" /><rect x="112" y="96" width="36" height="46" fill="#c08b3e" opacity=".48" /><rect x="172" y="96" width="36" height="46" fill="#c08b3e" opacity=".72" /></g>
        </svg>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxWidth: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 76, height: 76, borderRadius: 24, border: '1px solid rgba(192,139,62,.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(192,139,62,.1)' }}>
              <svg width="46" height="46" viewBox="0 0 48 48"><path d="M6 34 19 11l7 13 5-9 11 19" fill="none" stroke="#c08b3e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 39h28" stroke="#eadcc4" strokeOpacity=".55" strokeWidth="2.6" strokeLinecap="round" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontFamily: 'Georgia, serif', fontSize: 36, letterSpacing: '-0.03em' }}>Pine & Peak</span><span style={{ color: '#9aaa82', fontSize: 16, letterSpacing: '.28em', textTransform: 'uppercase' }}>Nathiagali, KPK</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}><div style={{ color: '#c08b3e', fontSize: 18, letterSpacing: '.28em', textTransform: 'uppercase', marginBottom: 22 }}>Luxury hill hotel preview</div><div style={{ fontFamily: 'Georgia, serif', fontSize: 78, lineHeight: 0.92, letterSpacing: '-0.06em' }}>A quieter kind of luxury above the pines.</div><div style={{ marginTop: 26, color: '#a79a84', fontSize: 26, lineHeight: 1.4 }}>Opening-season MVP for a warm, cinematic mountain retreat in Pakistan.</div></div>
        </div>
      </div>
    ),
    size
  );
}
