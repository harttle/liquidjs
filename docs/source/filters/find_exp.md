---
title: find_exp
---

{% since %}v10.11.0{% endsince %}

Return the first object in an array for which the given expression evaluates to true or return `nil` if no item in the array satisfies the evaluated expression.

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2014, name: 'Jack' }
]
```

Input
```liquid
{{ members | find_exp: "item", "item.graduation_year == 2014" | json }}
```

Output
```text
{"graduation_year":2014,"name":"John"}
```
