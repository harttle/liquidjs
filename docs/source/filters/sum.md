---
title: sum
---

{% since %}v10.10.0{% endsince %}

Computes the sum of all the numbers in an array.
An optional argument specifies which property of the array's items to sum up.

In this example, assume the object `cart.products` contains an array of all products in the cart of a website.
Assume each cart product has a `qty` property that gives the count of that product instance in the cart.
Using the `sum` filter we can calculate the total number of products in the cart.

Input
```liquid
The cart has {{ order.products | sum: "qty" }} products.
```

Output
```text
The cart has 7 products.
```
