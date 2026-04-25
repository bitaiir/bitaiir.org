---
title: Protocol specification
description: Consensus rules of the BitAiir cryptocurrency — the contract every implementation must respect.
order: 0
status: draft
updated: 2026-04-09
---

**Version:** 1
**Status:** Draft — subject to change until the genesis block is mined and published.
**Last updated:** 2026-04-09

This document records the consensus parameters of the BitAiir cryptocurrency
protocol. Anything not listed here is an implementation detail and may be
changed by any implementation without breaking compatibility; anything
listed here is a consensus rule that cannot be changed without a hard
fork.

Status labels for individual values:

- **(decided)** — final for protocol version 1.
- **(provisional)** — current best guess, may still change before the
  genesis block is mined.
- **(open)** — not yet settled, needs explicit sign-off before mainnet.

## Contents

1. [Design goals](/en/docs/protocol/design-goals) — the seven principles used to resolve any ambiguity in the rest of the spec.
2. [Overview](/en/docs/protocol/overview) — one-page tour of the data model.
3. [Constants table](/en/docs/protocol/constants) — every numeric parameter with its status.
4. [Tokenomics](/en/docs/protocol/tokenomics) — units, halving schedule, and tail emission.
5. [Addresses](/en/docs/protocol/addresses) — address format and WIF.
6. [Signed messages](/en/docs/protocol/signed-messages) — off-chain message signing.
7. [Transactions](/en/docs/protocol/transactions) — structure, sighash, coinbase, fees, anti-spam PoW.
8. [Blocks](/en/docs/protocol/blocks) — header, merkle root, validation rules.
9. [Proof of Aiir](/en/docs/protocol/proof-of-aiir) — the anti-ASIC proof-of-work function.
10. [Canonical encoding](/en/docs/protocol/canonical-encoding) — the byte-exact serialization.
11. [Network](/en/docs/protocol/network) — magic bytes, ports, version negotiation.
12. [Genesis block](/en/docs/protocol/genesis-block) — the bootstrap block (status: open).
13. [Open questions](/en/docs/protocol/open-questions) — items still undecided before mainnet.
14. [Change log](/en/docs/protocol/change-log).
15. [Mining command-line experience](/en/docs/protocol/mining-cli) — what the daemon and CLI must expose.
16. [Mobile participation](/en/docs/protocol/mobile-participation) — wallet vs. mining posture on phones.
