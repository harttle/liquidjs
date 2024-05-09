---
title: date_to_string
---
{% since %}v10.13.0{% endsince %}

Convert a date to short format. Same with Jekyll `date_to_string` filter.

Input
```liquid
{{ site.time | date_to_string }}
```

Output
```text
07 Nov 2008
```

Input
```liquid
{{ site.time | date_to_string: "ordinal", "US" }}
```

Output
```text
Nov 7th, 2008
```

Note that JavaScript `Date` has not timezone information, see [date][date] filter for details.

[date]: ./date.html
