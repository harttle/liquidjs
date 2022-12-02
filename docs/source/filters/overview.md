---
title: Filters
description: Description and demo for each Liquid filter
---

LiquidJS implements business-logic independent filters that are typically implemented in [shopify/liquid][shopify/liquid]. This section contains the specification and demoes for all the filters implemented by LiquidJS.

There's 40+ filters supported by LiquidJS. These filters can be categorized into these groups:

Categories | Filters
--- | ---
Math | plus, minus, modulo, times, floor, ceil, round, divided_by, abs, at_least, at_most
String | append, prepend, capitalize, upcase, downcase, strip, lstrip, rstrip, strip_newlines, split, replace, replace_first, replace_last,remove, remove_first, remove_last, truncate, truncatewords
HTML/URI | escape, escape_once, url_encode, url_decode, strip_html, newline_to_br
Array | slice, map, sort, sort_natural, uniq, where, first, last, join, reverse, concat, compact, size
Date | date
Misc | default, json, raw

[shopify/liquid]: https://github.com/Shopify/liquid
