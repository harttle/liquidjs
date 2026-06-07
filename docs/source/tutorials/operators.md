---
title: Operators
---

LiquidJS operators are very simple and different. There are 2 types of operators supported:

* Comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`
* Logical operators: `not`, `or`, `and`, `contains`

Thus arithmetic operators are not supported and you cannot add two numbers like this `{% raw %}{{a + b}}{% endraw %}`. Instead, use a filter: `{% raw %}{{ a | plus: b}}{% endraw %}`. Actually `+` is a valid variable name in LiquidJS.

## Logical Operators

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
3. `or` and `and` operators. These logical operators have the same (lowest) precedence.

## Associativity

Logical operators are evaluated from right to left, see [shopify docs][operator-order].

[operator-order]: https://shopify.dev/docs/api/liquid/basics#order-of-operations
