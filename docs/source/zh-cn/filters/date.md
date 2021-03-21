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

输入
```liquid
{{ article.published_at | date: "%Y" }}
```

输出
```text
2015
```

对于包含格式正确的字符串也好使：

输入
```liquid
{{ "March 14, 2016" | date: "%b %d, %y" }}
```

输出
```text
Mar 14, 16
```

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
