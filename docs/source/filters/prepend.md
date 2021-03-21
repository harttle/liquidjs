---
title: prepend
---

{% since %}v1.9.1{% endsince %}

Adds the specified string to the beginning of another string.

Input
```liquid
{{ "apples, oranges, and bananas" | prepend: "Some fruit: " }}
```

Output
```text
Some fruit: apples, oranges, and bananas
```

`prepend` can also be used with variables:

Input
```liquid
{% assign url = "example.com" %}
{{ "/index.html" | prepend: url }}
```

Output
```text

example.com/index.html
```
