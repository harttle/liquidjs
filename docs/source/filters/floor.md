---
title: floor
---

{% since %}v1.9.1{% endsince %}

Rounds the input down to the nearest whole number. LiquidJS tries to convert the input to a number before the filter is applied.

Input
```liquid
{{ 1.2 | floor }}
```

Output
```text
1
```

Input
```liquid
{{ 2.0 | floor }}
```

Output
```text
2
```

Input
```liquid
{{ 183.357 | floor }}
```

Output
```text
183
```

Here the input value is a string:

Input
```liquid
{{ "3.5" | floor }}
```

Output
```text
3
```
