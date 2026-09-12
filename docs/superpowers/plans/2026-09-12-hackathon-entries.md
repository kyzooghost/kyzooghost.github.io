# Add ETHGlobal Hackathon Entries - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two ETHGlobal hackathon finalist entries to the Selected Work section, each with a primary showcase link and a secondary announcement link.

**Architecture:** Extend the Zod content schema with one optional `secondaryUrl` field, update the `WorkItem` component to conditionally render a second link, and add two Markdown content files. No routing, layout, or type system changes.

**Tech Stack:** Astro 7, Zod, Markdown frontmatter

**Validation:** This project has no test framework. Validation uses `npm run check` (Astro + TypeScript diagnostics) and `npm run build` (static site generation). These catch schema violations, type errors, and broken content.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/content.config.ts` | Modify | Add optional `secondaryUrl` field to work schema |
| `src/components/WorkItem.astro` | Modify | Render secondary link when `secondaryUrl` is present |
| `src/content/work/ethglobal-sydney-zeke.md` | Create | ETHGlobal Sydney 2024 finalist entry |
| `src/content/work/ethglobal-bangkok-zubernetes.md` | Create | ETHGlobal Bangkok 2024 finalist entry |

---

### Task 1: Add `secondaryUrl` to content schema

**Files:**
- Modify: `src/content.config.ts:21-35`

- [ ] **Step 1: Add the field to the Zod schema**

In `src/content.config.ts`, add `secondaryUrl` as an optional `httpUrl` field after the existing `externalUrl` field. The `httpUrl` refinement is already defined in this file.

```typescript
// In the z.object() inside defineCollection, after line 32 (externalUrl):
secondaryUrl: httpUrl.optional(),
```

The full schema block should read:

```typescript
schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    type: z.enum(WORK_TYPE_VALUES),
    featured: z.boolean(),
    draft: z.boolean(),
    externalUrl: httpUrl.optional(),
    secondaryUrl: httpUrl.optional(),
    tags: z.array(z.string()).optional(),
    canonicalUrl: httpUrl.optional(),
}),
```

- [ ] **Step 2: Run checks to verify schema is valid**

Run: `npm run check`
Expected: PASS with no errors (existing content files still validate since the field is optional)

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add optional secondaryUrl field to work content schema"
```

---

### Task 2: Update WorkItem to render secondary link

**Files:**
- Modify: `src/components/WorkItem.astro:14-28`

- [ ] **Step 1: Add secondary link rendering**

In `src/components/WorkItem.astro`, add a conditional secondary link after the existing `text-link` anchor (after line 26). The full template section should read:

```astro
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
    {data.secondaryUrl && (
      <a class="text-link" href={data.secondaryUrl} target="_blank" rel="noopener noreferrer">
        See announcement ↗
      </a>
    )}
  </div>
</li>
```

- [ ] **Step 2: Run checks to verify component compiles**

Run: `npm run check`
Expected: PASS - Astro infers `secondaryUrl` from the Zod schema, so the type is available on `data` without manual typing.

- [ ] **Step 3: Run build to verify existing content still renders**

Run: `npm run build`
Expected: PASS - the existing Solidity article has no `secondaryUrl`, so the conditional renders nothing for it.

- [ ] **Step 4: Commit**

```bash
git add src/components/WorkItem.astro
git commit -m "feat: render secondary link in WorkItem when secondaryUrl is present"
```

---

### Task 3: Add ETHGlobal Sydney content file

**Files:**
- Create: `src/content/work/ethglobal-sydney-zeke.md`

- [ ] **Step 1: Create the content file**

Create `src/content/work/ethglobal-sydney-zeke.md` with the following content:

```markdown
---
title: ETHGlobal Sydney 2024 - Finalist
description: Peer-to-peer fiat on/off ramp using ZK proofs of PayPal payment emails, delivered through a Telegram bot.
publishedAt: 2024-05-05
type: external-artifact
featured: true
draft: false
externalUrl: https://ethglobal.com/showcase/zeke-xarwm
secondaryUrl: https://x.com/Nethermind/status/1788533651484946490
tags:
  - ZK
  - Solidity
  - Telegram
  - ETHGlobal
---
```

No Markdown body - this is an external artifact that links out.

- [ ] **Step 2: Run build to verify content parses and renders**

Run: `npm run build`
Expected: PASS - the new entry should appear in the build output. Check for the entry in the generated pages.

- [ ] **Step 3: Commit**

```bash
git add src/content/work/ethglobal-sydney-zeke.md
git commit -m "content: add ETHGlobal Sydney 2024 finalist entry"
```

---

### Task 4: Add ETHGlobal Bangkok content file

**Files:**
- Create: `src/content/work/ethglobal-bangkok-zubernetes.md`

- [ ] **Step 1: Create the content file**

Create `src/content/work/ethglobal-bangkok-zubernetes.md` with the following content:

```markdown
---
title: ETHGlobal Bangkok 2024 - Finalist
description: Container orchestration with ZK proofs and TEEs for verifiable cloud computing. Finalist amongst 700+ teams.
publishedAt: 2024-11-17
type: external-artifact
featured: true
draft: false
externalUrl: https://ethglobal.com/showcase/zubernetes-zk8s-vvchq
secondaryUrl: https://x.com/ETHGlobal/status/1858086037970723238
tags:
  - ZK
  - TEE
  - Solidity
  - ETHGlobal
---
```

No Markdown body - this is an external artifact that links out.

- [ ] **Step 2: Run build to verify content parses and renders**

Run: `npm run build`
Expected: PASS - both new entries now appear. The home page should list three work items sorted by date: Bangkok (Nov 2024), Sydney (May 2024), Solidity patterns (Mar 2022).

- [ ] **Step 3: Commit**

```bash
git add src/content/work/ethglobal-bangkok-zubernetes.md
git commit -m "content: add ETHGlobal Bangkok 2024 finalist entry"
```

---

### Task 5: Final validation

- [ ] **Step 1: Run full check and build**

Run: `npm run check && npm run build`
Expected: Both pass with zero errors.

- [ ] **Step 2: Visual check with dev server**

Run: `npm run dev`

Open `http://localhost:4321` and verify:

1. Three entries appear under "Selected work"
2. Order is: 01 Bangkok, 02 Sydney, 03 Solidity patterns
3. Each hackathon entry shows two links: "Read externally ↗" and "See announcement ↗"
4. The Solidity patterns entry still shows only "Read on Medium ↗" (no secondary link)
5. All four links on the new entries open in new tabs to the correct URLs
