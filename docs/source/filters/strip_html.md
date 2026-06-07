---
title: strip_html
---

{% since %}v1.9.1{% endsince %}

Removes any HTML tags from a string.

Input
```liquid
{{ "Have <em>you</em> read <strong>Ulysses</strong>?" | strip_html }}
```

Output
```text
Have you read Ulysses?
```
