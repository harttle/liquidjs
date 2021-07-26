---
title: remove
---

{% since %}v1.9.1{% endsince %}

Removes every occurrence of the specified substring from a string.

Input
```liquid
{{ "I strained to see the train through the rain" | remove: "rain" }}
```

Output
```text
I strained to see the t through the 
```
