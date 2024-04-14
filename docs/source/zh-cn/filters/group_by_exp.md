---
title: group_by_exp
---

{% since %}v10.11.0{% endsince %}

把数组元素按照给定的 Liquid 表达式的值分组。对于 `members` 数组：

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2009, name: 'Jack' }
]
```

输入
```liquid
{{ members | group_by_exp: "item", "item.graduation_year | truncate: 3, ''" | json: 2 }}
```

输出
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
