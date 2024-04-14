---
title: shift
---

{% since %}v10.11.0{% endsince %}

Shift an element from the array. It's NON-DESTRUCTIVE, i.e. it does not mutate the array, but rather make a copy and mutate that.

Input
```liquid
{% assign fruits = "apples, oranges, peaches" | split: ", " %}

{% assign everything = fruits | shift %}

{% for item in everything %}
- {{ item }}
{% endfor %}
```

Output
```text
- oranges
- peaches
```
