---
title: round
---

{% since %}v1.9.1{% endsince %}

数字四舍五入取整，如果传入小数位数作为参数。

输入
```liquid
{{ 1.2 | round }}
```

输出
```text
1
```

输入
```liquid
{{ 2.7 | round }}
```

输出
```text
3
```

输入
```liquid
{{ 183.357 | round: 2 }}
```

输出
```text
183.36
```
