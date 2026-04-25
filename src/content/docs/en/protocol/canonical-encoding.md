---
title: Canonical encoding
description: The byte-exact serialization format used to compute every hash, frozen into the protocol.
order: 10
status: draft
updated: 2026-04-09
---

All hashes (transaction IDs, block hashes, merkle inputs, anti-spam PoW
preimages) are computed over a canonical binary encoding of the
corresponding Rust struct.

**Version 1** uses `bincode` v2.x in its `config::standard()` mode via
the `serde` bridge. This is an implementation-defined choice that is
frozen into the protocol: any implementation that wants to match
BitAiir's consensus hashes must produce byte-for-byte identical bytes
for the same struct values.

The canonical encoding is defined operationally as "whatever
`bincode::serde::encode_to_vec(value, bincode::config::standard())`
produces for the Rust struct definitions given in this document".
Future protocol versions may switch to a hand-rolled wire format for
better auditability; such a change is a hard fork.
