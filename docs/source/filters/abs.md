---
title: abs
---

{% since %}v1.9.1{% endsince %}

Liquid filter that returns the absolute value of a number.

Input
```liquid
{{ -17 | abs }}
```

Output
```text
17
```

Input
```liquid
{{ 4 | abs }}
```

Output
```text
4
```

`abs` will also work on a string that only contains a number:

Input
```liquid
{{ "-19.86" | abs }}
```

Output
```text
19.86
```
