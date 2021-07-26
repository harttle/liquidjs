---
title: abs
---

{% since %}v1.9.1{% endsince %}

返回数字的绝对值。

输入
```liquid
{{ -17 | abs }}
```

输出
```text
17
```

输入
```liquid
{{ 4 | abs }}
```

输出
```text
4
```

对于只包含数字的字符串也好使：

输入
```liquid
{{ "-19.86" | abs }}
```

输出
```text
19.86
```
