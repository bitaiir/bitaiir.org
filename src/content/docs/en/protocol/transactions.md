---
title: Transactions
description: UTXO model, transaction structure, sighash, coinbase, optional fees, and the per-transaction anti-spam proof of work.
order: 7
status: draft
updated: 2026-04-09
---

## Model

BitAiir is a UTXO chain. A transaction consumes a set of previously
unspent outputs (the inputs) and creates a new set of unspent outputs.
The transaction is valid only if:

- Every input references a previous `(txid, vout)` that exists and is
  unspent.
- Every input's `(signature, pubkey)` pair authorizes the referenced
  output (the HASH160 of `pubkey` matches `recipient_hash`, and the
  ECDSA signature over the sighash is valid under `pubkey`).
- `sum(input_amounts) ≥ sum(output_amounts)` (no money is created).
- No output value exceeds the current subsidy cap plus circulating
  supply bounds.
- The serialized transaction is at most `MAX_TX_SIZE` bytes.
- The transaction's `locktime` is satisfied at the block it is being
  included in.
- The transaction's embedded `pow_nonce` satisfies the anti-spam proof
  of work (see the [Anti-spam proof of work](#anti-spam-proof-of-work) section below).

Transactions may have a fee of **zero** atomic units. Fees are
explicitly optional (see the [Fees](#fees) section below).

## Structure

A transaction is the following Rust struct, serialized with the
[canonical encoding](/en/docs/protocol/canonical-encoding):

```rust
struct Transaction {
    version: u32,
    inputs: Vec<TxIn>,
    outputs: Vec<TxOut>,
    locktime: u32,
    pow_nonce: u64,         // anti-spam PoW, see the section below
}

struct TxIn {
    prev_out: OutPoint,     // txid + vout
    signature: Vec<u8>,     // 64-byte compact ECDSA signature, or coinbase payload
    pubkey: Vec<u8>,        // 33 or 65 bytes; empty for coinbase
    sequence: u32,
}

struct TxOut {
    amount: Amount,         // u64 atomic units
    recipient_hash: [u8; 20],
}

struct OutPoint {
    txid: Hash256,
    vout: u32,
}
```

## Txid

A transaction's ID is the `double_sha256` of its canonical serialization,
including signatures and `pow_nonce`. Re-signing the same transaction
under a different nonce would change its txid; this is prevented because
BitAiir requires RFC 6979 deterministic signatures, which are a pure
function of the private key and the sighash.

## Sighash

The digest signed by a `TxIn` is computed by:

1. Cloning the transaction.
2. Clearing the `signature` field of every input to an empty `Vec<u8>`.
3. Clearing the `pow_nonce` field to `0`.
4. Leaving the `pubkey` field of every input intact.
5. Serializing the result with the canonical encoding.
6. Hashing with `double_sha256`.

Clearing `pow_nonce` in the sighash is important: otherwise the sender
would have to re-sign after mining the anti-spam PoW, creating a
chicken-and-egg problem.

This is the simplest possible sighash scheme. It signs all inputs and
all outputs (equivalent to Bitcoin's `SIGHASH_ALL`) and does not support
any other sighash flags.

## Coinbase

The first transaction in every block must be a coinbase. It has:

- Exactly one input with `prev_out = (Hash256::ZERO, u32::MAX)`.
- The `signature` field of that input is free-form and is used by
  miners as an extra-nonce / tagging area.
- The `pubkey` field of that input is empty.
- `pow_nonce` is `0` (coinbase transactions are exempt from the
  anti-spam PoW; they are already bounded by the block's own PoW).
- Arbitrarily many outputs.
- `sum(outputs) ≤ subsidy(block_height) + sum(fees_in_block)`.

Where `fees_in_block` is the sum of all voluntary fees in non-coinbase
transactions included in the block.

Outputs created by a coinbase transaction mature after
**100 blocks**. A transaction that spends an immature coinbase output
is rejected.

## Fees

The protocol imposes **no minimum fee**. A transaction is valid even
when `sum(input_amounts) == sum(output_amounts)`, i.e. when the
sender keeps no change for the miner.

A sender may voluntarily include a fee by making the output total less
than the input total. The difference is claimed by the block's coinbase
transaction. Miners are free to prioritize higher-fee transactions when
selecting from the mempool, but are not required to — the mempool
ordering policy is a local choice, not a consensus rule.

Because the block subsidy never falls below 10 AIIR (tail emission),
mining is always profitable even when every transaction in the block
has zero fee.

## Anti-spam proof of work

Every non-coinbase transaction must carry a proof of work over its own
contents to prevent flood attacks. The sender computes this PoW once,
at send time, before broadcasting the transaction.

**Computation:**

```
fn compute_tx_pow(tx: &mut Transaction) {
    let tx_digest = {
        // Hash the transaction with pow_nonce temporarily set to zero.
        let mut canonical = tx.clone();
        canonical.pow_nonce = 0;
        double_sha256(canonical_encode(&canonical))
    };

    for nonce in 0u64.. {
        let attempt = double_sha256(&[&tx_digest[..], &nonce.to_le_bytes()].concat());
        if meets_tx_pow_target(&attempt) {
            tx.pow_nonce = nonce;
            return;
        }
    }
}
```

**Target:** the tx-level PoW target is chosen so that a commodity
laptop CPU finds a valid `pow_nonce` in approximately **2 seconds**.
The exact numerical target is part of the protocol and is calibrated
before mainnet. A provisional value is
`0x0000_000f_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff`,
meaning the first four bytes of the digest must be zero. This will be
tuned against real hardware benchmarks before mainnet.

**Verification** is a single `double_sha256` call, trivially cheap for
nodes and miners.

**Security property:** a spammer who wants to submit `N` transactions
per second must spend `2 * N` CPU-seconds of work per second. A
single-core attacker is capped at ~0.5 tx/s. Breaking 1000 tx/s
requires 2000 cores running continuously, which is economically
unattractive for spam purposes.

**Coinbase exemption:** coinbase transactions carry `pow_nonce = 0`.
They are not spam vectors because block production is already
rate-limited by the main (Proof of Aiir) proof of work.
