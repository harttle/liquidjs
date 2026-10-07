---
title: url_decode
---

{% since %}v6.1.0{% endsince %}

Decodes a string that has been encoded as a URL.

A `%` that isn't followed by two hex digits is left as written. Escapes that don't form valid UTF-8 throw an error.

Input
```liquid
{{ "%27Stop%21%27+said+Fred" | url_decode }}
```

Output
```text
'Stop!' said Fred
```
