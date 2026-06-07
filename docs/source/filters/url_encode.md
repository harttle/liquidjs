---
title: url_encode
---

{% since %}v1.9.1{% endsince %}

Converts any URL-unsafe characters in a string into percent-encoded characters.

Input
```liquid
{{ "john@liquid.com" | url_encode }}
```

Output
```text
john%40liquid.com
```

Input
```liquid
{{ "Tetsuro Takara" | url_encode }}
```

Output
```text
Tetsuro+Takara
```
