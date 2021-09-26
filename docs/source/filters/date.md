---
title: date
---

{% since %}v1.9.1{% endsince %}

Converts a timestamp into another date format. LiquidJS tries to be conformant with Shopify/Liquid which is using Ruby's core [Time#strftime(string)](http://www.ruby-doc.org/core/Time.html#method-i-strftime). The input is firstly converted to `Date` object via [new Date()][newDate].

Input
```liquid
{{ article.published_at | date: "%a, %b %d, %y" }}
```

Output
```text
Fri, Jul 17, 15
```

{% note info TimeZone %}
Date will be converted to local time before output. To avoid that, you can set `timezoneOffset` LiquidJS option to `0`, its default value is your local timezone offset which can be obtained by `new Date().getTimezoneOffset()`.
{% endnote %}

Input
```liquid
{{ article.published_at | date: "%Y" }}
```

Output
```text
2015
```

`date` works on strings if they contain well-formatted dates:

Input
```liquid
{{ "March 14, 2016" | date: "%b %d, %y" }}
```

Output
```text
Mar 14, 16
```

{% note info Timestamp Strings %}
Note that LiquidJS is using JavaScript [Date][newDate] to parse the input string, that means [IETF-compliant RFC 2822 timestamps](https://datatracker.ietf.org/doc/html/rfc2822#page-14) and strings in [a version of ISO8601](https://www.ecma-international.org/ecma-262/11.0/#sec-date.parse) are supported.
{% endnote %}

To get the current time, pass the special word `"now"` (or `"today"`) to `date`:

Input
```liquid
This page was last updated at {{ "now" | date: "%Y-%m-%d %H:%M" }}.
```

Output
```text
This page was last updated at 2020-03-25 15:57.
```

{% note info now %}Note that the value will be the current time of when the page was last generated from the template, not when the page is presented to a user if caching or static site generation is involved.{% endnote %}

[newDate]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date
