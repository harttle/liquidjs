---
title: floor
---

{% since %}v1.9.1{% endsince %}

数字下取整，LiquidJS 会尝试把输入转换为数字再做下取整操作。

输入
```liquid
{{ 1.2 | floor }}
```

输出
```text
1
```

输入
```liquid
{{ 2.0 | floor }}
```

输出
```text
2
```

输入
```liquid
{{ 183.357 | floor }}
```

输出
```text
183
```

下面的例子中输入是个数字：

输入
```liquid
{{ "3.5" | floor }}
```

输出
```text
3
```
