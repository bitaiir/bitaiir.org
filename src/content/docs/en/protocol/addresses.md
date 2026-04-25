---
title: Addresses
description: BitAiir address format and WIF (Wallet Import Format).
order: 5
status: draft
updated: 2026-04-09
---

## Format

A BitAiir address is the ASCII string `"aiir"` concatenated with the
Base58Check encoding of a 21-byte payload:

```
address = "aiir" + base58check(version_byte || hash160(public_key))
```

Where:

- `version_byte` is `0x00` (address version byte, decided).
- `hash160(x) = ripemd160(sha256(x))`.
- `base58check` appends a 4-byte SHA-256d checksum, then encodes using
  the Bitcoin Base58 alphabet.

The literal `"aiir"` prefix is **not** part of the checksummed payload.
Decoders strip the prefix before verifying the Base58Check body.

## WIF (Wallet Import Format)

Private keys exported as WIF use the version byte `0xfe` (distinct from
Bitcoin mainnet `0x80` and testnet `0xef`), followed by the 32-byte
private key, followed by an optional compression flag `0x01`, all
passed through Base58Check:

```
wif_uncompressed = base58check(0xfe || privkey)
wif_compressed   = base58check(0xfe || privkey || 0x01)
```
