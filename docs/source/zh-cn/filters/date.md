---
title: date
---

{% since %}v1.9.1{% endsince %}

把时间戳转换为字符串。LiquidJS 尝试跟 Shopify/Liquid 保持一致，它用的是 Ruby 核心的 [Time#strftime(string)](http://www.ruby-doc.org/core/Time.html#method-i-strftime)。此外 LiquidJS 会先通过 [new Date()][newDate] 尝试把输入转换为 Date 对象。

输入
```liquid
{{ article.published_at | date: "%a, %b %d, %y" }}
```

输出
```text
Fri, Jul 17, 15
```

{% note info 时区 %}
日期在输出时会转换为当地时区，设置 `timezoneOffset` LiquidJS 参数可以指定一个不同的时区。或者设置 `preserveTimezones` 为 `true` 来保持字面量时间戳的时区，数据中的日期对象不受此参数的影响。
{% endnote %}

你也可以在使用 `date` 时再设置时区：

输入
```liquid
{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", 360}} // 等价于设置 `options.timezoneOffset` to `360`.
{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", "Asia/Colombo" }}
```

输出
```liquid
1990-12-31T17:00:00
1991-01-01T04:30:00
```


输入
```liquid
{{ article.published_at | date: "%Y" }}
```

输出
```text
2015
```

输入也可以是符合 JavaScript `Date` 格式的字符串：：

输入
```liquid
{{ "March 14, 2016" | date: "%b %d, %y" }}
```

输出
```text
Mar 14, 16
```

{% note info 时间戳字符串 %}
LiquidJS 使用 JavaScript [Date][newDate] 来解析输入字符串，意味着支持 [IETF-compliant RFC 2822 时间戳](https://datatracker.ietf.org/doc/html/rfc2822#page-14) 和 [特定版本的 ISO8601](https://www.ecma-international.org/ecma-262/11.0/#sec-date.parse)。
{% endnote %}

可以用特殊值 `"now"`（或`"today"`）来获取当前时间：

输入
```liquid
This page was last updated at {{ "now" | date: "%Y-%m-%d %H:%M" }}.
```

输出
```text
This page was last updated at 2020-03-25 15:57.
```

{% note info 当前时间 %}注意得到的当前时间是模板渲染时的时间，如果你在用静态站点生成器或者模板有被缓存这一时间可能与用户看到的时间不同。{% endnote %}

[newDate]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date
