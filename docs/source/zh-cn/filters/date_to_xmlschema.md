---
title: date_to_xmlschema
---
{% since %}v10.13.0{% endsince %}

把日期转换为 XML Schema (ISO 8601) 格式，与 Jekyll 的 `date_to_xmlschema` 过滤器一样。

输入
```liquid
{{ site.time | date_to_xmlschema }}
```

输出
```text
2008-11-07T13:07:54-08:00
```

注意 JavaScript `Date` 没有时区信息，详情请参考 [date][date] 过滤器。

[date]: ./date.html
