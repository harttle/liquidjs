---
title: date
---
{% since %}v1.9.1{% endsince %}

Date filter is used to convert a timestamp into the specified format.

* LiquidJS tries to conform to Shopify/Liquid, which uses Ruby's core [Time#strftime(string)](https://www.ruby-doc.org/core/Time.html#method-i-strftime). There're differences with [Ruby's format flags](https://ruby-doc.org/core/strftime_formatting_rdoc.html):
  * `%Z` (since v10.11.1) is replaced by the passed-in timezone name from `LiquidOption` or in-place value (see TimeZone below). If passed-in timezone is an offset number instead of string, it'll behave like `%z`. If there's none passed-in timezone, it returns [the runtime's default time zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions#timezone).
  * LiquidJS provides an additional `%q` flag for date ordinals. e.g. `{{ '2023/02/02' | date: '%d%q of %b'}}` => `02nd of Feb`
* Date literals are firstly converted to `Date` object via [new Date()][jsDate], that means literal values are considered in runtime's time zone by default.
* The format filter argument is optional:
    * If not provided, it defaults to `%A, %B %-e, %Y at %-l:%M %P %z`.
    * The above default can be overridden by [`dateFormat`](/api/interfaces/LiquidOptions.html#dateFormat) LiquidJS option.
* LiquidJS `date` supports locale specific weekdays and month names, which will fallback to English where `Intl` is not supported.
    * Ordinals (`%q`) and Jekyll specific date filters are English-only.
    * [`locale`](/api/interfaces/LiquidOptions.html#locale) can be set when creating Liquid instance. Defaults to `Intl.DateTimeFormat().resolvedOptions.locale`).

### Examples
```liquid
{{ article.published_at | date: '%a, %b %d, %y' }} => Fri, Jul 17, 15
{{ "now" | date: "%Y-%m-%d %H:%M" }} => 2020-03-25 15:57

// equivalent to setting options.dateFormat = %d%q of %b %Y at %I:%M %P %Z
{{ '1990-12-31T23:30:28Z' | date: '%d%q of %b %Y at %I:%M %P %Z', -330 }} => 01st of Jan 1991 at 05:00 am +0530;
```

# TimeZone
* During output, LiquidJS uses local timezone which can override by:
    * setting a timezone in-place when calling `date` filter, or
    * setting the [`timezoneOffset`](/api/interfaces/LiquidOptions.html#timezoneOffset) LiquidJS option
        * It defaults to runtime's time one.
        * Offset can be set as,
            * minutes: `-360` means `'+06:00'` and `360` means `'-06:00'`
            * timeZone ID: `Asia/Colombo` or `America/New_York`
    * See [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for TZ database values

### Examples
```liquid
// equivalent to setting `options.timezoneOffset` to `360`
{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", 360 }} => 1990-12-31T17:00:00
{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", "Asia/Colombo" }} => 1991-01-01T04:30:00
```

# Input
* `date` works on strings if they contain well-formatted dates
* Note that LiquidJS is using [JavaScript Date][jsDate] to parse the input string, that means [IETF-compliant RFC 2822 timestamps](https://datatracker.ietf.org/doc/html/rfc2822#page-14) and strings in [a version of ISO8601](https://www.ecma-international.org/ecma-262/11.0/#sec-date.parse) are supported.

### Examples
```liquid
{{ "1990-12-31T23:00:00Z" | date: "%Y-%m-%dT%H:%M:%S", 360 }} => 1990-12-31T17:00:00
{{ "March 14, 2016" | date: "%b %d, %y" }} => Mar 14, 16
```


# Current Date
* To get the current time, pass the special word `"now"` or `"today"` as input
* Note that the value will be the current time of when the page was last generated from the template, not when the page is presented to a user if caching or static site generation is involved

### Example
```liquid
Last updated on: {{ "now" | date: "%Y-%m-%d %H:%M" }} => Last updated on: 2020-03-25 15:57
Last updated on: {{ "today" | date: "%Y-%m-%d %H:%M" }} => Last updated on: 2020-03-25 15:57
```

[jsDate]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
