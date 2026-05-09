---
title: 安全模型
---

LiquidJS 提供了面向 DoS 的限制选项（`parseLimit`、`renderLimit`、`memoryLimit`）来降低风险，但这些限制是协作式防护，不是严格的运行时隔离。

## `memoryLimit` 是协作式限制

`memoryLimit` 只会统计 LiquidJS 内部显式记账的内存敏感分配。它是针对模板滥用的“尽力而为”缓解机制，不是严格的堆内存上限。

- 它**不等于**进程的 RSS/heap 实际占用。
- 它**不是** JavaScript 沙箱。
- 在生产环境中应结合进程/容器资源限制和请求超时做分层防护。

## 它限制什么（以及不限制什么）

`memoryLimit` 只限制 LiquidJS 自己统计到的操作。

- 会被统计：LiquidJS 内部调用了内存记账逻辑的内存敏感操作。
- 不保证被统计：任意用户对象行为（例如自定义 `toValue()` / `toString()` 链）以及其他发生在 LiquidJS 记账点之外的宿主侧分配。

换句话说，`memoryLimit` 限制的是 LiquidJS 的“已记账分配”，而不是进程里每一个字节的分配。

## 在线服务建议

如果你运行在线服务，建议尽量避免渲染完全由用户定义的模板。

- 优先使用受控模板或受限模板子集。
- 如果必须支持用户自定义模板，请隔离渲染（worker/进程/容器），并同时配置操作系统或容器级的内存/CPU 限额与请求限流。
- 将 `parseLimit` / `renderLimit` / `memoryLimit` 视为 DoS 防护体系中的一层，而不是唯一防线。

## DoS 限制速查

LiquidJS 提供 3 个 DoS 相关选项：

- [parseLimit][parseLimit]：限制每次 `parse()` 的模板总长度。
- [renderLimit][renderLimit]：限制每次 `render()` 的总渲染时间。
- [memoryLimit][memoryLimit]：协作式限制 LiquidJS 已记账的内存敏感分配。

对于单个模板中的重型操作，仍建议使用进程级隔离（例如 [paralleljs][paralleljs]）。

[paralleljs]: https://www.npmjs.com/package/paralleljs
[parseLimit]: /api/interfaces/LiquidOptions.html#parseLimit
[renderLimit]: /api/interfaces/LiquidOptions.html#renderLimit
[memoryLimit]: /api/interfaces/LiquidOptions.html#memoryLimit
