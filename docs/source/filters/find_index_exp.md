---
title: find_index_exp
---

{% since %}v10.21.0{% endsince %}

Return the 0-based index of the first object in an array for which the given expression evaluates to true or return `nil` if no item in the array satisfies the evaluated expression.

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2014, name: 'Jack' }
]
```

Input
```liquid
{{ members | find_index_exp: "item", "item.graduation_year == 2014" | json }}
```

Output
```text
1
```
