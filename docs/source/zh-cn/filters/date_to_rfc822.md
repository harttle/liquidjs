---
title: date_to_rfc822
---
{% since %}v10.13.0{% endsince %}

把日期转换为 RFC-822 格式用于 RSS feed，与 Jekyll 的 `date_to_rfc822` 过滤器一样。

输入
```liquid
{{ site.time | date_to_rfc822 }}
```

输入
```text
Mon, 07 Nov 2008 13:07:54 -0800
```

注意 JavaScript `Date` 没有时区信息，详情请参考 [date][date] 过滤器。

[date]: ./date.html
