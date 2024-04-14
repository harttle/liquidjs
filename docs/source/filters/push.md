---
title: push
---

{% since %}v10.8.0{% endsince %}

Push an element into array. It's NON-DESTRUCTIVE, i.e. it does not mutate the array, but rather make a copy and mutate that.

Input
```liquid
{% assign fruits = "apples, oranges" | split: ", " %}

{% assign everything = fruits | push: "peaches" %}

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
