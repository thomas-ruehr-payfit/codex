@AGENTS.md

# Codex — Project Instructions

## Stack
- Next.js 16 (App Router, static export via `output: 'export'`)
- Tailwind CSS v4
- TypeScript

## Deployment
- GitHub → Vercel (auto-deploy on push, zero config)

## Content
All content lives in `/content/sections/` as `.md` files.
Expandable files are also copied to `/public/downloads/` for the download link.

### Frontmatter fields
- `title` (required) — nav label
- `order` (required) — sort order
- `type: expandable` — renders as a collapsible card
- `downloadName` — filename for the download button (expandable only)

## Key files
- `src/lib/content.ts` — reads and parses markdown files
- `src/components/SideNav.tsx` — sticky nav with IntersectionObserver active state
- `src/components/ExpandableBlock.tsx` — details/summary expand card
- `src/components/CopyCodeButtons.tsx` — injects copy buttons on all `<pre>` elements
- `src/app/page.tsx` — main page, renders all sections
- `src/app/globals.css` — copy button styles, prose overrides, syntax highlight import
