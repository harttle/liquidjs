---
title: capitalize
---

{% since %}v1.9.1{% endsince %}

把字符串首字母改为大写。

输入
```liquid
{{ "title" | capitalize }}
```

输出
```text
Title
```

`capitalize` 只会大写首字母，因此后续单词的不会受影响：

 Input
```liquid
{{ "my great title" | capitalize }}
```

输出
```text
My great title
```
