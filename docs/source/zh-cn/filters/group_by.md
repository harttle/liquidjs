---
title: group_by
---

{% since %}v10.11.0{% endsince %}

把数组元素按照给定的属性的值分组。对于 `members` 数组：

```javascript
const members = [
  { graduation_year: 2003, name: 'Jay' },
  { graduation_year: 2003, name: 'John' },
  { graduation_year: 2004, name: 'Jack' }
]
```

输入
```liquid
{{ members | group_by: "graduation_year" | json: 2 }}
```

输出
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
