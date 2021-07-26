---
title: truncatewords
---

{% since %}v1.9.1{% endsince %}

把字符串截断为指定个数的单词，可以指定一个数字表示截断到多少个单词。最后会添加一个省略号（...）。

## 基本使用

输入
```liquid
{{ "Ground control to Major Tom." | truncatewords: 3 }}
```

输出
```text
Ground control to...
```

## 自定义省略号

`truncate` 的第二个可选参数用来指定后面追加的字符串，默认为省略号（...）。

输入
```liquid
{{ "Ground control to Major Tom." | truncatewords: 3, "--" }}
```

输出
```text
Ground control to--
```

## 不要省略号

如果不希望添加省略号，把第二个参数设置为空字符串即可：

输入
```liquid
{{ "Ground control to Major Tom." | truncatewords: 3, "" }}
```

输出
```text
Ground control to
```
