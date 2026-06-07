---
title: date_to_long_string
---
{% since %}v10.13.0{% endsince %}

Convert a date to long format. Same with Jekyll `date_to_long_string` filter.

Input
```liquid
{{ site.time | date_to_long_string }}
```

Output
```text
07 November 2008
```

Input
```liquid
{{ site.time | date_to_long_string: "ordinal" }}
```

Output
```text
7th November 2008
```

Note that JavaScript `Date` has not timezone information, see [date][date] filter for details.

[date]: ./date.html
