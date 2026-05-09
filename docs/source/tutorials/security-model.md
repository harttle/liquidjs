---
title: Security Model
---

LiquidJS provides DoS-oriented limits (`parseLimit`, `renderLimit`, `memoryLimit`) to reduce risk, but these limits are cooperative safeguards, not strict runtime isolation.

## `memoryLimit` is cooperative

`memoryLimit` tracks memory-sensitive allocations inside LiquidJS code paths that explicitly account for them. It is best-effort mitigation for template-driven abuse, not a strict heap cap.

- It does **not** equal process RSS/heap usage.
- It does **not** sandbox JavaScript execution.
- It should be combined with process/container limits and request timeouts for production defense-in-depth.

## What it limits (and what it does not)

`memoryLimit` only limits operations that LiquidJS itself counts.

- Counted: memory-sensitive LiquidJS operations that call internal memory accounting.
- Not guaranteed counted: arbitrary user object behavior such as custom `toValue()`/`toString()` chains, or other host-side code that allocates outside LiquidJS accounting points.

In other words, `memoryLimit` limits what LiquidJS counts, not every byte your process may allocate.

## Guidance for online services

If you run an online service, avoid rendering fully user-defined templates whenever possible.

- Prefer curated templates or a restricted template subset.
- If user-defined templates are required, isolate rendering (worker/process/container), enforce OS/container memory and CPU limits, and apply request rate limits.
- Treat `parseLimit`/`renderLimit`/`memoryLimit` as one layer in a broader DoS defense strategy.

## DoS limits quick reference

LiquidJS provides 3 DoS-oriented options:

- [parseLimit][parseLimit]: limit total template size per `parse()` call.
- [renderLimit][renderLimit]: limit total render time per `render()` call.
- [memoryLimit][memoryLimit]: cooperatively limit memory-sensitive allocations counted by LiquidJS.

For heavy single-template operations, process-level isolation is still recommended (for example with [paralleljs][paralleljs]).

## DoS limits details

### parseLimit

[parseLimit][parseLimit] restricts the size (character length) of templates parsed in each `.parse()` call, including referenced partials and layouts. Since LiquidJS parses template strings in near O(n) time, limiting total template length is usually sufficient.

A typical PC handles `1e8` (100M) characters without issues.

### renderLimit

Restricting template size alone is insufficient because dynamic loops with large counts can occur in render time. [renderLimit][renderLimit] mitigates this by limiting the time consumed by each `render()` call.

```liquid
{%- for i in (1..10000000) -%}
    order: {{i}}
{%- endfor -%}
```

Render time is checked on a per-template basis (before rendering each template). In the above example, there are 2 templates in the loop: `order: ` and `{{i}}`, render time will be checked 10000000x2 times.

For time-consuming tags and filters within a single template, the process can still hang.

### memoryLimit

Even with small number of templates and iterations, memory usage can grow exponentially. In the following example, memory doubles with each iteration:

```liquid
{% assign array = "1,2,3" | split: "," %}
{% for i in (1..32) %}
    {% assign array = array | concat: array %}
{% endfor %}
```

[memoryLimit][memoryLimit] restricts memory-sensitive filters to prevent excessive memory allocation. As [JavaScript uses GC to manage memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management), `memoryLimit` limits only the total number of objects allocated by memory-sensitive operations in LiquidJS and may not reflect the actual memory footprint.

[paralleljs]: https://www.npmjs.com/package/paralleljs
[parseLimit]: /api/interfaces/LiquidOptions.html#parseLimit
[renderLimit]: /api/interfaces/LiquidOptions.html#renderLimit
[memoryLimit]: /api/interfaces/LiquidOptions.html#memoryLimit
