---
title: url_decode
---

{% since %}v6.1.0{% endsince %}

Decodes a string that has been encoded as a URL.

A `%` that isn't followed by two hex digits is left as written, and escapes that don't form valid UTF-8 become U+FFFD (�), where Shopify/Liquid renders an error message in their place.

Input
```liquid
{{ "%27Stop%21%27+said+Fred" | url_decode }}
```

Output
```text
'Stop!' said Fred
```
