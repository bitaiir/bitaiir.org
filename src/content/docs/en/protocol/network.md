---
title: Network
description: P2P framing magic bytes, protocol version negotiation, and default ports.
order: 11
status: draft
updated: 2026-04-09
---

## Magic bytes

Every P2P message is framed with a 4-byte network magic at its start:

```
0xB1 0x7A 0x11 0xED
```

Nodes drop any incoming bytes that do not start with this sequence.
This prevents accidental cross-talk between BitAiir and other protocols
that happen to share a TCP port.

## Protocol version

The network-layer protocol version is `1`. When a new field is added to
any P2P message, the version number is bumped and nodes use the
minimum of the two peers' version numbers to decide which wire format
to use.

## Ports

- Default P2P port: **8444**
- Default RPC port: **8443**

These are the ports the reference implementation listens on unless the
operator overrides them. They are not consensus rules.
