---
title: lstrip
---

{% since %}v1.9.1{% endsince %}

移除字符串左侧的空白字符（制表符、空格、换行），不影响词之间的空格。

输入
```liquid
BEGIN{{ "          So much room for activities!          " | lstrip }}END
```

输出
```text
BEGINSo much room for activities!          END
```
