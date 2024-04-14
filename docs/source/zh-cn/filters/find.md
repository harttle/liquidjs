---
title: find
---

{% since %}v10.11.0{% endsince %}

在数组中找到给定的属性为给定的值的第一个元素并返回；如果没有这样的元素则返回 `nil`。对于 `members` 数组：

```javascript
const members = [
  { graduation_year: 2013, name: 'Jay' },
  { graduation_year: 2014, name: 'John' },
  { graduation_year: 2014, name: 'Jack' }
]
```

输入
```liquid
{{ members | find: "graduation_year", 2014 | json }}
```

输出
```text
{"graduation_year":2014,"name":"John"}
```
