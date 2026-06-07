---
title: has
---

{% since %}v10.21.0{% endsince %}

Return `true` if the array includes an item for which the queried attribute has the given value or return `false` if no item in the array satisfies the given criteria. For the following `members` array:

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2014, name: 'Jack' }
]
```

Input
```liquid
{{ members | has: "graduation_year", 2014 | json }}
```

Output
```text
true
```
