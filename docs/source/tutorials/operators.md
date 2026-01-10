---
title: Operators
---

LiquidJS operators are very simple and different. There're 2 types of operators supported:

* Comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`
* Logic operators: `not`, `or`, `and`, `contains`

Thus numerical operators are not supported and you cannot even plus two numbers like this `{% raw %}{{a + b}}{% endraw %}`, instead we need a filter `{% raw %}{{ a | plus: b}}{% endraw %}`. Actually `+` is a valid variable name in LiquidJS.

## Logic Operators

### not

Negates a condition. Returns `true` if the condition is false, and `false` if the condition is true.

Input
```liquid
{% if not user.active %}
  User is inactive
{% endif %}
```

### and

Returns `true` if both conditions are true.

Input
```liquid
{% if user.age >= 18 and user.verified %}
  Access granted
{% endif %}
```

### or

Returns `true` if at least one condition is true.

Input
```liquid
{% if user.isAdmin or user.isModerator %}
  You have elevated privileges
{% endif %}
```

### contains

Checks if a string contains a substring, or if an array contains an element.

Input
```liquid
{% if product.title contains "Pack" %}
  This is a pack
{% endif %}
```

## Precedence

1. Comparison operators, and `contains`. All comparison operators alongside `contains` have the same (highest) precedence.
2. `not` operator. It has slightly more precedence than `or` and `and`.
3. `or` and `and` operators. These logic operators have the same (lowest) precedence.

## Associativity

Logic operators are evaluated from right to left, see [shopify docs][operator-order].

[operator-order]: https://shopify.dev/docs/api/liquid/basics#order-of-operations
