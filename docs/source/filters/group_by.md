---
title: group_by
---

{% since %}v10.11.0{% endsince %}

Group an array's items by a given property. For `members` array:

```javascript
const members = [
  { graduation_year: 2003, name: 'Jay' },
  { graduation_year: 2003, name: 'John' },
  { graduation_year: 2004, name: 'Jack' }
]
```

Input
```liquid
{{ members | group_by: "graduation_year" | json: 2 }}
```

Output
```text
[
  {
    "name": 2003,
    "items": [
      {
        "graduation_year": 2003,
        "name": "Jay"
      },
      {
        "graduation_year": 2003,
        "name": "John"
      }
    ]
  },
  {
    "name": 2004,
    "items": [
      {
        "graduation_year": 2004,
        "name": "Jack"
      }
    ]
  }
]
```
