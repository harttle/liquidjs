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

{% note info Integer Arithmetic %}Since JavaScript doesn't differentiate integers and floats, LiquidJS is not capable of integer arithmetic and the return type is always `number`, the string representation of which depends on its value.{% endnote %}

[floor]: ./floor.html
