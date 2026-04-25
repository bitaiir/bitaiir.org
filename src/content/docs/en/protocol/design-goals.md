---
title: Design goals
description: The seven principles used to resolve any design ambiguity elsewhere in the BitAiir protocol.
order: 1
status: draft
updated: 2026-04-09
---

BitAiir is a **payment cryptocurrency**, not a store of value. It takes
cues from both Bitcoin (proof of work, decentralization, open
participation) and Brazil's Pix instant-payment system (fast, low-fee,
accessible to everyone). The concrete goals below should be used to
resolve any design ambiguity in the rest of the document:

1. **Fast confirmations.** A payment should feel "done" within seconds
   from the payer's perspective, not minutes or hours. The target block
   time is 5 seconds, and wallets are expected to treat 1 confirmation
   as sufficient for everyday payments.
2. **Zero fees by default.** Transactions have no mandatory fee. A
   sender can voluntarily include a tip to incentivize faster
   inclusion, but the protocol does not reject fee-free transactions.
3. **Mining must be accessible.** Anyone who can run the daemon should
   be able to mine blocks. The proof-of-work algorithm is deliberately
   hostile to ASIC and GPU acceleration (see [Proof of Aiir](/en/docs/protocol/proof-of-aiir)) so that a
   commodity CPU remains competitive throughout the project's lifetime.
4. **Decentralized issuance, forever.** There is no pre-mine, no
   foundation allocation, no ICO. New coins enter circulation only via
   the coinbase transaction of each mined block. Issuance does not stop
   — there is a fixed tail emission so that mining always pays (see
   [Tokenomics](/en/docs/protocol/tokenomics)).
5. **Anti-spam without fees.** Because fees are zero, transactions
   themselves include a small proof of work that costs the sender
   roughly two seconds of CPU time (see [Transactions — anti-spam PoW](/en/docs/protocol/transactions)). This makes flood
   attacks uneconomical without charging honest users money.
6. **Mobile users can pay; desktop users mine.** The protocol does not
   block mobile mining, but the ecosystem realities (app-store policies,
   thermal throttling, battery drain) mean mobile is a first-class
   platform for wallets and a second-class platform for miners. See
   [Mobile participation](/en/docs/protocol/mobile-participation) for the rationale.
7. **Implementation simplicity in v1.** Where two designs are equally
   valid, the one that is simpler to implement, test, and audit wins.
   We can always add complexity later; we cannot safely remove it.
