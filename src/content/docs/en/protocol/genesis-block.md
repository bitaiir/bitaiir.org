---
title: Genesis block
description: The bootstrap block. Status open — will be mined and published before the first mainnet release.
order: 12
status: draft
updated: 2026-04-09
---

**Status:** open

The genesis block will be mined and its full bytes added to this
document before the first mainnet release. Until then,
`bitaiir-chain` should produce a fresh, in-memory test genesis on every
startup for development purposes.

The genesis block's properties, once decided, will be:

- `version = 1`
- `prev_block_hash = Hash256::ZERO`
- `timestamp = <chosen at mining time>`
- `bits = 0x2000ffff`
- `nonce = <found at mining time>`
- Coinbase payload: an ASCII string identifying the BitAiir project
  and the date, analogous to Bitcoin's "The Times 03/Jan/2009
  Chancellor on brink of second bailout for banks".
