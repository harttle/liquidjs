---
title: hmac_sha256
---

{% since %}vNEXT{% endsince %}

Converts a string into an SHA-256 hash using a hash message authentication code (HMAC). The secret key is passed as the filter argument. The output is a lowercase hexadecimal string.

Input

```liquid
{%- assign secret_potion = 'Polyjuice' | hmac_sha256: 'Polina' -%}
My secret potion: {{ secret_potion }}
```

Output

```text
My secret potion: 8e0d5d65cff1242a4af66c8f4a32854fd5fb80edcc8aabe9b302b29c7c71dc20
```
