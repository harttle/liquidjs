---
title: Filters
description: Description and demo for each Liquid filter
---

LiquidJS implements business-logic independent filters that are typically implemented in [shopify/liquid][shopify/liquid]. This section contains the specification and demos for all the filters implemented by LiquidJS.

There's 40+ filters supported by LiquidJS. These filters can be categorized into these groups:

Categories | Filters
--- | ---
Math | plus, minus, modulo, times, floor, ceil, round, divided_by, abs, at_least, at_most
String | append, prepend, capitalize, upcase, downcase, strip, lstrip, rstrip, strip_newlines, split, replace, replace_first, replace_last,remove, remove_first, remove_last, truncate, truncatewords, normalize_whitespace, number_of_words, array_to_sentence_string
HTML/URI | escape, escape_once, url_encode, url_decode, strip_html, newline_to_br, xml_escape, cgi_escape, uri_escape, slugify
Array | slice, map, sort, sort_natural, uniq, where, where_exp, group_by, group_by_exp, find, find_exp, first, last, join, reverse, concat, compact, size, push, pop, shift, unshift
Date | date, date_to_xmlschema, date_to_rfc822, date_to_string, date_to_long_string
Misc | default, json, jsonify, inspect, raw, to_integer

[shopify/liquid]: https://github.com/Shopify/liquid
