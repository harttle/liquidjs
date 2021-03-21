---
title: round
---

{% since %}v1.9.1{% endsince %}

Rounds a number to the nearest integer or, if a number is passed as an argument, to that number of decimal places.

Input
```liquid
{{ 1.2 | round }}
```

Output
```text
1
```

Input
```liquid
{{ 2.7 | round }}
```

Output
```text
3
```

Input
```liquid
{{ 183.357 | round: 2 }}
```

Output
```text
183.36
```
