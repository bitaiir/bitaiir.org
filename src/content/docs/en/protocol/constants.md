---
title: Constants table
description: Every numeric parameter of the BitAiir protocol with its current status (decided, provisional, open).
order: 3
status: draft
updated: 2026-04-09
---

| Name                           | Value                                        | Status       |
| ------------------------------ | -------------------------------------------- | ------------ |
| Protocol version               | 1                                            | decided      |
| Network magic bytes            | `0xB1 0x7A 0x11 0xED`                        | provisional  |
| Default P2P port               | 8444                                         | provisional  |
| Default RPC port               | 8443                                         | provisional  |
| Address prefix (string)        | `"aiir"`                                     | decided      |
| Address version byte           | `0x00`                                       | decided      |
| WIF version byte               | `0xfe`                                       | decided      |
| Signed message prefix          | `"BitAiir Signed Message:\n"`                | decided      |
| Atomic units per whole AIIR    | 100_000_000 (10^8)                           | decided      |
| Initial block reward           | 100 AIIR                                     | provisional  |
| Blocks per halving             | 50_000_000                                   | provisional  |
| Tail emission floor            | 10 AIIR / block                              | provisional  |
| Approximate long-term supply   | ~11.26 billion AIIR at year 100              | provisional  |
| Target block time              | 5 seconds                                    | provisional  |
| Difficulty retarget interval   | 20 blocks                                    | provisional  |
| Max difficulty adjustment      | 4× per retarget                              | provisional  |
| Initial difficulty `bits`      | `0x2000ffff`                                 | provisional  |
| Proof of work                  | Proof of Aiir (SHA-256d + Argon2id wrap)     | provisional  |
| Argon2id memory cost           | 65_536 KiB (64 MiB)                          | provisional  |
| Argon2id time cost             | 1 iteration                                  | provisional  |
| Argon2id parallelism           | 1 lane                                       | provisional  |
| Argon2id output length         | 32 bytes                                     | provisional  |
| Tx-level anti-spam PoW target  | ~2 s CPU time on commodity laptop            | provisional  |
| Max serialized block size      | 1_000_000 bytes                              | provisional  |
| Max serialized transaction size| 100_000 bytes                                | provisional  |
| Coinbase maturity              | 100 blocks                                   | provisional  |
| Locktime semantics             | block height only (no timestamp mode)        | provisional  |
| Time-past-median window        | 11 blocks                                    | provisional  |
