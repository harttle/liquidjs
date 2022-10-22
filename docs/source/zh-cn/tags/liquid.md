---
title: Liquid
---

{% since %}v9.31.0{% endsince %}

通过 liquid 标签可以在一个分隔符中使用多个标签, 使 Liquid 逻辑书写更简洁。

## liquid

输入
```liquid
{% liquid
  assign names = 'Bob, Sally' | split: ', '

  for name in names
    echo 'Hello, ' | append: name
    unless forloop.last
      echo ', '
    endunless
  endfor
%}
```

输出
```text
Hello, Bob, Hello Sally
```
