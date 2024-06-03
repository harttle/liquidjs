---
title: array_to_sentence_string
---

{% since %}v10.13.0{% endsince %}

把数组转化为句子，用于做标签列表。有一个可选的连接词参数。

输入
```liquid
{{ "foo,bar,baz" | split: "," | array_to_sentence_string }}
```

输出
```text
foo, bar, and baz
```

输入
```liquid
{{ "foo,bar,baz" | split: "," | array_to_sentence_string: "or" }}
```

输出
```text
foo, bar, or baz
```
