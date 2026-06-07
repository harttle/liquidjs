---
title: cycle
---

{% since %}v1.9.1{% endsince %}

Loops through a group of strings and prints them in the order that they were passed as arguments. Each time `cycle` is called, the next string argument is printed.

## Basic Usage

Input
```liquid
{% cycle "one", "two", "three" %}
{% cycle "one", "two", "three" %}
{% cycle "one", "two", "three" %}
{% cycle "one", "two", "three" %}
```

Output
```text
one
two
three
one
```

Uses for `cycle` include:

- applying odd/even classes to rows in a table
- applying a unique class to the last product thumbnail in a row

## Parameters

`cycle` accepts a "cycle group" parameter in cases where you need multiple `cycle` blocks in one template. If no name is supplied for the cycle group, then it is assumed that multiple calls with the same parameters are one group.

Input
```liquid
{% cycle "first": "one", "two", "three" %}
{% cycle "second": "one", "two", "three" %}
{% cycle "second": "one", "two", "three" %}
{% cycle "first": "one", "two", "three" %}
```

Output
```text
one
one
two
two
```
