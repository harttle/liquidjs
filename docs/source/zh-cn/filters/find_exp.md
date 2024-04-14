---
title: find_exp
---

{% since %}v10.11.0{% endsince %}

找到数组中给定的表达式值为 `true` 的第一个元素，如果没有这样的元素则返回 `nil`。对于下面的 `members` 数组：

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2014, name: 'Jack' }
]
```

输入
```liquid
{{ members | find_exp: "item", "item.graduation_year == 2014" | json }}
```

输出
```text
{"graduation_year":2014,"name":"John"}
```
