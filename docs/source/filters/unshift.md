---
title: unshift
---

{% since %}v10.11.0{% endsince %}

Unshift an element to the front of the array. It's NON-DESTRUCTIVE, i.e. it does not mutate the array, but rather make a copy and mutate that.

Input
```liquid
{% assign fruits = "oranges, peaches" | split: ", " %}

{% assign everything = fruits | unshift: "apples" %}

{% for item in everything %}
- {{ item }}
{% endfor %}
```

Output
```text
- apples
- oranges
- peaches
```
