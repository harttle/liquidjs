---
title: ceil
---

{% since %}v1.9.1{% endsince %}

Rounds the input up to the nearest whole number. LiquidJS tries to convert the input to a number before the filter is applied.

Input
```liquid
{{ 1.2 | ceil }}
```

Output
```text
2
```

Input
```liquid
{{ 2.0 | ceil }}
```

Output
```text
2
```

Input
```liquid
{{ 183.357 | ceil }}
```

Output
```text
184
```

Here the input value is a string:

Input
```liquid
{{ "3.5" | ceil }}
```

Output
```text
4
```
