---
title: Security Model
---

LiquidJS provides DoS-oriented limits (`parseLimit`, `renderLimit`) to reduce risk. This page summarizes those limits, [`ownPropertyOnly`][ownPropertyOnly], custom [`Drop`][drop] usage, and the security boundary to assume in production.

## Security boundary

The built-in limits are cooperative safeguards, not strict runtime isolation.

- They do **not** equal process RSS/heap usage.
- They do **not** sandbox JavaScript execution.
- They should be combined with process/container limits and request timeouts for defense in depth.

LiquidJS does **not** enforce memory or CPU budgets inside the engine. Major template engines take the same approach: byte-level heap tracking is unreliable in garbage-collected runtimes (non-deterministic GC, accounting overhead) and does not map cleanly to real process memory. [Jinja2](https://jinja.palletsprojects.com/en/stable/sandbox/) relies on `sys.setrecursionlimit`, `SandboxedEnvironment` for access control, and advises OS/process limits (`ulimit`, cgroups). [Twig](https://twig.symfony.com/doc/3.x/api.html#security-policy) documents a `SecurityPolicy` for tags/filters/methods and explicitly leaves resource limits to PHP (`memory_limit`, execution timeouts). Handlebars and EJS provide no render budgets; Node.js users typically combine [`vm.Script` timeouts](https://nodejs.org/api/vm.html) or [`worker_threads`](https://nodejs.org/api/worker_threads.html) with process isolation for untrusted templates.

For LiquidJS in production, prefer **external** controls: Node.js `vm` or worker threads (or packages such as [`isolated-vm`](https://www.npmjs.com/package/isolated-vm) when stronger isolation is required), separate processes or containers, OS/container memory and CPU quotas, and request timeouts — not in-engine heap tracking.

## Limits at a glance

- [parseLimit][parseLimit]: limit total template size per `parse()` call.
- [renderLimit][renderLimit]: limit total render time per `render()` call.

## Limit details

### parseLimit

[parseLimit][parseLimit] restricts the size (character length) of templates parsed in each `.parse()` call, including referenced partials and layouts. Since LiquidJS parses template strings in near O(n) time, limiting total template length is usually sufficient.

A typical PC handles `1e8` (100M) characters without issues.

### renderLimit

Restricting template size alone is insufficient because dynamic loops with large counts can occur during rendering. [renderLimit][renderLimit] mitigates this by limiting the time consumed by each `render()` call.

```liquid
{%- for i in (1..10000000) -%}
    order: {{i}}
{%- endfor -%}
```

Render time is checked on a per-template basis (before rendering each template). In the above example, there are 2 templates in the loop: `order: ` and `{{i}}`, render time will be checked 10000000x2 times.

`renderLimit` is not a hard CPU limiter. It is checked between template renders, so compute-intensive filters/tags/user-defined functions or deeply nested template execution between checks can still cause DoS.

Memory-heavy templates (for example exponential `concat` in a loop) are not capped by LiquidJS. Mitigate them with process/container memory limits, output size checks after render, or template restrictions — the same pattern Jinja2 and Twig recommend for heap and CPU.

## `ownPropertyOnly` and scope data

With [`ownPropertyOnly`][ownPropertyOnly] `true`, plain scope objects only expose **own** properties (no inherited / `Object.prototype` keys). Default `false` follows normal JS property access. Use `true` for untrusted or polluted objects; add [`strictVariables`][strictVariables] if missing paths should error. Override per render via [`RenderOptions`][renderOwnPropertyOnly]. This is a read policy for scope data—not a sandbox for filters, tags, or your code.

## Custom `Drop` classes

[`Drop`][drop] values are not restricted the same way: LiquidJS still reads the prototype chain and may call [`liquidMethodMissing`][liquidMethodMissing]. **You** control what a drop exposes; narrow APIs and never feed unsafe data into drops unless the class is built for template access. `ownPropertyOnly` alone does not harden custom drops—audit them like any privileged code.

## Online service guidance

If you run an online service, avoid rendering fully user-defined templates whenever possible.

- Prefer curated templates or a restricted template subset.
- If user-defined templates are required, isolate rendering (worker/process/container), enforce OS/container memory and CPU limits, and apply request rate limits.
- Treat `parseLimit` and `renderLimit` as one layer in a broader DoS defense strategy.

For heavy single-template operations, process-level isolation is still recommended (for example with [paralleljs][paralleljs]).

[paralleljs]: https://www.npmjs.com/package/paralleljs
[parseLimit]: /api/interfaces/LiquidOptions.html#parseLimit
[renderLimit]: /api/interfaces/LiquidOptions.html#renderLimit
[ownPropertyOnly]: /api/interfaces/LiquidOptions.html#ownPropertyOnly
[renderOwnPropertyOnly]: /api/interfaces/RenderOptions.html#ownPropertyOnly
[strictVariables]: /api/interfaces/LiquidOptions.html#strictVariables
[drop]: /api/classes/Drop.html
[liquidMethodMissing]: /api/classes/Drop.html#liquidMethodMissing
