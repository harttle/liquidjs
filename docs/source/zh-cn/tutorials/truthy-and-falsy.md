---
title: 真和假
---

虽然我们希望 [Liquid][sl] 是平台无关的，但 JavaScript 版本和 [Ruby 版本][ruby] 仍然有[很多区别][diff]，真值就是其中之一。

## 真值表

根据 [Shopify 的文档](https://shopify.github.io/liquid/basics/truthy-and-falsy/)，Ruby 版本除了 `false` 和 `nil` 之外的所有值都是真，但 JavaScript 有完全不同的类型系统，比如我们有 `undefined` 类型，以及不区分 `integer` 和 `float`，因此有些不同：

值             | 真     | 假
---            | ---    | ---
`true`         | ✔️      | 
`false`        |        | ✔️
`null`         |        | ✔️
`undefined`    |        | ✔️
`string`       | ✔️      |	 
`empty string` | ✔️      |
`0`            | ✔️      |
`integer`	   | ✔️      |
`float`	       | ✔️      |
`array`        | ✔️      |
`empty array`  | ✔️      |

## 使用 JavaScript 真值

liquidjs 默认使用 Shopify 的真值表，但可以通过设置 **jsTruthy** 选项为 `true` 来使用标准的 JavaScript 真值。

值             | 真     | 假
---            | ---    | ---
`true`         | ✔️      | 
`false`        |        | ✔️
`null`         |        | ✔️
`undefined`    |        | ✔️
`string`       | ✔️      |	 
`empty string` |        | ✔️
`0`            |        | ✔️
`integer`	   | ✔️      |
`float`	       | ✔️      |
`array`        | ✔️      |
`empty array`  | ✔️      |

[ruby]: https://shopify.github.io/liquid
[sl]: https://www.npmjs.com/package/liquidjs
[diff]: https://github.com/harttle/liquidjs#differences-and-limitations