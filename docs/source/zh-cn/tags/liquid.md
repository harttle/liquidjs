---
title: Liquid
---

{% since %}v9.31.0{% endsince %}

通过liquid标签可以在一个分隔符中使用多个标签, 使Liquid逻辑书写更简洁

## liquid

Input
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

Output
```text
Hello, Bob, Hello Sally
```
