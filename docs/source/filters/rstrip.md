---
title: rstrip
---

{% since %}v1.9.1{% endsince %}

Removes all whitespace (tabs, spaces, and newlines) from the right side of a string. It does not affect spaces between words.

Input
```liquid
BEGIN{{ "          So much room for activities!          " | rstrip }}END
```

Output
```text
BEGIN          So much room for activities!END
```
