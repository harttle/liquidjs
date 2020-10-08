---
title: Truthy and Falsy
---

Though [Liquid][sl] is platform-independent, there're [certain differences][diff] with [the Ruby version][ruby], one of which is the `truthy` value.

## The Truth Table

According to [Shopify document](https://shopify.github.io/liquid/basics/truthy-and-falsy/) everything other than `false` and `nil` is truthy. But in JavaScript we have a totally different type system, we have types like `undefined` and we don't differentiate `integer` and `float`, thus things are slightly different:

value          | truthy | falsy
---            | ---    | ---
`true`         | ✔️      | 
`false`        |        | ✔️
`null`         |        | ✔️
`undefined`    |        | ✔️
`string`       | ✔️      |	 
`empty string` | ✔️      |
`0`            | ✔️      |
`integer`      | ✔️      |
`float`	       | ✔️      |
`array`        | ✔️      |
`empty array`  | ✔️      |

## Use JavaScript Truthy

Note that liquidjs use Shopify's truthiness by default. But it can be toggled to used standard JavaScript truthiness by setting the **jsTruthy** option to `true`.

value          | truthy | falsy
---            | ---    | ---
`true`         | ✔️      | 
`false`        |        | ✔️
`null`         |        | ✔️
`undefined`    |        | ✔️
`string`       | ✔️      |	 
`empty string` |        | ✔️
`0`            |        | ✔️
`integer`      | ✔️      |
`float`        | ✔️      |
`array`        | ✔️      |
`empty array`  | ✔️      |


[ruby]: https://shopify.github.io/liquid
[sl]: https://www.npmjs.com/package/liquidjs
[diff]: https://github.com/harttle/liquidjs#differences-and-limitations