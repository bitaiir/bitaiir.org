---
title: Open questions
description: Items explicitly not decided yet — each must be resolved before mainnet.
order: 13
status: draft
updated: 2026-04-09
---

The following items are explicitly not decided and must be revisited
before mainnet:

1. **Genesis block contents** ([Genesis block](/en/docs/protocol/genesis-block)). Needs a coinbase payload,
   a timestamp, and a mined nonce.
2. **Precise tx-level PoW target.** The provisional value in
   [Transactions — anti-spam PoW](/en/docs/protocol/transactions) needs to be calibrated against real hardware so that a median
   commodity laptop finds a nonce in approximately 2 seconds.
3. **Initial Proof-of-Aiir difficulty.** The `bits = 0x2000ffff`
   initial value must be validated against real CPU performance so
   that the first 20 blocks take roughly `20 * 5 = 100 seconds` on a
   single-laptop bootstrap network.
4. **DNS seeds.** Where do fresh nodes get their first peers from? A
   hardcoded list? A DNS-based discovery scheme?
5. **P2P authentication.** Does BitAiir v1 encrypt peer connections,
   or is it cleartext like Bitcoin's original protocol?
6. **Replacement PoW** (see [Proof of Aiir — future work](/en/docs/protocol/proof-of-aiir)). If Argon2id is eventually
   circumvented, what replaces it and how is the fork activated?
