---
title: divided_by
---

{% since %}v1.9.1{% endsince %}

两数相除返回商，返回结果数字在 JavaScript 中 `.toString()` 得到的字符串。

输入
```liquid
{{ 16 | divided_by: 4 }}
```

输出
```text
4
```

输入
```liquid
{{ 5 | divided_by: 3 }}
```

输出
```text
1.6666666666666667
```

{% note info Integer Arithmetic %}Since JavaScript doesn't differentiate integers and floats, LiquidJS is not capable of integer arithmetic and the return type is always `number`, the string representation of which depends on its value.{% endnote %}

[floor]: ./floor.html
