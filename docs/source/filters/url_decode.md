---
title: url_decode
---

{% since %}v6.1.0{% endsince %}

Decodes a string that has been encoded as a URL.

Input
```liquid
{{ "%27Stop%21%27+said+Fred" | url_decode }}
```

Output
```text
'Stop!' said Fred
```
