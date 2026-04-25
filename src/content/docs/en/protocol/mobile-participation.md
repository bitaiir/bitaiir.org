---
title: Mobile participation
description: Why mobile is a first-class wallet platform and a best-effort mining platform in BitAiir.
order: 16
status: draft
updated: 2026-04-09
---

## Status

The protocol does not block mining on mobile devices. The 64 MiB
Argon2id memory cost fits comfortably within the per-app memory budget
of any phone with 4 GiB+ of system RAM, which covers essentially every
Android or iOS device sold in the last several years. Modern mobile
CPUs (Apple Silicon, Snapdragon 8 Gen 3, MediaTek Dimensity 9000+)
execute Argon2id at a hashrate comparable to mid-range laptops.

## Ecosystem constraints

While the *protocol* permits mobile mining, the *ecosystem* around
mobile devices makes it impractical as a primary use case:

1. **App store policies.** Both Apple's App Store Review Guideline
   3.1.5(b) and Google Play's Developer Policy explicitly forbid
   on-device cryptocurrency mining applications. Any BitAiir mobile
   miner must be distributed outside these stores:
   - **Android:** via F-Droid (which allows mining apps), direct APK
     download, or alternative stores such as Aurora.
   - **iOS:** no general-purpose distribution path exists. The iOS
     ecosystem cannot host a BitAiir miner.
2. **Thermal throttling.** Sustained full-CPU mining triggers OS-level
   thermal protection within seconds to minutes, reducing hashrate by
   50 % or more. Mobile mining is effectively limited to short bursts
   or to use while the device is actively cooled (plugged in, face-up,
   not in a pocket).
3. **Battery drain.** Mining at full CPU for one hour consumes roughly
   20–40 % of a typical phone's battery. Users will not run sustained
   mining on a daily-driver device.

## The intended mobile posture

For version 1, mobile devices are the **payment platform** for
BitAiir, not the **mining platform**. The reference mobile wallet (when
it exists) will:

- Be a **light client**: it downloads and verifies block headers, uses
  Merkle proofs to check balances, and does not store the full chain.
- Support the core payment UX: receive a payment via QR code, send a
  payment via address or QR scan, show balance and transaction
  history.
- Include an **optional mining toggle**, active only when the device
  is plugged in, idle, on Wi-Fi, and above a battery threshold — and
  **only** on platforms where distribution is legal (i.e. sideloaded
  Android). On iOS, mining is not offered at all.

## Progressive Web App as a future distribution option

A Progressive Web App (PWA) running in a mobile browser can host a
WebAssembly build of the Proof-of-Aiir miner. This path:

- Is not subject to app-store policies (it is a website).
- Works on both Android and iOS browsers.
- Runs Argon2id at roughly 2–5× the cost of native code (acceptable
  for light participation).
- Is subject to browser-level tab-throttling, which limits background
  mining.

The PWA approach is out of scope for version 1 of the reference
implementation but is noted here as a potential cross-platform path
for future work.

## Summary

| Platform               | Wallet | Mining                  |
| ---------------------- | ------ | ----------------------- |
| Desktop (Linux/Win/Mac)| Yes    | Yes, first-class        |
| Android (F-Droid/APK)  | Yes    | Yes, opt-in             |
| Android (Play Store)   | Yes    | No (policy blocks it)   |
| iOS (App Store)        | Yes    | No (policy blocks it)   |
| Browser / PWA          | Future | Future, experimental    |

Mobile is a first-class payments platform and a best-effort mining
platform. The design does not exclude phones — it recognizes where the
ecosystem stops the protocol from reaching them.
