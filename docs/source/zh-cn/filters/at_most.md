---
title: at_most
---

{% since %}v8.4.0{% endsince %}

限制数字到某个最大值。

输入
```liquid
{{ 4 | at_most: 5 }}
```

输出
```text
4
```

输入
```liquid
{{ 4 | at_most: 3 }}
```

输出
```text
3
```
