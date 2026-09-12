# Linea Yield Boost Portfolio Entry - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Production system" portfolio entry for Yield Boost at Linea with an internal case study page, a new work type, and updated WorkItem link logic.

**Architecture:** Add `production-system` work type to `types.ts`. Update `WorkItem.astro` to show both primary and secondary links for non-hackathon entries. Create a Markdown content file with frontmatter and body that generates an internal page at `/work/linea-yield-boost`.

**Tech Stack:** Astro 7, Zod, Markdown frontmatter

**Validation:** No test framework. Validation uses `npm run check` (Astro + TypeScript diagnostics) and `npm run build` (static site generation).

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/content/types.ts` | Modify | Add `productionSystem` work type with label and link label |
| `src/components/WorkItem.astro` | Modify | Show both links for non-hackathon entries with secondaryUrl |
| `src/styles/global.css` | Modify | Re-add `.secondary-link` spacing class |
| `src/content/work/linea-yield-boost.md` | Create | Content file with frontmatter + Markdown body |

---

### Task 1: Add `productionSystem` work type

**Files:**
- Modify: `src/content/types.ts`

- [ ] **Step 1: Add the work type constant, label, and link label**

Add `productionSystem` to all four structures in `src/content/types.ts`. After the `hackathon` entries in each:

In `WORK_TYPE`:
```typescript
  hackathon: 'hackathon',
  productionSystem: 'production-system',
```

In `WORK_TYPE_VALUES`:
```typescript
  WORK_TYPE.hackathon,
  WORK_TYPE.productionSystem,
```

In `WORK_TYPE_LABEL`:
```typescript
  [WORK_TYPE.hackathon]: 'Hackathon',
  [WORK_TYPE.productionSystem]: 'Production system',
```

In `WORK_LINK_LABEL`:
```typescript
  [WORK_TYPE.hackathon]: 'View project ↗',
  [WORK_TYPE.productionSystem]: 'Read more →',
```

- [ ] **Step 2: Run checks**

Run: `npm run check`
Expected: PASS with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/types.ts
git commit -m "feat: add production-system work type"
```

---

### Task 2: Update WorkItem to show both links for non-hackathon entries

**Files:**
- Modify: `src/components/WorkItem.astro`
- Modify: `src/styles/global.css:50`

- [ ] **Step 1: Re-add `.secondary-link` CSS class**

In `src/styles/global.css`, add after the `.work-description` rule (line 50):

```css
.secondary-link { margin-left: 1rem; }
```

- [ ] **Step 2: Update WorkItem link logic**

The current `WorkItem.astro` shows secondary OR primary (mutually exclusive). Change it to:
- Hackathon entries with `secondaryUrl`: show only secondary link (unchanged behavior)
- Non-hackathon entries with `secondaryUrl`: show both primary CTA and secondary link
- Entries without `secondaryUrl`: show only primary CTA (unchanged behavior)

Replace the entire file content of `src/components/WorkItem.astro` with:

```astro
---
import type { CollectionEntry } from 'astro:content';

import { WORK_LINK_LABEL, WORK_TYPE, WORK_TYPE_LABEL } from '../content/types';

const SHORT_MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

interface Props {
  entry: CollectionEntry<'work'>;
  index: number;
}

const { entry, index } = Astro.props;
const { data } = entry;
const href = data.externalUrl ?? '/work/' + entry.id;
const dateLabel = `${SHORT_MONTH[data.publishedAt.getMonth()]} ${data.publishedAt.getFullYear()}`;
const isHackathon = data.type === WORK_TYPE.hackathon;
---

<li class="work-item">
  <span class="work-number" aria-hidden="true">{String(index).padStart(2, '0')}</span>
  <div>
    <p class="work-meta">{WORK_TYPE_LABEL[data.type]} · {dateLabel}</p>
    <h3 class="work-title">
      <a href={href} target={data.externalUrl ? '_blank' : undefined} rel={data.externalUrl ? 'noopener noreferrer' : undefined}>{data.title}</a>
    </h3>
    <p class="work-description">{data.description}</p>
    {isHackathon && data.secondaryUrl ? (
      <a class="text-link" href={data.secondaryUrl} target="_blank" rel="noopener noreferrer">
        View X announcement ↗
      </a>
    ) : (
      <>
        <a class="text-link" href={href} target={data.externalUrl ? '_blank' : undefined} rel={data.externalUrl ? 'noopener noreferrer' : undefined}>
          {WORK_LINK_LABEL[data.type]}
        </a>
        {data.secondaryUrl && (
          <a class="text-link secondary-link" href={data.secondaryUrl} target="_blank" rel="noopener noreferrer">
            View X announcement ↗
          </a>
        )}
      </>
    )}
  </div>
</li>
```

Key changes from current file:
- Re-import `WORK_TYPE` (removed in an earlier change)
- Add `isHackathon` constant
- Hackathon + secondaryUrl: only show secondary link (unchanged behavior)
- Everything else: show primary CTA, optionally followed by secondary link with `.secondary-link` spacing class

- [ ] **Step 3: Run checks**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 4: Run build to verify existing entries still render**

Run: `npm run build`
Expected: PASS - 3 pages built. Existing hackathon entries should still show only "View X announcement ↗". Solidity entry should still show only "Read on Medium ↗".

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkItem.astro src/styles/global.css
git commit -m "feat: show both primary and secondary links for non-hackathon entries"
```

---

### Task 3: Add Linea Yield Boost content file

**Files:**
- Create: `src/content/work/linea-yield-boost.md`

- [ ] **Step 1: Create the content file**

Create `src/content/work/linea-yield-boost.md` with the following content:

````markdown
---
title: Yield Boost at Linea
description: "Native yield system that stakes bridged ETH on the beacon chain and distributes rewards to L2 users. Audited by OpenZeppelin, Diligence and Cyfrin. 80M+ USD staked."
publishedAt: 2026-03-01
type: production-system
featured: true
draft: false
secondaryUrl: https://x.com/LineaBuild/status/2038641367035854875
tags:
  - Solidity
  - Ethereum
  - L2
  - Staking
  - DeFi
---

## Overview

Yield Boost is a native yield system for the Linea L2 bridge. It stakes a portion of bridged ETH deposits on the Ethereum beacon chain via Lido V3 stVaults, and distributes staking rewards to L2 users. As of September 2026, more than 80M USD is staked through it.

I drove the design and implementation end-to-end.

[Technical specification](https://hackmd.io/@kyzooroast/HkAKIXS6ex)

## Problem

When users bridge ETH from Ethereum L1 to Linea L2, those funds sit idle in the bridge contract. Yield Boost puts that capital to work while preserving censorship-resistant withdrawal guarantees.

## Design

Three-layer architecture spanning L1 smart contracts, L2 smart contracts, and off-chain services.

### L1 smart contracts

**YieldManager** - the core orchestrator. Manages fund flows between the bridge and external yield strategies, calculates reportable yield after deducting obligations, enforces withdrawal reserve requirements, and coordinates with vendor-specific YieldProvider modules (e.g., LidoStVaultYieldProvider).

**L1MessageService** (extended) - the existing bridge contract, extended to hold the withdrawal reserve and emit synthetic `MessageSent` events for relaying earned yield cross-chain to L2.

### L2 smart contracts

**L2MessageService** receives yield reports anchored as `MessageSent` events and distributes corresponding L2 ETH to eligible recipients.

### Off-chain services

**NativeYieldAutomationService** - stateless automation operating in two modes: yield reporting (routine yield reporting, rebalancing, obligation settlement) and ossification processing (advancing vault shutdown after Security Council initiation).

**LidoUpgradeMonitor** - watches Lido's governance contracts for upgrade proposals affecting StakingVault-related contracts, alerting the Security Council.

### Key design properties

- **Withdrawal reserve system** - dual-threshold model with a minimum (hard safety floor triggering permissionless rebalancing) and a target (buffer above minimum). All ETH transfer operations must maintain the reserve above the minimum.
- **Permissionless safety mechanisms** - when reserves fall below threshold, anyone can call `unstakePermissionless()` or `replenishWithdrawalReserve()` to restore liquidity. No single actor can block withdrawals.
- **Ossification path** - irreversible multi-step process to freeze a vault's implementation, disconnect from Lido's VaultHub, disable LST minting, and progressively withdraw all funds.
- **EIP-7002** execution-layer triggered withdrawals enable beacon chain withdrawals without relying on node operators, critical for censorship resistance.
- **EIP-4788** beacon chain root access enables permissionless unstaking - users prove validator state against the beacon root to trigger withdrawals when reserves are deficient.

## Audits

Audited by three firms:

- [OpenZeppelin](https://www.openzeppelin.com/news/linea-yield-manager-audit)
- [Diligence](https://diligence.security/audits/2025/12/linea-yield-manager/)
- [Cyfrin](https://github.com/Cyfrin/cyfrin-audit-reports/blob/d0f4523388a964891a17cb04c6b3cc26da8c788a/reports/2026-02-12-cyfrin-linea-yield-manager-v2.0.pdf)

## Result

More than 80M USD staked as of September 2026. I drove the design and implementation of this system end-to-end.
````

- [ ] **Step 2: Run build to verify content parses and page generates**

Run: `npm run build`
Expected: PASS - 4 pages built (was 3 before). The new page generates at `/work/linea-yield-boost`.

- [ ] **Step 3: Commit**

```bash
git add src/content/work/linea-yield-boost.md
git commit -m "content: add Linea Yield Boost production system entry"
```

---

### Task 4: Final validation

- [ ] **Step 1: Run full check and build**

Run: `npm run check && npm run build`
Expected: Both pass. 4 pages built.

- [ ] **Step 2: Visual check with dev server**

Run: `npm run dev`

Open `http://localhost:4321` and verify:

1. Four entries under "Portfolio"
2. Order: 01 Yield Boost (Mar 2026), 02 Bangkok (Nov 2024), 03 Sydney (May 2024), 04 Solidity patterns (Mar 2022)
3. Yield Boost entry shows: "Production system · Mar 2026", title "Yield Boost at Linea", description, two links: "Read more →" and "View X announcement ↗"
4. Hackathon entries still show only "View X announcement ↗" (unchanged)
5. Solidity entry still shows only "Read on Medium ↗" (unchanged)
6. Click "Read more →" on the Yield Boost entry - navigates to `/work/linea-yield-boost`
7. Internal page shows: "Work" eyebrow, title, date, description, full Markdown body with headings (Overview, Problem, Design, Audits, Result)
8. All external links in the body (tech spec, audit reports) open correctly
