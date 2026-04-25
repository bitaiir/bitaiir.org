---
title: Overview
description: A one-paragraph summary of the BitAiir data model and the shared cryptographic lineage with Bitcoin.
order: 2
status: draft
updated: 2026-04-09
---

BitAiir is a Bitcoin-style UTXO cryptocurrency with a payment-first
design:

- Account state is a set of unspent transaction outputs (UTXOs), not a
  ledger of balances.
- Transactions consume previous outputs and create new ones.
- There is no on-chain scripting language in version 1. Spending an
  output requires a `(signature, public_key)` pair that hashes (via
  HASH160) to the output's `recipient_hash`.
- Consensus is achieved via proof of work. The work function, called
  **Proof of Aiir**, wraps the Bitcoin-family `double_sha256` primitive
  in an Argon2id memory-hard step that bounds ASIC acceleration
  (see [Proof of Aiir](/en/docs/protocol/proof-of-aiir)). In code the corresponding function is written
  `aiir_pow()` for Rust-identifier friendliness.
- New coins are issued via the coinbase transaction of each block,
  following a halving schedule that bottoms out at a permanent tail
  emission (see [Tokenomics](/en/docs/protocol/tokenomics)).
- Transactions carry a small embedded proof of work as a spam
  mitigation, replacing the fee-based anti-spam of Bitcoin
  (see [Transactions](/en/docs/protocol/transactions)).

All cryptographic primitives, address formats, and signed-message rules
are shared with Bitcoin's lineage, with BitAiir-specific identifiers so
a BitAiir artifact cannot be confused with a Bitcoin artifact.
