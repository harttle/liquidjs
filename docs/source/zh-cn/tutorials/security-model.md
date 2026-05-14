---
title: 安全模型
---

LiquidJS 提供了面向 DoS 的限制选项（`parseLimit`、`renderLimit`、`memoryLimit`）来降低风险。本文概述这些限制、[`ownPropertyOnly`][ownPropertyOnly]、自定义 [`Drop`][drop] 的注意事项，以及生产环境应采用的安全边界。

## 安全边界

内置限制是协作式防护，不是严格的运行时隔离。

- 它**不等于**进程的 RSS/heap 实际占用。
- 它**不是** JavaScript 沙箱。
- 在生产环境中应结合进程/容器资源限制和请求超时做分层防护。

## 限制速览

- [parseLimit][parseLimit]：限制每次 `parse()` 的模板总长度。
- [renderLimit][renderLimit]：限制每次 `render()` 的总渲染时间。
- [memoryLimit][memoryLimit]：协作式限制 LiquidJS 已记账的内存敏感分配。

## 限制详解

### parseLimit

[parseLimit][parseLimit] 限制每次 `.parse()` 调用中解析的模板大小（字符长度），包括引用的 partials 和 layouts。由于 LiquidJS 解析模板字符串的时间复杂度接近 O(n)，限制模板总长度通常就足够了。

普通电脑可以很容易处理 `1e8`（100M）个字符的模板。

### renderLimit

仅限制模板大小是不够的，因为在渲染时可能会出现动态的数组和循环。[renderLimit][renderLimit] 通过限制每次 `render()` 调用的时间来缓解这些问题。

```liquid
{%- for i in (1..10000000) -%}
    order: {{i}}
{%- endfor -%}
```

渲染时间是在渲染每个模板之前检查的。在上面的例子中，循环中有两个模板：`order: ` 和 `{{i}}`，因此会检查 2x10000000 次。

`renderLimit` 不是硬性的 CPU 限制器。它是在模板渲染边界做检查，因此检查点之间的高计算开销过滤器/标签/用户自定义函数，或深层模板嵌套，仍可能导致 DoS。

### memoryLimit

`memoryLimit` 只限制 LiquidJS 显式记账到的操作。

- 会被统计：LiquidJS 内部调用了内存记账逻辑的内存敏感操作。
- 不保证被统计：任意用户对象行为（例如自定义 `toValue()` / `toString()` 链）以及其他发生在 LiquidJS 记账点之外的宿主侧分配。

换句话说，`memoryLimit` 限制的是 LiquidJS 的“已记账分配”，而不是进程里每一个字节的分配。

即使模板和迭代次数较少，内存使用量也可能呈指数增长。在下面的示例中，内存会在每次迭代中翻倍：

```liquid
{% assign array = "1,2,3" | split: "," %}
{% for i in (1..32) %}
    {% assign array = array | concat: array %}
{% endfor %}
```

由于 [JavaScript 使用 GC 来管理内存](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)，`memoryLimit` 可能无法反映实际的内存占用。

## `ownPropertyOnly` 与作用域数据

将 [`ownPropertyOnly`][ownPropertyOnly] 设为 `true` 时，普通作用域对象只暴露**自有**属性（不包含继承链与 `Object.prototype` 上的键）。默认 `false` 与常规 JavaScript 属性访问一致。对不可信或可能被污染的对象应使用 `true`；若缺少路径需报错，可配合 [`strictVariables`][strictVariables]。单次渲染可通过 [`RenderOptions`][renderOwnPropertyOnly] 覆盖。该选项只约束作用域数据的读取，不是过滤器、标签或宿主代码的沙箱。

## 自定义 `Drop` 类

[`Drop`][drop] 与普通对象处理不同：即使开启 [`ownPropertyOnly`][ownPropertyOnly]，LiquidJS 仍可能沿原型链读取属性，并在未解析时调用 [`liquidMethodMissing`][liquidMethodMissing]。**你**对 Drop 暴露的能力负责：收窄 API，勿向 Drop 传入不安全数据，除非该类明确为模板访问而设计。仅靠 `ownPropertyOnly` 无法硬化自定义 Drop，应像审计其他特权代码一样审查其实现。

## 在线服务建议

如果你运行在线服务，建议尽量避免渲染完全由用户定义的模板。

- 优先使用受控模板或受限模板子集。
- 如果必须支持用户自定义模板，请隔离渲染（worker/进程/容器），并同时配置操作系统或容器级的内存/CPU 限额与请求限流。
- 将 `parseLimit` / `renderLimit` / `memoryLimit` 视为 DoS 防护体系中的一层，而不是唯一防线。

对于单个模板中的重型操作，仍建议使用进程级隔离（例如 [paralleljs][paralleljs]）。

[paralleljs]: https://www.npmjs.com/package/paralleljs
[parseLimit]: /api/interfaces/LiquidOptions.html#parseLimit
[renderLimit]: /api/interfaces/LiquidOptions.html#renderLimit
[memoryLimit]: /api/interfaces/LiquidOptions.html#memoryLimit
[ownPropertyOnly]: /api/interfaces/LiquidOptions.html#ownPropertyOnly
[renderOwnPropertyOnly]: /api/interfaces/RenderOptions.html#ownPropertyOnly
[strictVariables]: /api/interfaces/LiquidOptions.html#strictVariables
[drop]: /api/classes/Drop.html
[liquidMethodMissing]: /api/classes/Drop.html#liquidMethodMissing
