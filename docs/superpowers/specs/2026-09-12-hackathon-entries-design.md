# Add ETHGlobal hackathon entries to Selected Work

**Date:** 2026-09-12
**Status:** Approved

---

## Goal

Add two ETHGlobal hackathon finalist entries to the Selected Work section, each with a primary link (ETHGlobal showcase) and a secondary link (X announcement post).

## Schema change

Add one optional field to the `work` collection schema in `src/content.config.ts`:

- `secondaryUrl` - optional, validated with the existing `httpUrl` refinement (HTTP/HTTPS only)

No changes to `src/content/types.ts`. The secondary link label "See announcement ↗" is a fixed string rendered in the component.

## WorkItem component update

In `src/components/WorkItem.astro`, when `data.secondaryUrl` is present, render a second link below the existing CTA:

```
Read externally ↗
See announcement ↗
```

Both links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. The secondary link reuses the `text-link` class.

## New content files

### `src/content/work/ethglobal-sydney-zeke.md`

| Field | Value |
|-------|-------|
| title | ETHGlobal Sydney 2024 - Finalist |
| description | Peer-to-peer fiat on/off ramp using ZK proofs of PayPal payment emails, delivered through a Telegram bot. |
| publishedAt | 2024-05-05 |
| type | external-artifact |
| featured | true |
| draft | false |
| externalUrl | https://ethglobal.com/showcase/zeke-xarwm |
| secondaryUrl | https://x.com/Nethermind/status/1788533651484946490 |
| tags | ZK, Solidity, Telegram, ETHGlobal |

### `src/content/work/ethglobal-bangkok-zubernetes.md`

| Field | Value |
|-------|-------|
| title | ETHGlobal Bangkok 2024 - Finalist |
| description | Container orchestration with ZK proofs and TEEs for verifiable cloud computing. Finalist amongst 700+ teams. |
| publishedAt | 2024-11-17 |
| type | external-artifact |
| featured | true |
| draft | false |
| externalUrl | https://ethglobal.com/showcase/zubernetes-zk8s-vvchq |
| secondaryUrl | https://x.com/ETHGlobal/status/1858086037970723238 |
| tags | ZK, TEE, Solidity, ETHGlobal |

## Display order

Home page sorts by `publishedAt` descending:

1. ETHGlobal Bangkok (Nov 2024)
2. ETHGlobal Sydney (May 2024)
3. Four practical Solidity patterns (Mar 2022)

## Files changed

| File | Change |
|------|--------|
| `src/content.config.ts` | Add optional `secondaryUrl` field |
| `src/components/WorkItem.astro` | Render secondary link when present |
| `src/content/work/ethglobal-sydney-zeke.md` | New content file |
| `src/content/work/ethglobal-bangkok-zubernetes.md` | New content file |

## Out of scope

- No changes to `types.ts` (no new work type)
- No changes to page layouts or routing
- No custom label override for the secondary link
