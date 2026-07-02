# Project Structure

```txt
app/                         Next.js App Router routes, pages, metadata, APIs
  api/                       Route handlers for booking, events, health
  reviews/                   Reviews page
  page.tsx                   Main landing page
  globals.css                Global design tokens and Tailwind CSS

components/                  Shared UI primitives
lib/                         Schemas, env validation, utilities, security helpers
public/assets/               Local visual assets grouped by purpose
  hero/                      Hero and mountain layer assets
  rooms/                     Room tier imagery and room placeholders
  experience/                Seasonal/place imagery
  story/                     Owner/story imagery

brochure/                    Standalone exportable brochure asset
docs/                        Handoff, security, QA, analytics, launch documentation

next.config.ts               Security headers and Next config
proxy.ts                     HTTPS enforcement proxy
package.json                 Scripts and dependencies
.env.example                 Environment variable template
```

## Notes

- Generated cache/build folders like `.next`, `.npm`, and `node_modules` are intentionally not part of the source organization.
- Public asset paths are grouped but remain stable through `/assets/...` URLs.
- The brochure stays outside the Next route tree by design.
