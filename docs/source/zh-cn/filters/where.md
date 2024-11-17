---
title: where
---

{% since %}v8.1.0{% endsince %}

按照数组中对象的属性值来过滤得到新数组，如果未指定第二个参数（属性值）则过滤得到所有属性值为 [truthy][truthy] 的对象。

下面的例子中，假设你有一个 `products` 列表并且希望展示其中的厨房产品。使用 `where` 过滤器可以得到一个只包含 `"type"` 属性值为 `"kitchen"` 的元素的数组。

输入
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign kitchen_products = products | where: "type", "kitchen" %}

Kitchen products:
{% for product in kitchen_products %}
- {{ product.title }}
{% endfor %}
```

输出
```text
All products:
- Vacuum
- Spatula
- Television
- Garlic press

Kitchen products:
- Spatula
- Garlic press
```

如果你有一个产品列表且希望只显示可用的产品，可以用 `where` 过滤器但不指定目标值，LiquidJS 会过滤得到 `"available"` 值为 [truthy][truthy] 的产品列表。

输入
```liquid
All products:
{% for product in products %}
- {{ product.title }}
{% endfor %}

{% assign available_products = products | where: "available" %}

Available products:
{% for product in available_products %}
- {{ product.title }}
{% endfor %}
```

输出
```text
All products:
- Coffee mug
- Limited edition sneakers
- Boring sneakers

Available products:
- Coffee mug
- Boring sneakers
```

`where` 后面再加一个 `first` 可以用来得到单个元素。例如，你要展示秋季系列里的单个 T-shirt。

输入
```liquid
{% assign new_shirt = products | where: "type", "shirt" | first %}

Featured product: {{ new_shirt.title }}
```

输出
```text
Featured product: Hawaiian print sweater vest
```

此外 `property` 可以是任意合法的变量表达式，就像在**输出**结构中一样，只是它的上下文是数组的每一个元素。对于下面的 `products` 数组：

```javascript
const products = [
    { meta: { details: { class: 'A' } }, order: 1 },
    { meta: { details: { class: 'B' } }, order: 2 },
    { meta: { details: { class: 'B' } }, order: 3 }
]
```

输入
```liquid
{% assign selected = products | where: 'meta.details["class"]', "B" %}
{% for item in selected -%}
- {{ item.order }}
{% endfor %}
```

输出
```text
- 2
- 3
```

## Jekyll 风格

{% since %}v10.19.0{% endsince %}

对于从 Jekyll 迁移到 Liquid 的用户，有一个 `jekyllWhere` 选项可以模拟 Jekyll 的 `where` 过滤器的行为。该选项默认设置为 `false`。启用后，如果 `property` 是一个数组，目标值将使用 `Array.includes` 而不是 `==` 进行匹配，这在过滤标签时特别有用。

例如，以下代码：

```javascript
const pages = [
    { tags: ["cat", "food"], title: 'Cat Food' },
    { tags: ["dog", "food"], title: 'Dog Food' },
]
```

输入
```liquid
{% assign selected = pages | where: 'tags', "cat" %}
{% for item in selected -%}
- {{ item.title }}
{% endfor %}
```

输出
```text
Cat Food
```

[truthy]: ../tutorials/truthy-and-falsy.html
