---
title: divided_by
---

{% since %}v1.9.1{% endsince %}

Divides a number by another number. The result is the string obtained by JavaScript `.toString()` of the result number.

Input
```liquid
{{ 16 | divided_by: 4 }}
```

Output
```text
4
```

Input
```liquid
{{ 5 | divided_by: 3 }}
```

Output
```text
1.6666666666666667
```

In JavaScript, float and integer shares the same type `number` and we cannot tell the difference. For example:

```javascript
// always true
5.0 === 5
```

You'll need to pass another `integerArithmetic` argument to enforce integer divide:

Input
```liquid
{{ 5 | divided_by: 3, true }}
```

Output
```text
1
```

[floor]: ./floor.html
