---
title: 过滤器
---

LiquidJS 支持 Liquid 语法中具体业务无关的过滤器，基本上 [shopify/liquid 核心][shopify/liquid] 支持的 LiquidJS 都支持。这部分包含了所有 LiquidJS 支持的过滤器的文档和使用示例。

LiquidJS 共支持 40+ 个过滤器，可以分为如下几类：

类别 | 过滤器
--- | ---
数学 | plus, minus, modulo, times, floor, ceil, round, divided_by, abs
字符串 | append, prepend, capitalize, upcase, downcase, strip, lstrip, rstrip, strip_newlines, split, replace, replace_first, remove, remove_first, truncate, truncatewords
HTML/URI | escape, escape_once, url_encode, url_decode, strip_html, newline_to_br
数组 | slice, map, sort, sort_natural, uniq, wheres, first, last, join, reverse, concat
日期 | date

[shopify/liquid]: https://github.com/Shopify/liquid
