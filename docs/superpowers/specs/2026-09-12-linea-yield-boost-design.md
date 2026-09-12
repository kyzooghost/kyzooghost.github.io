# Add Linea Yield Boost portfolio entry

**Date:** 2026-09-12
**Status:** Approved

---

## Goal

Add a "Production system" portfolio entry for Yield Boost at Linea with an internal case study page. This is the first internal write-up on the site.

## New work type

Add `productionSystem: 'production-system'` to `src/content/types.ts`:

- `WORK_TYPE_LABEL`: "Production system"
- `WORK_LINK_LABEL`: "Read more →"

## WorkItem component update

Change `src/components/WorkItem.astro` link logic:

**Current behavior:** show secondary link OR primary link (mutually exclusive).

**New behavior:**
- Always show the primary CTA link.
- Additionally show "View X announcement ↗" when `secondaryUrl` is present.
- Exception: hackathon entries skip the primary CTA (their title already links to the external project). Only show the secondary link for hackathons.

This means:
- **Production system entries** (internal page + `secondaryUrl`): "Read more →" + "View X announcement ↗"
- **Hackathon entries** (`secondaryUrl`, external title link): "View X announcement ↗" only — unchanged
- **Entries without `secondaryUrl`**: primary CTA only — unchanged

When both links are shown, add `margin-left: 1rem` spacing on the secondary link (reintroduce `.secondary-link` class in `global.css`).

## Content file

### `src/content/work/linea-yield-boost.md`

**Frontmatter:**

| Field | Value |
|-------|-------|
| title | Yield Boost at Linea |
| description | Native yield system that stakes bridged ETH on the beacon chain and distributes rewards to L2 users. Audited by OpenZeppelin, Diligence and Cyfrin. 80M+ USD staked. |
| publishedAt | 2026-03-01 |
| type | production-system |
| featured | true |
| draft | false |
| externalUrl | (none - internal page) |
| secondaryUrl | https://x.com/LineaBuild/status/2038641367035854875 |
| tags | Solidity, Ethereum, L2, Staking, DeFi |

**Writing voice:** Neutral technical prose with first-person bookends. Describe the system objectively (architecture, properties, audits). Use first-person only in the overview ("I drove...") and result section.

**Body structure:**

### Overview

What Yield Boost is: a native yield system for the Linea L2 bridge. Stakes a portion of bridged ETH deposits on the Ethereum beacon chain via Lido V3 stVaults, and distributes staking rewards to L2 users. As of September 2026, more than 80M USD is staked through it. I drove the design and implementation end-to-end.

Link to the [technical specification](https://hackmd.io/@kyzooroast/HkAKIXS6ex).

### Problem

When users bridge ETH from Ethereum L1 to Linea L2, those funds sit idle in the bridge contract. Yield Boost puts that capital to work while preserving censorship-resistant withdrawal guarantees.

### Design

Three-layer architecture:

**L1 smart contracts:**
- YieldManager - core orchestrator managing fund flows between the bridge and yield strategies. Calculates reportable yield, enforces withdrawal reserve requirements, coordinates with vendor-specific YieldProvider modules.
- Extended L1MessageService (existing bridge contract) - holds the withdrawal reserve and emits synthetic MessageSent events for relaying earned yield cross-chain.

**L2 smart contracts:**
- L2MessageService receives yield reports and distributes corresponding L2 ETH to eligible recipients.

**Off-chain services:**
- NativeYieldAutomationService - stateless automation in two modes: routine yield reporting/rebalancing and ossification processing (advancing vault shutdown after Security Council initiation).
- LidoUpgradeMonitor - watches Lido governance contracts for upgrade proposals affecting StakingVault-related contracts.

**Key design properties:**
- Withdrawal reserve system with dual thresholds (minimum safety floor + target buffer)
- Permissionless safety mechanisms - anyone can trigger rebalancing when reserves fall below threshold
- Ossification path - irreversible multi-step process to freeze vault implementation and withdraw all funds
- EIP-7002 execution-layer triggered withdrawals for censorship resistance
- EIP-4788 beacon chain root access for permissionless unstaking proofs

### Audits

Audited by three firms:

- [OpenZeppelin](https://www.openzeppelin.com/news/linea-yield-manager-audit)
- [Diligence](https://diligence.security/audits/2025/12/linea-yield-manager/)
- [Cyfrin](https://github.com/Cyfrin/cyfrin-audit-reports/blob/d0f4523388a964891a17cb04c6b3cc26da8c788a/reports/2026-02-12-cyfrin-linea-yield-manager-v2.0.pdf)

### Result

More than 80M USD staked as of September 2026.

## Display order

Home page sorts by `publishedAt` descending:

1. Yield Boost at Linea (Mar 2026) — "Production system · Mar 2026"
2. ETHGlobal Bangkok (Nov 2024)
3. ETHGlobal Sydney (May 2024)
4. Four practical Solidity patterns (Mar 2022)

## Files changed

| File | Change |
|------|--------|
| `src/content/types.ts` | Add `productionSystem` work type |
| `src/components/WorkItem.astro` | Show both links for non-hackathon entries with secondaryUrl |
| `src/styles/global.css` | Re-add `.secondary-link` spacing class |
| `src/content/work/linea-yield-boost.md` | New content file with frontmatter + Markdown body |

## Out of scope

- No changes to layouts (ArticleLayout already handles internal case studies)
- No changes to the `[...slug].astro` route (already generates pages for entries without `externalUrl`)
- No schema changes (all needed fields exist)
