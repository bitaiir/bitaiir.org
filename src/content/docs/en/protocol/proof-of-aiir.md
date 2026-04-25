---
title: Proof of Aiir
description: The memory-hard proof-of-work function that wraps SHA-256d in Argon2id to bound ASIC acceleration.
order: 9
status: draft
updated: 2026-04-09
---

## Motivation

Pure SHA-256d (Bitcoin's proof of work) is ASIC-friendly by design: the
function is simple, stateless, and perfectly parallelizable, which is
exactly what fixed-function silicon is best at. This leads to a few
large mining farms dominating the network, defeating the "anyone can
participate" goal (see [Design goals](/en/docs/protocol/design-goals)).

**Proof of Aiir** is BitAiir's answer: it wraps `double_sha256` in a
memory-hard Argon2id step. Argon2id requires tens of megabytes of fast
random-access memory per invocation, with sequential dependencies that
cannot be efficiently parallelized across cores. This forces any
competitive miner to supply:

- A general-purpose CPU that can execute Argon2id efficiently, and
- Tens of megabytes of low-latency RAM per mining worker.

The economics of building an ASIC under those constraints are
dramatically worse than for pure SHA-256. A commodity CPU with DDR4 /
DDR5 memory remains competitive indefinitely.

`double_sha256` is still present at both ends of the computation, so
the hash primitives already implemented in `bitaiir-crypto` are fully
reused.

## Algorithm

Given a serialized block header `header_bytes`, the Proof-of-Aiir hash
is computed as follows. The function is named `aiir_pow` in Rust code
to keep the identifier idiomatic; "Proof of Aiir" is the protocol
name used in documentation, UX, and marketing.

```
fn aiir_pow(header_bytes: &[u8]) -> Hash256 {
    // Step 1: a fast SHA-256 digest seeds the memory-hard step.
    let seed: [u8; 32] = sha256(header_bytes);

    // Step 2: Argon2id is the anti-ASIC barrier. The salt comes from
    // the header's prev_block_hash field so each chain tip produces a
    // fresh memory pattern; this prevents precomputing an Argon2
    // rainbow table.
    let salt: [u8; 16] = header_bytes.prev_block_hash[..16];

    let memory_work: [u8; 32] = argon2id(
        password = seed,
        salt = salt,
        memory_cost = 65_536,   // kibibytes, i.e. 64 MiB
        time_cost = 1,
        parallelism = 1,
        output_len = 32,
    );

    // Step 3: final identity is double_sha256 over header + memory_work.
    double_sha256(&[header_bytes, &memory_work[..]].concat())
}
```

The function is pure: the same `header_bytes` always yields the same
output. Verification and mining both run this identical function.

## Difficulty target encoding (`bits`)

`bits` is a 4-byte compact encoding of a 256-bit target, using
Bitcoin's format:

- The high byte is the exponent `E`.
- The low three bytes are the mantissa `M`, interpreted as a 24-bit
  big-endian unsigned integer.
- The target is `M × 2^(8 × (E − 3))`.

A block is valid if and only if its `aiir_pow` hash, treated as a
256-bit unsigned integer, is less than or equal to the decoded target.

## Difficulty adjustment

Every **20 blocks** (approximately 100 seconds at the target block
time), the network recomputes the target from the time it took to mine
the previous 20-block window:

```
actual_time   = block[i].timestamp - block[i - 20].timestamp
expected_time = 20 * 5             // 100 seconds

new_target = old_target * actual_time / expected_time
```

The ratio `actual_time / expected_time` is clamped to the range
`[1/4, 4]` to prevent a single window from changing the difficulty by
more than a factor of 4. The resulting `new_target` is re-encoded into
`bits` form with any necessary rounding, and becomes the required
target for the next 20 blocks.

A future protocol version may migrate to per-block difficulty
adjustment using LWMA (Linearly Weighted Moving Average), which
gives even faster response and smoother transitions. The 20-block
batch retarget is the v1 choice for implementation simplicity.

## Initial difficulty

The genesis block and every block up to and including block 19 use
the hardcoded `bits = 0x2000ffff`. This target is deliberately easy so
that the first miners, running Proof of Aiir on commodity CPUs, can
produce blocks at roughly the target rate even without Argon2id
optimization. The first retarget happens at block 20.

## Median time past

A block's `timestamp` must be strictly greater than the median of the
previous 11 blocks' timestamps. This prevents a miner from producing a
long chain of artificially-old blocks to manipulate difficulty.

## Calibration of Argon2id parameters

The Argon2id parameters `(memory=64 MiB, time=1, parallelism=1)` were
chosen to balance three goals:

1. **ASIC hostility.** 64 MiB of low-latency memory per mining worker
   is expensive to replicate in custom silicon. Scaling the memory up
   further helps more but excludes low-RAM devices.
2. **CPU friendliness.** Modern laptops with 8 GiB of system RAM can
   sustain dozens of Argon2id invocations per second per core without
   swapping. Phones with 4 GiB+ can also run the function, though
   thermal and battery constraints limit sustained mining in practice
   (see [Mobile participation](/en/docs/protocol/mobile-participation)).
3. **Verification equality.** Because `time_cost = 1` and
   `parallelism = 1`, mining and verification perform the same amount
   of work per attempt. There is no cheaper shortcut for verifiers.

Any future change to these parameters is a hard fork.

## Future work: replacement hash

If, despite the Argon2id wrap, ASIC advantage becomes problematic in
practice, the protocol may hard-fork to a different inner function
(for example RandomX, which is explicitly designed to saturate a
modern out-of-order CPU pipeline). Such a fork would be a community
decision and must publish its replacement function, target,
calibration, and activation height in this document.
