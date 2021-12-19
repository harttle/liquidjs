---
title: Liquid
---

{% since %}v9.31.0{% endsince %}

Encloses multiple tags within one set of delimiters, to allow writing Liquid logic more concisely.

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
