---
title: strip_html
---

Removes any HTML tags from a string.

Input
```liquid
{{ "Have <em>you</em> read <strong>Ulysses</strong>?" | strip_html }}
```

Output
```text
Have you read Ulysses?
```
