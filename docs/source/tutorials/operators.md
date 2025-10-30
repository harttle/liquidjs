---
title: Operators
---

LiquidJS operators are very simple and different. There're 2 types of operators supported:

* Comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`
* Logic operators: `not`, `or`, `and`, `contains`

Thus numerical operators are not supported and you cannot even plus two numbers like this `{% raw %}{{a + b}}{% endraw %}`, instead we need a filter `{% raw %}{{ a | plus: b}}{% endraw %}`. Actually `+` is a valid variable name in LiquidJS.

## Precedence

1. Comparison operators, and `contains`. All comparison operators alongside `contains` have the same (highest) precedence.
2. `not` operator. It has slightly more precedence than `or` and `and`.
3. `or` and `and` operators. These logic operators have the same (lowest) precedence.

## Associativity

Logic operators are evaluated from right to left, see [shopify docs][operator-order].

[operator-order]: https://shopify.dev/docs/api/liquid/basics#order-of-operations
