---
title: lstrip
---

{% since %}v1.9.1{% endsince %}

Removes all whitespace (tabs, spaces, and newlines) from the left side of a string. It does not affect spaces between words.

Input
```liquid
BEGIN{{ "          So much room for activities!          " | lstrip }}END
```

Output
```text
BEGINSo much room for activities!          END
```
