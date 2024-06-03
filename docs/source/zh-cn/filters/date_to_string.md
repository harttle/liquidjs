---
title: date_to_string
---
{% since %}v10.13.0{% endsince %}

把日期转换为短格式（只支持 US/UK 两种），与 Jekyll 的 `date_to_string` 过滤器一样。

输入
```liquid
{{ site.time | date_to_string }}
```

输出
```text
07 Nov 2008
```

输入
```liquid
{{ site.time | date_to_string: "ordinal", "US" }}
```

输出
```text
Nov 7th, 2008
```

注意 JavaScript `Date` 没有时区信息，详情请参考 [date][date] 过滤器。

[date]: ./date.html
