---
title: normalize_whitespace
---

{% since %}v10.13.0{% endsince %}

Replace any occurrence of whitespace with a single space.

Input
```liquid
{{ "a \n b" | normalize_whitespace }}
```

Output
```html
a b
```
