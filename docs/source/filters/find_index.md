---
title: find_index
---

{% since %}v10.21.0{% endsince %}

Return the 0-based index of the first object in an array for which the queried attribute has the given value or return `nil` if no item in the array satisfies the given criteria. For the following `members` array:

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2014, name: 'Jack' }
]
```

Input
```liquid
{{ members | find_index: "graduation_year", 2014 | json }}
```

Output
```text
1
```
