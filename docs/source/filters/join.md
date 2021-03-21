---
title: join
---

{% since %}v1.9.1{% endsince %}

Combines the items in an array into a single string using the argument as a separator.

Input
```liquid
{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}
{{ beatles | join: " and " }}
```

Output
```text

John and Paul and George and Ringo
```
