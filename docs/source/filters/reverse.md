---
title: reverse
---

{% since %}v1.9.1{% endsince %}

Reverses the order of the items in an array. `reverse` cannot reverse a string.

Input
```liquid
{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}

{{ my_array | reverse | join: ", " }}
```

Output
```text


plums, peaches, oranges, apples
```

Although `reverse` cannot be used directly on a string, you can split a string into an array, reverse the array, and rejoin it by chaining together filters:

Input
```liquid
{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}
```

Output
```text
.moT rojaM ot lortnoc dnuorG
```
