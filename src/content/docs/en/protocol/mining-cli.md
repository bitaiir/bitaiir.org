---
title: Mining command-line experience
description: What the reference daemon and CLI must expose so that mining is a first-class, one-command feature.
order: 15
status: draft
updated: 2026-04-09
---

The reference daemon `bitaiird` and the CLI client `bitaiir-cli` must
expose mining as a first-class, single-command feature. A user who has
installed BitAiir should be able to start mining with no extra
configuration beyond choosing how many CPU threads to dedicate.

## Required commands

`bitaiir-cli mine` (or an equivalent subcommand) must support at minimum:

- `--threads <N>`: number of worker threads to use. Default: one less
  than the number of available logical cores, so the machine remains
  responsive.
- `--address <addr>`: the BitAiir address to receive mined block
  rewards. Default: a newly generated address stored in the wallet.
- `--stop-after <N>`: optional cap on blocks mined, for testing.

The command must print a human-readable, live-updating status that
shows at least the current best block height, local hashrate, elapsed
time, and a running total of blocks found by this miner.

## Embedded mining in the daemon

`bitaiird` must accept a `mine=1` option in `bitaiir.conf` (or an
equivalent CLI flag) that enables mining as part of the running node,
without a separate process. This makes "I run a node, I mine" the
default deployment, matching Bitcoin's `bitcoind -gen` behavior from
its earliest days.

## Rationale

BitAiir's design goal of "anyone who can run the daemon can mine"
(see [Design goals](/en/docs/protocol/design-goals)) is only real if mining is trivially accessible. If the
only way to mine is to install and configure a separate third-party
miner, the goal is effectively unmet. Bundling mining into the
reference implementation is the practical way to preserve the
"open participation" invariant as the project grows.

Mining is not mandatory — running a non-mining node must remain the
default — but it must be **available with one command**.
