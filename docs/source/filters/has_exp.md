---
title: has_exp
---

{% since %}v10.21.0{% endsince %}

Return `true` if an item exists in an array for which the given expression evaluates to true or return `false` if no item in the array satisfies the evaluated expression.

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2014, name: 'Jack' }
]
```

Input
```liquid
{{ members | has_exp: "item", "item.graduation_year == 2014" | json }}
```

Output
```text
true
```
