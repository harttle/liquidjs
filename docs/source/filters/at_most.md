---
title: at_most
---

{% since %}v8.4.0{% endsince %}

Limits a number to a maximum value.

Input
```liquid
{{ 4 | at_most: 5 }}
```

Output
```text
4
```

Input
```liquid
{{ 4 | at_most: 3 }}
```

Output
```text
3
```
