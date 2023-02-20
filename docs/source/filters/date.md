---
title: date
---
{% since %}v1.9.1{% endsince %}

# Format
* Converts a timestamp into another date format
* LiquidJS tries to be conformant with Shopify/Liquid which is using Ruby's core [Time#strftime(string)](http://www.ruby-doc.org/core/Time.html#method-i-strftime)
  * Refer [format flags](https://ruby-doc.org/core/strftime_formatting_rdoc.html)
  * Not all options are supported though - refer [differences here](/tutorials/differences.html#Differences)
* The input is firstly converted to `Date` object via [new Date()][jsDate]
* Date format can be provided individually as a filter option
    * If not provided, then `%A, %B %-e, %Y at %-l:%M %P %z` format will be used as default format
    * Override this using [`dateFormat`](/api/interfaces/liquid_options_.liquidoptions.html#Optional-dateFormat) LiquidJS option, to set your preferred default format for all date filters

### Examples
```liquid
{{ article.published_at | date: '%a, %b %d, %y' }} => Fri, Jul 17, 15
{{ "now" | date: "%Y-%m-%d %H:%M" }} => 2020-03-25 15:57

// equivalent to setting options.dateFormat = %d%q of %b %Y at %I:%M %P %Z
{{ '1990-12-31T23:30:28Z' | date: '%d%q of %b %Y at %I:%M %P %Z', -330 }} => 01st of Jan 1991 at 05:00 am +0530;
```

# TimeZone
* By default, dates will be converted to local timezone before output
* You can override that by,
    * setting a timezone for each individual `date` filter via the second parameter
    * using the [`timezoneOffset`](/api/interfaces/liquid_options_.liquidoptions.html#Optional-timezoneOffset) LiquidJS option
        * Its default value is your local timezone offset which can be obtained by `new Date().getTimezoneOffset()`
        * Offset can be set as,
            * minutes: `-360` means `'+06:00'` and `360` means `'-06:00'`
            * timeZone ID: `Asia/Colombo` or `America/New_York`
        * Use minutes for better performance with repeated processing of templates with many dates like, converting template for each email recipient
    * Refer [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for TZ database values

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
