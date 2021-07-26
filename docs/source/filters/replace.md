---
title: replace
---

{% since %}v1.9.1{% endsince %}

Replaces every occurrence of the first argument in a string with the second argument.

Input
```liquid
{{ "Take my protein pills and put my helmet on" | replace: "my", "your" }}
```

Output
```text
Take your protein pills and put your helmet on
```
