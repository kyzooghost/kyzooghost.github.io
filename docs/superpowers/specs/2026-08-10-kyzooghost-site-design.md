# kyzooghost v1 personal site design

## Goal

Build a quiet, static public home for the pseudonymous professional identity `kyzooghost`. The site should make one substantial technical artifact easy to publish approximately every two months without turning v1 into a blog or a portfolio template.

## Architecture

The site will use Astro with TypeScript where useful, Astro Content Collections for one `work` collection, Markdown or MDX for future internal case studies, and plain CSS. Astro will prerender every route as static HTML.

The collection will support both internal case studies and external artifacts. A published entry without `externalUrl` will render through `/work/[slug]`; an entry with `externalUrl` will link directly to the external artifact from the editorial home list. This keeps the supplied Medium artifact direct and avoids copying its article body into the repository.

Shared layout and navigation responsibilities will be split into focused Astro files:

- `BaseLayout.astro` owns document metadata, canonical URLs, Open Graph tags, and global styles.
- `Header.astro` owns the small site navigation and configured social links.
- `Footer.astro` owns the closing identity and link treatment.
- `WorkItem.astro` owns numbered editorial work-list entries.
- `ArticleLayout.astro` owns the narrower long-form reading column and article metadata.

The home page will query the collection, exclude drafts, sort by `publishedAt` descending, and render an editorial list rather than a card grid. The internal work route will render future Markdown or MDX body content without enforcing a section schema in code; headings such as Problem, Decision, Evidence, and Remaining uncertainty remain normal editorial Markdown.

## Content model

`src/content.config.ts` will define the following typed fields:

- `title`: required string.
- `description`: required string.
- `publishedAt`: required date.
- `updatedAt`: optional date.
- `type`: required enum-like string union for case studies, external artifacts, earlier technical writing, and project pages.
- `featured`: required boolean.
- `draft`: required boolean.
- `externalUrl`: optional URL.
- `tags`: optional array of strings.
- `canonicalUrl`: optional URL.

The initial entry will be the supplied “Four practical Solidity patterns from Gnosis Safe” Medium article, marked as earlier technical writing and external. Its year will be shown only if the article metadata can be verified reliably; otherwise the year will be omitted.

## Routes and content

- `/`: hero, selected work, How I work, About preview, and Contact.
- `/about`: concise supplied biography and “What I care about”.
- `/work/[slug]`: future internal case studies rendered from the collection.
- `/404`: custom not-found page.
- `/robots.txt`: static robots policy.

No `/blog` route, fake future projects, employment history, location, real name, analytics, cookies, tracking, newsletter, comments, search, or client-side UI state will be added.

## Visual language

The visual direction is calm Japanese minimalism interpreted through editorial typography and proportion rather than decorative motifs. The default uses a warm off-white paper-like background, dark charcoal text, one muted accent, thin rules, generous whitespace, and a strong left-aligned reading rhythm. Normal article text is limited to approximately `65-75ch`; figures, diagrams, and selected tables can use a wider column.

The responsive layout will work without a navigation script. Header links will wrap cleanly on small screens, code blocks will scroll within their own container, and wide technical figures will not force the document viewport to overflow. Focus states will be visible and keyboard navigation will use semantic links and landmarks.

## Delivery

`astro.config.mjs` will set `site: 'https://kyzooghost.github.io'` and omit `base`, because the repository follows the special `kyzooghost.github.io` user-site pattern. `.github/workflows/deploy.yml` will follow Astro’s official GitHub Pages guidance: push to `main` or manual dispatch, `withastro/action` for build/upload, and `actions/deploy-pages` for publishing. GitHub Pages will be configured to use GitHub Actions.

`src/config.ts` will centralize the site name, description, canonical URL, GitHub URL, Medium URL, Telegram URL, and nullable X URL. Components will not scatter social URLs or render empty X links.

## Validation

Before opening the draft PR, verification will include dependency installation with a committed lockfile, Astro build, Astro checks or TypeScript checks if configured, inspection of generated links and metadata, internal-link checks, a search for any real-name or invented-employer references, confirmation of the Medium URL in generated markup, and viewport inspection at desktop and mobile widths when local browser tooling is available.

## Out of scope for v1

RSS, reading-time calculation, syntax-highlighting customization, dark mode, a separate writing taxonomy, a CMS, a database, React/Vue, Tailwind, component libraries, and decorative motion are intentionally deferred until they solve a demonstrated need.

## Grill-plan decision ledger

### Human-owned decisions

- External work entries link directly to their source; internal entries render through `/work/[slug]`.
- The site remains a work-focused publication rather than introducing a separate blog section.
- The identity stays pseudonymous and uses only the supplied copy and configured links.

### Agent-owned decisions

- Use the current official Astro content-collection conventions and deployment action versions available at implementation time.
- Use Markdown for the initial internal article format; add MDX only when a real artifact requires it.
- Omit the Medium artifact year if its publication metadata cannot be verified reliably.
- Choose the smallest accessible CSS and metadata implementation that satisfies the approved visual contract.

### Deferred implementation decisions

- Exact CSS values, component prop shapes, file names beyond the approved structure, and test command details will be settled in the implementation plan and local verification.
- GitHub Pages repository bootstrap details are operational work required to create a `main` base for the requested draft PR.

### Residual risks

- The external Medium page may not expose a stable publication date to a static build; the design explicitly permits omitting the year.
- Browser-level visual inspection depends on local tooling availability; generated HTML, CSS, and build output remain the required verification baseline.
