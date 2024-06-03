---
title: date_to_rfc822
---
{% since %}v10.13.0{% endsince %}

Convert a Date into the RFC-822 format used for RSS feeds, same as Jekyll filter `date_to_rfc822`.

Input
```liquid
{{ site.time | date_to_rfc822 }}
```

Output
```text
Mon, 07 Nov 2008 13:07:54 -0800
```

Note that JavaScript `Date` has not timezone information, see [date][date] filter for details.

[date]: ./date.html
