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
