---
title: Blocks
description: Block header structure, hashing, merkle root computation, and the complete validation rule list.
order: 8
status: draft
updated: 2026-04-09
---

## Structure

```rust
struct BlockHeader {
    version: u32,
    prev_block_hash: Hash256,
    merkle_root: Hash256,
    timestamp: u64,        // seconds since Unix epoch
    bits: u32,             // compact difficulty target
    nonce: u32,
}

struct Block {
    header: BlockHeader,
    transactions: Vec<Transaction>,
}
```

## Block hash

The block hash is `aiir_pow(canonical_encode(BlockHeader))`, where
`aiir_pow` is the Rust name of the Proof-of-Aiir function defined in
[Proof of Aiir](/en/docs/protocol/proof-of-aiir). A block is valid only if its hash, interpreted as a 256-bit
little-endian integer, is less than or equal to the target encoded by
`bits`.

The block hash is used both as the block's identity (the value stored
in the next block's `prev_block_hash`) and as the proof-of-work check
— just as in Bitcoin.

## Merkle root

The `merkle_root` field must equal `merkle_root(tx_ids)` where `tx_ids`
is the ordered list of transaction IDs in the block, and `merkle_root`
is the Bitcoin-style pairwise `double_sha256` reduction. If a level has
an odd number of hashes, the last one is duplicated.

This inherits CVE-2012-2459 by construction. The mitigation is the
consensus rule **"a valid block must not contain duplicate
transactions"**, enforced by `bitaiir-chain` at validation time.

## Validation rules

A block is valid if and only if all of the following hold:

1. Its serialized size is at most `MAX_BLOCK_SIZE` bytes.
2. Its header hash `aiir_pow(header_bytes)` is numerically ≤ the target
   encoded by `bits`.
3. Its `bits` field equals the value expected from the difficulty
   adjustment algorithm (see [Proof of Aiir — difficulty adjustment](/en/docs/protocol/proof-of-aiir)).
4. Its `timestamp` is strictly greater than the median timestamp of
   the previous 11 blocks.
5. Its `timestamp` is at most 2 hours in the future relative to the
   validating node's adjusted network time.
6. Its `prev_block_hash` equals the header hash of the block it builds
   on.
7. Its `merkle_root` equals the computed merkle root of its
   transactions.
8. Its first transaction is a valid coinbase.
9. Every non-coinbase transaction is valid under the rules in
   [Transactions](/en/docs/protocol/transactions) (including the anti-spam PoW).
10. No transaction appears more than once.
11. The coinbase outputs sum to at most
    `subsidy(height) + sum(transaction_fees)`.
