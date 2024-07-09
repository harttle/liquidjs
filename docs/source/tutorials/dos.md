---
title: DoS Prevention
---

When the template or data context cannot be trusted, enabling DoS prevention options is crucial. LiquidJS provides 3 options for this purpose: `parseLimit`, `renderLimit`, and `memoryLimit`.

## TL;DR

Setting these options can largely ensure that your LiquidJS instance won't hang for extended periods or consume excessive memory. These limits are based on the available JavaScript APIs, so they are not precise hard limits but thresholds to help prevent your process from failing or hanging.

```typescript
const liquid = new Liquid({
    parseLimit: 1e8, // typical size of your templates in each render
    renderLimit: 1000, // limit each render to be completed in 1s
    memoryLimit: 1e9, // memory available for LiquidJS (1e9 for 1GB)
})
```

When a `parse()` or `render()` cannot be completed within given resource, it throws.

## parseLimit

[parseLimit][parseLimit] restricts the size (character length) of templates parsed in each `.parse()` call, including referenced partials and layouts. Since LiquidJS parses template strings in near O(n) time, limiting total template length is usually sufficient.

A typical PC handles `1e8` (100M) characters without issues.

## renderLimit

Restricting template size alone is insufficient because dynamic loops with large counts can occur in render time. [renderLimit][renderLimit] mitigates this by limiting the time consumed by each `render()` call.

```liquid
{%- for i in (1..10000000) -%}
    order: {{i}}
{%- endfor -%}
```

Render time is checked on a per-template basis (before rendering each template). In the above example, there are 2 templates in the loop: `order: ` and `{{i}}`, render time will be checked 10000000x2 times.

For time-consuming tags and filters within a single template, the process can still hang. For fully controlled rendering, consider using a process manager like [paralleljs][paralleljs].

## memoryLimit

Even with small number of templates and iterations, memory usage can grow exponentially. In the following example, memory doubles with each iteration:

```liquid
{% assign array = "1,2,3" | split: "," %}
{% for i in (1..32) %}
    {% assign array = array | concat: array %}
{% endfor %}
```

[memoryLimit][memoryLimit] restricts memory-sensitive filters to prevent excessive memory allocation. As [JavaScript uses GC to manage memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management), `memoryLimit` limits only the total number of objects allocated by memory sensitive filters in LiquidJS thus may not reflect the actual memory footprint.

[paralleljs]: https://www.npmjs.com/package/paralleljs
[parseLimit]: /api/interfaces/LiquidOptions.html#parseLimit
[renderLimit]: /api/interfaces/LiquidOptions.html#renderLimit
[memoryLimit]: /api/interfaces/LiquidOptions.html#memoryLimit