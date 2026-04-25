---
title: Tokenomics
description: Atomic units, the halving schedule, tail emission, and how rounding is handled down to the atomic unit.
order: 4
status: draft
updated: 2026-04-09
---

## Atomic units

BitAiir uses 8 decimal places of precision. The smallest representable
quantity is one hundred-millionth of an AIIR:

```
1 AIIR = 100_000_000 atomic units
```

All on-chain amounts are stored and transmitted as `u64` counts of
atomic units. This follows Bitcoin's satoshi convention and matches the
`Amount` newtype in `bitaiir-types`.

## Supply schedule — halvings plus tail emission

BitAiir does not have a hard cap on total supply. Instead, emission has
two phases:

**Phase 1: geometric halvings.** The block subsidy starts at
**100 AIIR** and halves every **50,000,000 blocks**. At the target
block time of 5 seconds this is approximately 7.9 years per halving.

```
subsidy_phase1(height) = 100 AIIR / 2 ^ (height / 50_000_000)
```

**Phase 2: tail emission.** When the halving curve would take the
subsidy below the tail floor of **10 AIIR per block**, it stops
halving and stays at 10 AIIR forever.

```
subsidy(height) = max(subsidy_phase1(height), 10 AIIR)
```

Concretely, the halving schedule is:

| Era | Block range                  | Subsidy             | Approx. years |
| --- | ---------------------------- | ------------------- | ------------- |
| 1   | 0 .. 50,000,000              | 100 AIIR            | 0 – 7.9       |
| 2   | 50,000,000 .. 100,000,000    | 50 AIIR             | 7.9 – 15.9    |
| 3   | 100,000,000 .. 150,000,000   | 25 AIIR             | 15.9 – 23.8   |
| 4   | 150,000,000 .. 200,000,000   | 12.5 AIIR           | 23.8 – 31.7   |
| 5+  | 200,000,000 .. ∞             | **10 AIIR (floor)** | 31.7+         |

From block `200,000,000` onward, the subsidy is exactly 10 AIIR per
block for the rest of the chain's existence.

**Total supply at key milestones** (rounded):

- End of Era 1: 5.000 B AIIR mined
- End of Era 2: 7.500 B AIIR mined
- End of Era 3: 8.750 B AIIR mined
- End of Era 4: 9.375 B AIIR mined
- Tail-emission steady state: ~**63 M AIIR added per year**

**Inflation rate at steady state** (approximate):

- Year 32 (tail emission just started, supply ~9.4 B): 63 M / 9.4 B ≈ **0.67 % / yr**
- Year 50 (supply ~10.5 B): 63 M / 10.5 B ≈ **0.60 % / yr**
- Year 100 (supply ~13.7 B): 63 M / 13.7 B ≈ **0.46 % / yr**

The tail-emission rate is a **fixed absolute amount**, not a
percentage, so the inflation rate declines monotonically as the supply
grows. There is no point at which inflation stops, but it converges
asymptotically toward zero. This mirrors Monero's 2018 tail-emission
design.

## Rationale for tail emission

BitAiir is a payment currency, not a store of value. Continuous modest
emission:

- Guarantees miners always have a subsidy, even after fee-less block
  space stops rewarding them through fees (because there are no fees
  in BitAiir — see [Transactions](/en/docs/protocol/transactions)).
- Encourages spending over hoarding, which is the correct incentive
  for a medium of exchange.
- Matches real-world fiat behavior (central banks target 2–3 %
  inflation); 0.5 % is well below that and nearly imperceptible in
  daily use.
- Removes the "fee-market cliff" that Bitcoin will face post-2140.

## Rounding

Halvings are performed as a right-shift on the **atomic-unit** value
of the subsidy, not on the human-readable AIIR amount. Because one
AIIR is 10^8 atomic units and that factor already contains eight
factors of two, the four halvings from era 1 to era 4 land on exactly
representable values with no rounding at all:

```text
era 1: 10_000_000_000 atoms   = 100   AIIR
era 2:  5_000_000_000 atoms   =  50   AIIR
era 3:  2_500_000_000 atoms   =  25   AIIR
era 4:  1_250_000_000 atoms   =  12.5 AIIR
```

From era 5 onward the tail emission floor takes over at 10 AIIR per
block before any right-shift would drop an odd atomic unit, so the
entire subsidy schedule is exact in `u64`. In particular, era 4 pays
exactly 12.5 AIIR, never a rounded-down 12.

The tail-emission floor of 10 AIIR is chosen to be a round number
rather than the exact geometric value, to keep the schedule easy to
reason about for users.
