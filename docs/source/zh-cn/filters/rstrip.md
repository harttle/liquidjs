---
title: rstrip
---

{% since %}v1.9.1{% endsince %}

移除字符串右侧的空白字符（制表符、空格、换行），不影响词之间的空格。

输入
```liquid
BEGIN{{ "          So much room for activities!          " | rstrip }}END
```

输出
```text
BEGIN          So much room for activities!END
```
