---
title: ceil
---

{% since %}v1.9.1{% endsince %}

向上取整，取整前 LiquidJS 会首先把输入转换为数字。

输入
```liquid
{{ 1.2 | ceil }}
```

输出
```text
2
```

输入
```liquid
{{ 2.0 | ceil }}
```

输出
```text
2
```

输入
```liquid
{{ 183.357 | ceil }}
```

输出
```text
184
```

下面的例子中输入是字符串：

输入
```liquid
{{ "3.5" | ceil }}
```

输出
```text
4
```
