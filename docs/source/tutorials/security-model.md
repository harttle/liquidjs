---
title: Security Model
---

LiquidJS provides DoS-oriented limits (`parseLimit`, `templateLimit`, `outputLengthLimit`, `maxDepth`) to reduce risk. This page summarizes those limits, [`ownPropertyOnly`][ownPropertyOnly], custom [`Drop`][drop] usage, and the security boundary to assume in production.

## Security boundary

The built-in limits are cooperative safeguards, not strict runtime isolation.

- They do **not** equal process RSS/heap usage.
- They do **not** sandbox JavaScript execution.
- They should be combined with process/container limits and request timeouts for defense in depth.

## Limits at a glance

- [parseLimit][parseLimit]: limit total template size per `parse()` call.
- [templateLimit][templateLimit]: limit total tag/HTML/output nodes rendered per `render()` call.
- [outputLengthLimit][outputLengthLimit]: limit total output length per `render()` call.
- [maxDepth][maxDepth]: limit nesting depth of `{% render %}`, `{% include %}`, and `{% layout %}`.

## Limit details

### parseLimit

[parseLimit][parseLimit] restricts the size (character length) of templates parsed in each `.parse()` call, including referenced partials and layouts. Since LiquidJS parses template strings in near O(n) time, limiting total template length is usually sufficient.

A typical PC handles `1e8` (100M) characters without issues.

### templateLimit

Restricting template size alone is insufficient because dynamic loops with large counts can occur during rendering. [templateLimit][templateLimit] mitigates this by limiting the number of tag, HTML literal, and output nodes rendered in each `render()` call.

```liquid
{%- for i in (1..10000000) -%}
    order: {{i}}
{%- endfor -%}
```

Each template node (the `for` tag, literal `order: `, output `{{i}}`, and so on) counts toward the limit. In the above example, a limit of `30000000` would be exceeded before the loop finishes.

`templateLimit` is checked before each node render, so compute-intensive filters/tags/user-defined functions between checks can still cause DoS.

### outputLengthLimit

[outputLengthLimit][outputLengthLimit] caps the cumulative length of output written during a `render()` call, including output from partials rendered via `{% render %}`.

### maxDepth

[maxDepth][maxDepth] limits how deeply `{% render %}`, `{% include %}`, and `{% layout %}` can nest. Defaults to `128`.

The `memoryLimit` option was removed; memory usage is not capped in-engine.

## `ownPropertyOnly` and scope data

With [`ownPropertyOnly`][ownPropertyOnly] `true`, plain scope objects only expose **own** properties (no inherited / `Object.prototype` keys). Default `false` follows normal JS property access. Use `true` for untrusted or polluted objects; add [`strictVariables`][strictVariables] if missing paths should error. Override per render via [`RenderOptions`][renderOwnPropertyOnly]. This is a read policy for scope data—not a sandbox for filters, tags, or your code.

## Custom `Drop` classes

[`Drop`][drop] values are not restricted the same way: LiquidJS still reads the prototype chain and may call [`liquidMethodMissing`][liquidMethodMissing]. **You** control what a drop exposes; narrow APIs and never feed unsafe data into drops unless the class is built for template access. `ownPropertyOnly` alone does not harden custom drops—audit them like any privileged code.

## Online service guidance

If you run an online service, avoid rendering fully user-defined templates whenever possible.

- Prefer curated templates or a restricted template subset.
- If user-defined templates are required, isolate rendering (worker/process/container), enforce OS/container memory and CPU limits, and apply request rate limits.
- Treat `parseLimit`, `templateLimit`, `outputLengthLimit`, and `maxDepth` as one layer in a broader DoS defense strategy.

For heavy single-template operations, process-level isolation is still recommended (for example with [paralleljs][paralleljs]).

[paralleljs]: https://www.npmjs.com/package/paralleljs
[parseLimit]: /api/interfaces/LiquidOptions.html#parseLimit
[templateLimit]: /api/interfaces/LiquidOptions.html#templateLimit
[outputLengthLimit]: /api/interfaces/LiquidOptions.html#outputLengthLimit
[maxDepth]: /api/interfaces/LiquidOptions.html#maxDepth
[ownPropertyOnly]: /api/interfaces/LiquidOptions.html#ownPropertyOnly
[renderOwnPropertyOnly]: /api/interfaces/RenderOptions.html#ownPropertyOnly
[strictVariables]: /api/interfaces/LiquidOptions.html#strictVariables
[drop]: /api/classes/Drop.html
[liquidMethodMissing]: /api/classes/Drop.html#liquidMethodMissing
