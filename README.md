# kyzooghost.github.io

The public site for `kyzooghost`: technical case studies, public artifacts, writing, project pages, and notes on engineering judgment.

## Technology

- Astro with TypeScript
- Astro Content Collections
- Markdown content
- Plain CSS
- GitHub Pages with GitHub Actions

## Local development

Astro 7 requires Node.js `>=22.12.0`.

```bash
npm install
npm run dev
```

Open the local URL printed by Astro. Use `npm run build` to generate `dist/`, `npm run preview` to preview that build, and `npm run check` for Astro and TypeScript checks.

## Deployment

`.github/workflows/check.yml` runs on pull requests and pushes to `main`. It installs the locked dependencies, runs `npm run check`, and builds the site.

`.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages when `main` changes or when the workflow is manually dispatched. In the repository’s Pages settings, choose GitHub Actions as the publishing source. The site URL is configured in `astro.config.mjs` as `https://kyzooghost.github.io`.

## Add an external artifact

Add one Markdown file under `src/content/work/` with the required frontmatter. Set `externalUrl`, the appropriate `type`, `featured: true`, and `draft: false`; the home page only lists featured, published entries and links directly to the external source.

## Add an internal case study

Add one Markdown file under `src/content/work/` with `externalUrl` omitted and frontmatter containing every required field:

```yaml
---
title: A concise case-study title
description: A one-sentence summary
publishedAt: 2025-01-01
type: case-study
featured: false
draft: false
# Optional: updatedAt, tags, canonicalUrl
---
```

Use `draft: false` when publishing. Write the body with normal Markdown headings such as Problem, Why it mattered, Conflicting constraints, Options considered, Decision, Evidence, Result, and Remaining uncertainty. The route uses the filename stem without `.md`: `incident-response.md` renders at `/work/incident-response`.

## Configure social links

Edit `src/config.ts` to manage the central social-link configuration. GitHub, Medium, Telegram, and X are configured there. Set `xUrl` to `null` to omit X from the site when no profile should be shown.
