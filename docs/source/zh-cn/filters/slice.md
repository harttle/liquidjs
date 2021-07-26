---
title: slice
---

{% since %}v1.9.1{% endsince %}

返回第一个参数为下标位置的一个字符，如果指定了第二个参数会被解释为子字符串的长度。字符串下标从零开始。

输入
```liquid
{{ "Liquid" | slice: 0 }}
```

输出
```text
L
```

输入
```liquid
{{ "Liquid" | slice: 2 }}
```

输出
```text
q
```

输入
```liquid
{{ "Liquid" | slice: 2, 5 }}
```

输出
```text
quid
```

If the first argument is a negative number, the indices are counted from the end of the string:

输入
```liquid
{{ "Liquid" | slice: -3, 2 }}
```

输出
```text
ui
```
