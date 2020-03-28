---
title: Operators
---

LiquidJS operators are very simple and different. There're 2 types of operators supported:

* Comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`
* Logic operators: `or`, `and`, `contains`

Thus numerical operators are not supported and you cannot even plus two numbers like this `{% raw %}{{a + b}}{% endraw %}`, instead we need a filter `{% raw %}{{ a | plus: b}}{% endraw %}`. Actually `+` is a valid variable name in LiquidJS.

## Precedence

1. Comparison operators. All comparison operations have the same precedence and higher than logic operators.
2. Logic operators. All logic operators have the same precedence.

## Associativity

Logic operators are evaluated from right to left, see [shopify docs][operator-order].

[operator-order]: https://help.shopify.com/en/themes/liquid/basics/operators#order-of-operations
