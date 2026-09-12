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
