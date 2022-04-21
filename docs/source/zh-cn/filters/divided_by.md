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

在 JavaScript 里数字没有浮点和整数的区分，它们的类型都是 `number`：

```javascript
// always true
5.0 === 5
```

因此如果需要做整数运算，需要传入额外的 `integerArithmetic` 参数：

Input
```liquid
{{ 5 | divided_by: 3, true }}
```

Output
```text
1
```

[floor]: ./floor.html
