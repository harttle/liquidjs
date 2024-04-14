---
title: group_by_exp
---

{% since %}v10.11.0{% endsince %}

Group an array's items using a Liquid expression. For `members` array below:

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2009, name: 'Jack' }
]
```

Input
```liquid
{{ members | group_by_exp: "item", "item.graduation_year | truncate: 3, ''" | json: 2 }}
```

Output
```text
[
  {
    "name": "201",
    "items": [
      {
        "graduation_year": 2013,
        "name": "Jay"
      },
      {
        "graduation_year": 2014,
        "name": "John"
      }
    ]
  },
  {
    "name": "200",
    "items": [
      {
        "graduation_year": 2009,
        "name": "Jack"
      }
    ]
  }
]
```
