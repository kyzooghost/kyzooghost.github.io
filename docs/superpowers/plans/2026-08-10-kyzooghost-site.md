# kyzooghost v1 personal site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a restrained, static Astro home for the pseudonymous identity `kyzooghost`, with one intentional external work artifact and a maintainable internal case-study system.

**Architecture:** Astro 7 statically renders a shared document layout, compact navigation, editorial home-page work list, About page, custom 404 page, and future internal work pages. A single typed `work` content collection loads Markdown entries from `src/content/work`; external entries link directly to their source while internal entries render through `/work/[slug]`.

**Tech Stack:** Astro 7.2.0, TypeScript 6.0.3, `@astrojs/check` 0.9.10, Astro Content Collections with `astro/loaders`, Markdown, plain CSS, npm, and GitHub Pages via `withastro/action`.

## Global Constraints

- Use only the pseudonymous identity `kyzooghost`; do not add a real name, employer, employment timeline, location, or other unsupplied personal detail.
- Configure `site: 'https://kyzooghost.github.io'` and do not configure a repository `base` path.
- Keep all site and social URLs in `src/config.ts`; X remains nullable and must not render while unset.
- Use one `work` content collection with typed `title`, `description`, `publishedAt`, optional `updatedAt`, `type`, `featured`, `draft`, optional `externalUrl`, optional `tags`, and optional `canonicalUrl` fields.
- Render only the supplied Medium artifact in v1; do not copy its article body or create fake future projects.
- Use warm off-white, charcoal, one muted accent, thin rules, whitespace, left-aligned rhythm, and responsive `65-75ch` article text without gradients, glass, large photographs, decorative motion, or generic card grids.
- Use semantic HTML, visible focus states, metadata, Open Graph tags, favicon, `robots.txt`, and a custom 404 page.
- Use Markdown for the initial internal article format; add MDX only when a real artifact requires it.
- Pin npm dependency versions exactly and commit `package-lock.json`.
- Validate pull requests and `main` pushes with a separate GitHub Actions workflow that runs `npm ci`, `npm run check`, and `npm run build`.
- The GitHub Pages workflow must live at `.github/workflows/deploy.yml`, trigger on `main` and manual dispatch, and use Astro’s official GitHub Pages action.

---

## File map

### Build and deployment

- Create `package.json` for the exact Astro/check/TypeScript versions and `dev`, `build`, `preview`, and `check` scripts.
- Create `package-lock.json` with `npm install`.
- Create `astro.config.mjs` with the canonical user-site URL and no `base`.
- Create `tsconfig.json` extending Astro’s strict preset.
- Create `.gitignore` for dependencies, Astro output, OS files, and local environment files.
- Create `.github/workflows/check.yml` for pull request and `main` branch validation.
- Create `.github/workflows/deploy.yml` for official GitHub Pages deployment.

### Content and identity

- Create `src/config.ts` for identity, description, canonical URL, and social URLs.
- Create `src/content/types.ts` for shared work-type constants and labels.
- Create `src/content.config.ts` for the typed Markdown collection.
- Create `src/content/work/four-practical-solidity-patterns.md` for the one external artifact.

### Presentation

- Create `src/styles/global.css` for variables, layout, typography, responsive rules, and Markdown content styles.
- Create `src/layouts/BaseLayout.astro` for document metadata and global CSS.
- Create `src/layouts/ArticleLayout.astro` for long-form reading structure.
- Create `src/components/Header.astro`, `src/components/Footer.astro`, and `src/components/WorkItem.astro` for shared presentation.
- Create `public/favicon.svg` and `public/robots.txt`.

### Pages and docs

- Create `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/work/[...slug].astro`, and `src/pages/404.astro`.
- Create `README.md` with setup, content, deployment, and configuration instructions.

---

### Task 1: Bootstrap the Astro project and Pages workflow

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.github/workflows/check.yml`
- Create: `.github/workflows/deploy.yml`
- Create: `src/pages/index.astro` (temporary build-valid shell, replaced in Task 4)

**Interfaces:**
- Produces npm scripts used by every later task: `dev`, `build`, `preview`, and `check`.
- Produces Astro’s project configuration consumed by layouts, pages, and the deployment action.

- [x] **Step 1: Create the exact package manifest**

~~~json
{
  "name": "kyzooghost.github.io",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "7.2.0"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.10",
    "typescript": "6.0.3"
  }
}
~~~

- [x] **Step 2: Add Astro, TypeScript, and ignore configuration**

~~~js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kyzooghost.github.io',
});
~~~

~~~json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
~~~

~~~gitignore
.worktrees/
.superpowers/
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
.DS_Store
~~~

- [x] **Step 3: Add a build-valid page shell**

~~~astro
---
const title = 'kyzooghost';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <main>
      <h1>{title}</h1>
    </main>
  </body>
</html>
~~~

- [x] **Step 4: Add the official GitHub Pages workflow**

~~~yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v7
      - name: Build and upload site
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
~~~

- [x] **Step 5: Install the exact dependency graph and verify the bootstrap**

Run:

~~~bash
npm install
npm run build
~~~

Expected: npm creates `package-lock.json`; Astro exits 0 and writes `dist/index.html`.

- [x] **Step 6: Commit the bootstrap**

~~~bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore .github/workflows/deploy.yml src/pages/index.astro
git commit -m "chore: bootstrap Astro site"
~~~

---

### Task 2: Add site configuration and typed work content

**Files:**
- Create: `src/config.ts`
- Create: `src/content/types.ts`
- Create: `src/content.config.ts`
- Create: `src/content/work/four-practical-solidity-patterns.md`

**Interfaces:**
- Produces `siteConfig` for layouts and pages.
- Produces `WORK_TYPE`, `WORK_TYPE_VALUES`, `WORK_TYPE_LABEL`, and `WORK_LINK_LABEL` for schema validation and work presentation.
- Produces the `work` collection queried by the home page and internal work route.

- [x] **Step 1: Define central site and social configuration**

~~~ts
// src/config.ts
export const siteConfig = {
  name: 'kyzooghost',
  description: 'Technical work and judgment in public.',
  url: 'https://kyzooghost.github.io',
  social: {
    githubUrl: 'https://github.com/kyzooghost',
    mediumUrl: 'https://medium.com/@kyzooghost',
    telegramUrl: 'https://t.me/kyzooghost',
    xUrl: null as string | null,
  },
} as const;
~~~

- [x] **Step 2: Define shared work type constants**

~~~ts
// src/content/types.ts
export const WORK_TYPE = {
  caseStudy: 'case-study',
  externalArtifact: 'external-artifact',
  earlierWriting: 'earlier-writing',
  project: 'project',
} as const;

export const WORK_TYPE_VALUES = [
  WORK_TYPE.caseStudy,
  WORK_TYPE.externalArtifact,
  WORK_TYPE.earlierWriting,
  WORK_TYPE.project,
] as const;

export type WorkType = (typeof WORK_TYPE_VALUES)[number];

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  [WORK_TYPE.caseStudy]: 'Case study',
  [WORK_TYPE.externalArtifact]: 'External artifact',
  [WORK_TYPE.earlierWriting]: 'Earlier technical writing',
  [WORK_TYPE.project]: 'Project',
};

export const WORK_LINK_LABEL: Record<WorkType, string> = {
  [WORK_TYPE.caseStudy]: 'Read case study →',
  [WORK_TYPE.externalArtifact]: 'Read externally ↗',
  [WORK_TYPE.earlierWriting]: 'Read on Medium ↗',
  [WORK_TYPE.project]: 'View project →',
};
~~~

- [x] **Step 3: Define the current Astro content collection**

~~~ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { WORK_TYPE_VALUES } from './content/types';

const URL_PROTOCOL = {
  http: 'http:',
  https: 'https:',
} as const;

const httpUrl = z.url().refine((value) => {
  try {
    const protocol = new URL(value).protocol;
    return protocol === URL_PROTOCOL.http || protocol === URL_PROTOCOL.https;
  } catch {
    return false;
  }
}, 'URL must use http:// or https://.');

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    type: z.enum(WORK_TYPE_VALUES),
    featured: z.boolean(),
    draft: z.boolean(),
    externalUrl: httpUrl.optional(),
    tags: z.array(z.string()).optional(),
    canonicalUrl: httpUrl.optional(),
  }),
});

export const collections = { work };
~~~

- [x] **Step 4: Add only the supplied external artifact**

~~~md
---
title: Four practical Solidity patterns from Gnosis Safe
description: Earlier technical writing about practical patterns found in production Solidity code.
publishedAt: 2022-03-03
type: earlier-writing
featured: true
draft: false
externalUrl: https://medium.com/@kyzooghost/four-practical-solidity-patterns-from-gnosis-safe-e8251f90a7ba
canonicalUrl: https://medium.com/@kyzooghost/four-practical-solidity-patterns-from-gnosis-safe-e8251f90a7ba
tags:
  - Solidity
  - Gnosis Safe
---
~~~

The date is the article’s visible Medium publication date, `Mar 3, 2022`. Do not copy the Medium body or any author-profile employment text into the repository.

- [x] **Step 5: Run content validation**

Run:

~~~bash
npm run check
npm run build
~~~

Expected: Astro accepts the collection schema and builds the Markdown entry without generating a public page for it yet.

- [x] **Step 6: Commit the content model**

~~~bash
git add src/config.ts src/content/types.ts src/content.config.ts src/content/work/four-practical-solidity-patterns.md
git commit -m "feat: add typed work collection"
~~~


---

### Task 3: Build shared layout, metadata, and responsive editorial styles

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/WorkItem.astro`
- Create: `public/favicon.svg`
- Create: `public/robots.txt`

**Interfaces:**
- `BaseLayout` accepts `title`, `description`, optional `canonicalUrl`, and optional `ogType`, then yields page content through a slot.
- `ArticleLayout` accepts title, description, published date, optional updated date, and optional canonical URL, then yields rendered Markdown content.
- `WorkItem` accepts one `CollectionEntry<'work'>` and a one-based display index.

- [x] **Step 1: Create the complete global CSS**

Create `src/styles/global.css` with this CSS contract:

~~~css
:root {
  --paper: #f5f1e8;
  --paper-deep: #ece5d8;
  --ink: #252421;
  --muted: #6f6a61;
  --rule: #d8d0c2;
  --accent: #965a3c;
  --accent-dark: #70422d;
  --content: min(1120px, calc(100% - 3rem));
  --reading: 72ch;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--ink);
  background: var(--paper);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; background: var(--paper); color: var(--ink); line-height: 1.65; }
a { color: inherit; text-decoration-thickness: 0.08em; text-underline-offset: 0.18em; }
a:hover { color: var(--accent-dark); }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 0.25rem; }
::selection { background: var(--paper-deep); }

.site-shell { width: var(--content); margin: 0 auto; }
.site-header { display: flex; align-items: baseline; justify-content: space-between; gap: 2rem; padding: 1.5rem 0; border-bottom: 1px solid var(--rule); }
.site-mark { font-weight: 700; letter-spacing: -0.02em; text-decoration: none; }
.site-nav, .contact-links { display: flex; flex-wrap: wrap; gap: 1rem 1.25rem; align-items: baseline; list-style: none; margin: 0; padding: 0; }
.site-nav a, .contact-links a { font-size: 0.82rem; color: var(--muted); text-decoration: none; }
.site-nav a:hover, .contact-links a:hover { color: var(--ink); }
.page-shell { padding: 5.5rem 0 7rem; }
.hero { max-width: 52rem; padding: 4rem 0 6.5rem; }
.eyebrow { margin: 0 0 1rem; color: var(--accent-dark); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
h1, h2, h3 { margin: 0; color: var(--ink); font-family: Georgia, "Times New Roman", serif; font-weight: 500; letter-spacing: -0.035em; line-height: 1.1; }
h1 { max-width: 12ch; font-size: clamp(3rem, 8vw, 6.7rem); }
h2 { font-size: clamp(2rem, 4vw, 3.2rem); }
h3 { font-size: 1.45rem; }
.hero-copy { max-width: 40rem; margin: 2rem 0 2.25rem; color: var(--muted); font-size: clamp(1.1rem, 2vw, 1.35rem); }
.text-link { color: var(--accent-dark); font-weight: 700; text-decoration: none; }
.section { padding: 4.5rem 0; border-top: 1px solid var(--rule); }
.section-heading { display: grid; grid-template-columns: minmax(8rem, 0.28fr) 1fr; gap: 2rem; align-items: baseline; margin-bottom: 2.5rem; }
.section-heading p { max-width: 42rem; margin: 0; color: var(--muted); }
.work-list { margin: 0; padding: 0; list-style: none; }
.work-item { display: grid; grid-template-columns: 4rem minmax(0, 1fr); gap: 1.25rem; padding: 2rem 0 2.25rem; border-top: 1px solid var(--rule); }
.work-number { color: var(--accent); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.8rem; }
.work-meta { margin: 0 0 0.7rem; color: var(--muted); font-size: 0.8rem; }
.work-title { max-width: 26ch; font-size: clamp(1.65rem, 3vw, 2.5rem); }
.work-description { max-width: 52ch; margin: 0.9rem 0 1.1rem; color: var(--muted); }
.copy-block { max-width: var(--reading); }
.copy-block p { margin: 0 0 1.25rem; }
.page-copy { max-width: var(--reading); }
.page-copy h1 { max-width: none; margin-bottom: 3.5rem; font-size: clamp(3rem, 7vw, 5.8rem); }
.page-copy h2 { margin: 4rem 0 1.5rem; }
.site-footer { display: flex; justify-content: space-between; gap: 2rem; padding: 2rem 0 3rem; border-top: 1px solid var(--rule); color: var(--muted); font-size: 0.82rem; }
.site-footer p { margin: 0; }
.article-shell { padding: 5.5rem 0 7rem; }
.article { max-width: var(--reading); margin: 0 auto; }
.article-header { margin-bottom: 4rem; }
.article-header h1 { max-width: none; font-size: clamp(2.8rem, 7vw, 5.4rem); }
.article-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; margin-top: 1.25rem; color: var(--muted); font-size: 0.85rem; }
.article-description { max-width: 48rem; margin: 1.5rem 0 0; color: var(--muted); font-size: 1.1rem; }
.article-body { font-size: 1.05rem; }
.article-body h2 { margin: 3.5rem 0 1rem; }
.article-body h3 { margin: 2.5rem 0 0.75rem; }
.article-body p, .article-body ul, .article-body ol, .article-body blockquote, .article-body table, .article-body figure { margin: 0 0 1.5rem; }
.article-body ul, .article-body ol { padding-left: 1.4rem; }
.article-body li + li { margin-top: 0.4rem; }
.article-body blockquote { margin-left: 0; padding: 0 0 0 1.25rem; border-left: 2px solid var(--accent); color: var(--muted); }
.article-body code { padding: 0.12em 0.3em; background: var(--paper-deep); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.88em; }
.article-body pre { max-width: 100%; margin: 0 0 1.75rem; padding: 1rem 1.1rem; overflow-x: auto; background: #2b2a27; color: #f6f0e6; font: 0.85rem/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.article-body pre code { padding: 0; background: transparent; color: inherit; }
.article-body a { color: var(--accent-dark); }
.article-body img { display: block; max-width: 100%; height: auto; }
.article-body figure:not(.wide) { width: fit-content; max-width: 100%; }
.article-body figcaption { margin-top: 0.6rem; color: var(--muted); font-size: 0.85rem; }
.article-body .wide { width: min(calc(100vw - 3rem), 70rem); margin-left: 50%; transform: translateX(-50%); }
.article-body table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; }
.article-body th, .article-body td { padding: 0.65rem 0.8rem; border: 1px solid var(--rule); text-align: left; vertical-align: top; }
.article-body th { background: var(--paper-deep); font-weight: 700; }
.not-found { min-height: 65vh; display: grid; align-content: center; }

@media (max-width: 720px) {
  :root { --content: min(100% - 2rem, 1120px); }
  .site-header, .site-footer { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .page-shell, .article-shell { padding-top: 3.5rem; }
  .hero { padding: 2rem 0 4rem; }
  h1 { font-size: clamp(2.8rem, 16vw, 4.8rem); }
  .section-heading { display: block; }
  .section-heading p { margin-top: 1rem; }
  .work-item { grid-template-columns: 2.5rem minmax(0, 1fr); gap: 0.75rem; }
  .article-body .wide { width: 100%; margin-left: 0; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
~~~

- [x] **Step 2: Add the document metadata layout**

~~~astro
---
import { siteConfig } from '../config';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  canonicalUrl?: string | null;
  ogType?: 'website' | 'article';
}

const {
  title = siteConfig.name,
  description = siteConfig.description,
  canonicalUrl = new URL(Astro.url.pathname, siteConfig.url).toString(),
  ogType = 'website',
} = Astro.props;

const pageTitle = title === siteConfig.name ? title : title + ' - ' + siteConfig.name;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content={ogType} />
    <meta property="og:site_name" content={siteConfig.name} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
    <title>{pageTitle}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
~~~

- [x] **Step 3: Add header, footer, article layout, and work item**

~~~astro
---
// src/components/Header.astro
import { siteConfig } from '../config';
---

<header class="site-header">
  <a class="site-mark" href="/">{siteConfig.name}</a>
  <nav aria-label="Primary navigation">
    <ul class="site-nav">
      <li><a href="/#work">Work</a></li>
      <li><a href="/about">About</a></li>
      <li><a href={siteConfig.social.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></li>
      {siteConfig.social.xUrl && <li><a href={siteConfig.social.xUrl} target="_blank" rel="noopener noreferrer">X <span aria-hidden="true">↗</span></a></li>}
      <li><a href={siteConfig.social.mediumUrl} target="_blank" rel="noopener noreferrer">Medium <span aria-hidden="true">↗</span></a></li>
    </ul>
  </nav>
</header>
~~~

~~~astro
---
// src/components/Footer.astro
import { siteConfig } from '../config';
---

<footer class="site-footer">
  <p>{siteConfig.name}</p>
  <p><a href="/#contact">Contact</a></p>
</footer>
~~~

~~~astro
---
// src/layouts/ArticleLayout.astro
import BaseLayout from './BaseLayout.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';

interface Props {
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt?: Date;
  canonicalUrl?: string;
}

const { title, description, publishedAt, updatedAt, canonicalUrl } = Astro.props;
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl} ogType="article">
  <div class="site-shell">
    <Header />
    <main class="article-shell">
      <article class="article">
        <header class="article-header">
          <p class="eyebrow">Work</p>
          <h1>{title}</h1>
          <div class="article-meta">
            <time datetime={publishedAt.toISOString()}>{publishedAt.getFullYear()}</time>
            {updatedAt && <span>Updated {updatedAt.getFullYear()}</span>}
          </div>
          <p class="article-description">{description}</p>
        </header>
        <div class="article-body">
          <slot />
        </div>
      </article>
    </main>
    <Footer />
  </div>
</BaseLayout>
~~~

~~~astro
---
// src/components/WorkItem.astro
import type { CollectionEntry } from 'astro:content';

import { WORK_LINK_LABEL, WORK_TYPE_LABEL } from '../content/types';

interface Props {
  entry: CollectionEntry<'work'>;
  index: number;
}

const { entry, index } = Astro.props;
const { data } = entry;
const href = data.externalUrl ?? '/work/' + entry.id;
---

<li class="work-item">
  <span class="work-number" aria-hidden="true">{String(index).padStart(2, '0')}</span>
  <div>
    <p class="work-meta">{WORK_TYPE_LABEL[data.type]} · {data.publishedAt.getFullYear()}</p>
    <h3 class="work-title">
      <a href={href} target={data.externalUrl ? '_blank' : undefined} rel={data.externalUrl ? 'noopener noreferrer' : undefined}>{data.title}</a>
    </h3>
    <p class="work-description">{data.description}</p>
    <a class="text-link" href={href} target={data.externalUrl ? '_blank' : undefined} rel={data.externalUrl ? 'noopener noreferrer' : undefined}>
      {WORK_LINK_LABEL[data.type]}
    </a>
  </div>
</li>
~~~

- [x] **Step 4: Add public utility assets**

~~~svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-labelledby="title">
  <title id="title">kyzooghost</title>
  <rect width="32" height="32" rx="3" fill="#f5f1e8" />
  <path d="M9 7v18M9 17 22 7M9 17l13 8" fill="none" stroke="#965a3c" stroke-width="2.5" stroke-linecap="square" />
</svg>
~~~

~~~text
# public/robots.txt
User-agent: *
Allow: /
~~~

- [x] **Step 5: Run shared-layer checks and commit**

Run:

~~~bash
npm run check
npm run build
git add src/styles/global.css src/layouts/BaseLayout.astro src/layouts/ArticleLayout.astro src/components/Header.astro src/components/Footer.astro src/components/WorkItem.astro public/favicon.svg public/robots.txt
git commit -m "feat: add editorial site foundation"
~~~

Expected: Astro checks and build exit 0.

---

### Task 4: Implement the home, About, internal work, and 404 pages

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/work/[...slug].astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Home consumes `getCollection('work')`, filters `draft !== true && featured === true`, sorts by `publishedAt` descending, and renders `WorkItem`.
- Internal work consumes published entries without `externalUrl` and renders Markdown through `ArticleLayout`.

- [x] **Step 1: Replace the shell with the complete home page**

~~~astro
---
import { getCollection } from 'astro:content';

import { siteConfig } from '../config';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import WorkItem from '../components/WorkItem.astro';
import BaseLayout from '../layouts/BaseLayout.astro';

const work = (await getCollection('work', ({ data }) => !data.draft && data.featured)).sort(
  (left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf(),
);
---

<BaseLayout description={siteConfig.description}>
  <div class="site-shell">
    <Header />
    <main>
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">Technical work and judgment in public</p>
        <h1 id="hero-title">I build high-stakes financial infrastructure.</h1>
        <p class="hero-copy">I turn difficult security, product, and operating trade-offs into products people can trust.</p>
        <a class="text-link" href="#work">Selected work <span aria-hidden="true">↓</span></a>
      </section>

      <section class="section" id="work" aria-labelledby="work-title">
        <div class="section-heading">
          <h2 id="work-title">Selected work</h2>
          <p>A small record of technical artifacts, decisions, and evidence.</p>
        </div>
        <ol class="work-list">
          {work.map((entry, index) => <WorkItem entry={entry} index={index + 1} />)}
        </ol>
      </section>

      <section class="section" aria-labelledby="how-title">
        <div class="section-heading">
          <h2 id="how-title">How I work</h2>
        </div>
        <div class="copy-block">
          <p>I work on systems where design errors have important consequences.</p>
          <p>I make the constraints clear. I test the important assumptions. I then build evidence for the selected decision.</p>
        </div>
      </section>

      <section class="section" aria-labelledby="about-title">
        <div class="section-heading">
          <h2 id="about-title">About</h2>
        </div>
        <div class="copy-block">
          <p>I am a software engineer with a previous career in medicine.</p>
          <p>My work covers blockchain protocols, financial systems, distributed systems, and product security.</p>
          <a class="text-link" href="/about">More about how I work <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section class="section" id="contact" aria-labelledby="contact-title">
        <div class="section-heading">
          <h2 id="contact-title">Contact</h2>
        </div>
        <div class="copy-block">
          <p>I am interested in difficult financial infrastructure problems and commercially important product decisions.</p>
          <ul class="contact-links" aria-label="Contact links">
            <li><a href={siteConfig.social.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></li>
            <li><a href={siteConfig.social.telegramUrl} target="_blank" rel="noopener noreferrer">Telegram <span aria-hidden="true">↗</span></a></li>
            <li><a href={siteConfig.social.mediumUrl} target="_blank" rel="noopener noreferrer">Medium <span aria-hidden="true">↗</span></a></li>
            {siteConfig.social.xUrl && <li><a href={siteConfig.social.xUrl} target="_blank" rel="noopener noreferrer">X <span aria-hidden="true">↗</span></a></li>}
          </ul>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</BaseLayout>
~~~

- [x] **Step 2: Add the concise About page**

~~~astro
---
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About" description="How kyzooghost approaches technical decisions with security, financial, and product consequences.">
  <div class="site-shell">
    <Header />
    <main class="page-shell page-copy">
      <p class="eyebrow">About</p>
      <h1>About</h1>
      <p>I am a software engineer with a previous career in medicine.</p>
      <p>I work on systems where technical decisions have important security, financial, and product consequences.</p>
      <p>My work covers blockchain protocols, financial systems, distributed systems, and product security.</p>
      <p>I am particularly interested in problems where several reasonable requirements conflict and there is no obviously correct design.</p>
      <p>My approach is to make those constraints explicit, identify the important failure modes, and build enough evidence to make the decision clear.</p>
      <h2>What I care about</h2>
      <p>I am interested in building products that solve recurring and painful problems.</p>
      <p>I particularly enjoy work where good engineering judgment can turn difficult infrastructure into something people can safely use.</p>
    </main>
    <Footer />
  </div>
</BaseLayout>
~~~

- [x] **Step 3: Add the future internal work template**

~~~astro
---
import type { CollectionEntry } from 'astro:content';
import { getCollection, render } from 'astro:content';

import ArticleLayout from '../../layouts/ArticleLayout.astro';

interface Props {
  entry: CollectionEntry<'work'>;
}

export async function getStaticPaths() {
  const entries = await getCollection('work', ({ data }) => !data.draft && !data.externalUrl);
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props as Props;
const { Content } = await render(entry);
const { data } = entry;
---

<ArticleLayout
  title={data.title}
  description={data.description}
  publishedAt={data.publishedAt}
  updatedAt={data.updatedAt}
  canonicalUrl={data.canonicalUrl}
>
  <Content />
</ArticleLayout>
~~~

- [x] **Step 4: Add the custom 404 page**

~~~astro
---
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page not found" description="The requested page could not be found." canonicalUrl={null}>
  <div class="site-shell">
    <Header />
    <main class="page-shell not-found">
      <p class="eyebrow">404</p>
      <h1>That page is not here.</h1>
      <p><a class="text-link" href="/">Return home <span aria-hidden="true">→</span></a></p>
    </main>
    <Footer />
  </div>
</BaseLayout>
~~~

- [x] **Step 5: Run page checks and inspect generated routes**

Run:

~~~bash
npm run check
npm run build
find dist -maxdepth 3 -type f | sort
rg -ni "employer|employment|location|real name" dist src public README.md
~~~

Expected: checks and build exit 0; the generated home page contains the exact Medium URL; no internal page is generated for the external entry; the employer search returns no matches.

- [x] **Step 6: Commit the pages**

~~~bash
git add src/pages/index.astro src/pages/about.astro 'src/pages/work/[...slug].astro' src/pages/404.astro
git commit -m "feat: publish initial site pages"
~~~

---

### Task 5: Document maintenance and complete release verification

**Files:**
- Create: `README.md`

**Interfaces:**
- README commands must match `package.json` and the collection path in `src/content.config.ts`.
- The release checklist becomes the evidence used in the draft PR description.

- [x] **Step 1: Write the repository README**

~~~~md
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

~~~bash
npm install
npm run dev
~~~

Open the local URL printed by Astro. Use `npm run build` to generate `dist/`, `npm run preview` to preview that build, and `npm run check` for Astro and TypeScript checks.

## Deployment

`.github/workflows/check.yml` runs on pull requests and pushes to `main`. It installs the locked dependencies, runs `npm run check`, and builds the site.

`.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages when `main` changes or when the workflow is manually dispatched. In the repository’s Pages settings, choose GitHub Actions as the publishing source. The site URL is configured in `astro.config.mjs` as `https://kyzooghost.github.io`.

## Add an external artifact

Add one Markdown file under `src/content/work/` with the required frontmatter. Set `externalUrl`, the appropriate `type`, `featured: true`, and `draft: false`; the home page only lists featured, published entries and links directly to the external source.

## Add an internal case study

Add one Markdown file under `src/content/work/` with `externalUrl` omitted and frontmatter containing every required field:

~~~yaml
---
title: A concise case-study title
description: A one-sentence summary
publishedAt: 2025-01-01
type: case-study
featured: false
draft: false
# Optional: updatedAt, tags, canonicalUrl
---
~~~

Use `draft: false` when publishing. Write the body with normal Markdown headings such as Problem, Why it mattered, Conflicting constraints, Options considered, Decision, Evidence, Result, and Remaining uncertainty. The route uses the filename stem without `.md`: `incident-response.md` renders at `/work/incident-response`.

## Configure social links

Edit `src/config.ts`. GitHub, Medium, Telegram, and X are configured there. Set `xUrl` to `null` to omit X from the site when no profile should be shown.
~~~~

- [x] **Step 2: Run the complete verification suite**

Run:

~~~bash
npm install
npm run check
npm run build
git diff --check
rg -ni "employer|employment|location|real name" dist src public README.md || true
rg -n "https://medium.com/@kyzooghost/four-practical-solidity-patterns-from-gnosis-safe-e8251f90a7ba" dist/index.html
~~~

Expected: install, checks, build, and whitespace validation exit 0; the privacy scan finds no employer details; the Medium URL appears in generated home markup.

- [x] **Step 3: Inspect responsive output**

Start the built site:

~~~bash
npm run preview -- --host 127.0.0.1
~~~

Inspect `/` and `/about` at a desktop viewport around `1440x900` and a mobile viewport around `390x844`. Confirm the header wraps without horizontal overflow, the single work item reads as an editorial list rather than cards, heading hierarchy is clear, links have visible focus states, and future code/table styles are constrained.

- [x] **Step 4: Establish the remote base and push the implementation branch**

Because the supplied GitHub repository has no commits, establish `main` from the already committed design base before publishing implementation commits:

~~~bash
git branch -f main b6a9775
git push origin main
git push --set-upstream origin agent/kyzooghost-site
~~~

The implementation branch remains the only branch receiving site code. Do not commit implementation changes directly to `main`.

- [x] **Step 5: Review the release diff and commit documentation**

~~~bash
git status --short --branch
git diff main...HEAD --stat
git diff --check main...HEAD
git add README.md
git commit -m "docs: document site maintenance"
~~~

- [x] **Step 6: Open the requested draft PR after previewing its metadata**

Use the `create-pr` skill’s preview-first command flow with:

- Title: `Build initial kyzooghost website`
- Base: `main`
- Head: `agent/kyzooghost-site`
- Draft: yes

The description must cover the site architecture, restrained design direction, supplied content, GitHub Pages workflow, checks performed, and the configured X profile at `https://x.com/kyzookyzoo`. It must not mention any real name, employer, private context, or internal source.

---

## Plan self-review

- Spec coverage: the plan covers the typed collection, direct Medium artifact, internal work template, home/About/contact copy, responsive editorial CSS, metadata, favicon, robots, 404, README, official Pages workflow, exact package versions, lockfile, branch/PR workflow, and required validation.
- Placeholder scan: the plan contains no unfinished implementation markers; future case studies are intentionally represented by the explicit Markdown content contract.
- Type consistency: `CollectionEntry<'work'>`, `WORK_TYPE_VALUES`, `WORK_TYPE_LABEL`, `WORK_LINK_LABEL`, `siteConfig`, and all layout props are defined before their consumers.
- Deliberate omission: no unit-test framework is introduced because v1 has no isolated runtime behavior; `astro check`, static build output, generated-link scans, and viewport inspection are the appropriate checks for this static site.
