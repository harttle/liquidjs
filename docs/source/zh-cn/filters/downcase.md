---
title: downcase
---

{% since %}v1.9.1{% endsince %}

字符串中每个字符都转为小写，对已经是小写的字符没有影响。

输入
```liquid
{{ "Parker Moore" | downcase }}
```

输出
```text
parker moore
```

输入
```liquid
{{ "apple" | downcase }}
```

输出
```text
apple
```
