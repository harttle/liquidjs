---
title: 防止 DoS 攻击
---

当模板或数据上下文不可信时，启用DoS预防选项至关重要。LiquidJS 提供了三个选项用于此目的：`parseLimit`、`renderLimit` 和 `memoryLimit`。

## TL;DR

设置这些选项可以在很大程度上确保你的 LiquidJS 实例不会长时间挂起或消耗过多内存。这些限制基于可用的 JavaScript API，因此它们不是精确的硬性限制，而是确保你的进程不会失败或挂起的阈值。

```typescript
const liquid = new Liquid({
    parseLimit: 1e8, // 每次渲染的模板的典型大小
    renderLimit: 1000, // 每次渲染最多 1s
    memoryLimit: 1e9, // LiquidJS 可用的内存（1e9 对应 1GB）
})
```

## parseLimit

[parseLimit][parseLimit] 限制每次 `.parse()` 调用中解析的模板大小（字符长度），包括引用的 partials 和 layouts。由于 LiquidJS 解析模板字符串的时间复杂度接近 O(n)，限制模板总长度通常就足够了。

普通电脑可以很容易处理 `1e8`（100M）个字符的模板。

## renderLimit

仅限制模板大小是不够的，因为在渲染时可能会出现动态的数组和循环。[renderLimit][renderLimit] 通过限制每次 `render()` 调用的时间来缓解这些问题。

```liquid
{%- for i in (1..10000000) -%}
    order: {{i}}
{%- endfor -%}
```

渲染时间是在渲染每个模板之前检查的。在上面的例子中，循环中有两个模板：`order: ` 和 `{{i}}`，因此会检查 2x10000000 次。

单个模板内的标签和过滤器仍然可能把进程挂起。要完全控制渲染过程，建议使用类似 [paralleljs][paralleljs] 的进程管理器。

## memoryLimit

即使模板和迭代次数较少，内存使用量也可能呈指数增长。在下面的示例中，内存会在每次迭代中翻倍：

```liquid
{% assign array = "1,2,3" | split: "," %}
{% for i in (1..32) %}
    {% assign array = array | concat: array %}
{% endfor %}
```

[memoryLimit][memoryLimit] 限制内存敏感的过滤器，以防止过度的内存分配。由于 [JavaScript 使用 GC 来管理内存](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)，`memoryLimit` 仅限制 LiquidJS 中内存敏感过滤器分配的对象总数，因此可能无法反映实际的内存占用。

[paralleljs]: https://www.npmjs.com/package/paralleljs
[parseLimit]: /api/interfaces/LiquidOptions.html#parseLimit
[renderLimit]: /api/interfaces/LiquidOptions.html#renderLimit
[memoryLimit]: /api/interfaces/LiquidOptions.html#memoryLimit