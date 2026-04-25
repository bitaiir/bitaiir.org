---
title: Signed messages
description: Off-chain message signing with a BitAiir-specific magic prefix, following Bitcoin's signmessage format.
order: 6
status: draft
updated: 2026-04-09
---

Message signing follows Bitcoin's `signmessage` format with a
BitAiir-specific magic string:

```
magic_bytes   = varint(len(PREFIX)) || PREFIX ||
                varint(len(message)) || message
digest        = double_sha256(magic_bytes)
signature     = ecdsa_sign_rfc6979(privkey, digest)
header_byte   = 27 + recovery_id + (4 if compressed else 0)
serialized    = base64(header_byte || r || s)
```

Where `PREFIX = "BitAiir Signed Message:\n"` (24 bytes).

Signatures are 65 bytes pre-base64: 1 byte header, 32 bytes `r`,
32 bytes `s`. Signers must use RFC 6979 deterministic nonces and the
low-`s` canonical form (BIP 62).
