---
title: strip
---

{% since %}v1.9.1{% endsince %}

Removes all whitespace (tabs, spaces, and newlines) from both the left and right sides of a string. It does not affect spaces between words.

Input
```liquid
BEGIN{{ "          So much room for activities!          " | strip }}END
```

Output
```text
BEGINSo much room for activities!END
```
