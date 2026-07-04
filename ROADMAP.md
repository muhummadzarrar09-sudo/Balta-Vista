# 🏔️ Balta Vista — Remaining Phases (Priority Order)

## ✅ PHASE A — Email Confirmations & Operations (DONE)
| Item | Status |
|---|---|
| **SMTP email sending** via Resend | ✅ |
| **Guest booking confirmation email** | ✅ |
| **Admin new inquiry alert email** | ✅ |
| **Admin payment submitted alert** | ✅ |
| **Guest booking confirmed email** | ✅ |
| **Branded HTML email templates** (dark theme, responsive) | ✅ |
| **WhatsApp deep links** with pre-filled context | ✅ |
| **Webhook forwarding** (Slack/Telegram/CRM) | ✅ |

---

## ✅ PHASE B — Admin Auth & Security (DONE)
| Item | Status |
|---|---|
| **Session-based admin login** (HttpOnly cookie, 6h expiry) | ✅ |
| **Admin API via Authorization header only** (no URL params) | ✅ |
| **Persisted rate limiting** (survives server restarts) | ✅ |
| **Auto-backup booking data** (keeps last 20 backups) | ✅ |
| **Receipt view via signed short-lived tokens** | ✅ (was already done) |

---

## ✅ PHASE C — UX Polish & Brochure (DONE)
| Item | Status |
|---|---|
| **Skeleton loading components** | ✅ |
| **Loading.tsx with skeleton cards** | ✅ |
| **Brochure refreshed** (images → .jpg, deleted old) | ✅ |
| **City + Province fields in booking form** | ✅ |
| **Admin responsive (mobile-friendly actions)** | ✅ |
| **ARIA labels** (nav, buttons, decorative images hidden) | ✅ |
| **Bonus: Brochure stale file cleanup** | ✅ |

---

## ✅ PHASE D — Privacy & Legal (DONE)
| Item | Status |
|---|---|
| **Privacy Policy page** (`/privacy`) — Pakistani PECA-compliant | ✅ |
| **Terms of Service page** (`/terms`) | ✅ |
| **Cancellation & Refund Policy** (`/cancellation`) — 4-tier, weather clause | ✅ |
| **Cookie Consent banner** — branded, animated, stores preference | ✅ |
| **Legal links in footer** — homepage + all subpages | ✅ |
| **Sitemap updated** — all legal pages indexed | ✅ |

---

## 🔵 PHASE E — SEO & Marketing

| Item | Why |
|---|---|
| **Blog section** | "Best time to visit Nathiagali" — SEO |
| **Google Business Profile sync** | Reviews + booking link on Maps |
| **Google Hotel Ads schema** | Rich search results with pricing |
| **Instagram feed integration** | Social proof on homepage |

**Time:** ~8 hours

---

## Summary
```
✅ Phase A ❱❱❱❱ Email + WhatsApp ops     ← DONE
✅ Phase B ❱❱❱❱ Admin auth + security      ← DONE
✅ Phase C ❱❱❱❱ UX polish + brochure       ← DONE
🟢 Phase D ❱    Privacy + legal             ← (2h)
🔵 Phase E ❱    SEO + marketing             ← (8h)
```
