---
title: truncate
---

{% since %}v1.9.1{% endsince %}

把字符串截断为指定长度，可以指定一个数字表示截断到多少长度。最后会添加一个省略号（...）且记在长度里。

## 基本使用

输入
```liquid
{{ "Ground control to Major Tom." | truncate: 20 }}
```

输出
```text
Ground control to...
```

## 自定义省略号

`truncate` 的第二个可选参数用来指定后面追加的字符串，默认为省略号（...）。这个参数的长度会计算在第一个参数的长度里。例如，如果要把字符串截断到 10 个字符，并使用了一个 3 字符长度的省略号，那么第一个参数的值要设置到 **13**。

输入
```liquid
{{ "Ground control to Major Tom." | truncate: 25, ", and so on" }}
```

输出
```text
Ground control, and so on
```

## 不要省略号

如果需要把字符串截断到特定长度且不要添加省略号，则把第二个参数设置为空字符串：

输入
```liquid
{{ "Ground control to Major Tom." | truncate: 20, "" }}
```

输出
```text
Ground control to Ma
```
