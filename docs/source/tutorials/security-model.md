---
title: Security Model
---

LiquidJS provides DoS-oriented limits (`parseLimit`, `templateLimit`, `outputLengthLimit`, `maxDepth`) to reduce risk. This page summarizes those limits, [`ownPropertyOnly`][ownPropertyOnly], custom [`Drop`][drop] usage, and the security boundary to assume in production.

## At a glance

LiquidJS ships a thin cooperative DoS layer:

- [parseLimit][parseLimit]: limit total template size per `parse()` call.
- [templateLimit][templateLimit]: limit total tag/HTML/output nodes rendered per `render()` call.
- [outputLengthLimit][outputLengthLimit]: limit total output length per `render()` call.
- [maxDepth][maxDepth]: limit nesting depth of `{% render %}`, `{% include %}`, and `{% layout %}`.
- Strftime numeric pad widths in the `date` filter are capped at `1_000_000` (1M) per conversion.

These are cooperative safeguards, not runtime isolation—see [Production guidance](#production-guidance) below for host-level limits and online-service hardening.

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

[maxDepth][maxDepth] limits how deeply `{% render %}`, `{% include %}`, and `{% layout %}` can nest. Defaults to `128`. In sync rendering (`renderSync`), nested tags are driven by `toValueSync`, which recursively resumes each yielded generator on the call stack—deep nesting can overflow it, and `maxDepth` caps that depth. Async `render()` resumes the same tag generators via `toPromise`/`yield` without a deep synchronous call chain, so stack overflow is not a concern there (the limit still applies as a DoS guard).

The `memoryLimit` option was removed in v11; enforce memory limits at the host or process level instead.

## `ownPropertyOnly` and scope data

[`ownPropertyOnly`][ownPropertyOnly] controls **template property reads on plain scope objects** (objects whose prototype is `null` or `Object.prototype`). Default `true`. When enabled, only own enumerable properties are visible to variable lookup; inherited keys from `Object.prototype` or other prototypes are hidden.

**Always blocked** (regardless of `ownPropertyOnly`): template access to the property names `__proto__`, `constructor`, and `prototype`, and writes to those names via `{% assign %}`, `{% capture %}`, `{% increment %}`, and `{% decrement %}`. Managed scopes built with null prototypes (loop locals, `{% render %}` bindings, filter iteration scopes) omit those keys when created from user data.

**Exceptions** — `ownPropertyOnly` does not restrict:

- [`Drop`][drop] values: prototype chain and [`liquidMethodMissing`][liquidMethodMissing] still apply; audit custom drops like privileged code.
- Iteration (`{% for %}`, `{% tablerow %}`, `{% render for %}`): class instances and drops keep their iterators; plain objects only iterate via an own `Symbol.iterator`.
- Liquid pseudo-properties `.size`, `.first`, and `.last`: arrays and strings use length/index rules; `Map`/`Set` use their native size; plain objects with an own `size` property use that value (inherited `size` on plain objects is ignored when `ownPropertyOnly` is `true`).
- Filters and custom tags: operate on resolved values with their own semantics.

Use `true` for untrusted or polluted objects; add [`strictVariables`][strictVariables] if missing paths should error. Override per render via [`RenderOptions`][renderOwnPropertyOnly]. For deeply untrusted input, pre-sanitize scope objects before `render()` (for example with [@hapi/bourne](https://www.npmjs.com/package/@hapi/bourne)). This is a read policy for scope data—not a sandbox for filters, tags, or your code.

## Custom `Drop` classes

[`Drop`][drop] values are not restricted the same way: LiquidJS still reads the prototype chain and may call [`liquidMethodMissing`][liquidMethodMissing]. **You** control what a drop exposes; narrow APIs and never feed unsafe data into drops unless the class is built for template access. `ownPropertyOnly` alone does not harden custom drops—audit them like any privileged code.

## Production guidance

LiquidJS does not sandbox template code—custom filters, tags, and scope helpers run as ordinary JavaScript with your process privileges. Built-in DoS limits are one layer; production deployments, especially online services that accept template input, need additional hardening:

- **Prefer curated templates** over fully user-defined Liquid when possible; if users need customization, offer a restricted subset rather than open template editing.
- Run each render in a **worker thread or child process** with a wall-clock timeout; **kill** the worker on expiry. Libraries such as [paralleljs][paralleljs] can help for heavy single-template work.
- Enforce **container/Kubernetes cgroup limits**, `ulimit`, or equivalent on the renderer process for memory and CPU.
- Apply **request rate limits** at the API or gateway layer.
- **`node:vm`, `isolated-vm`, and Jinja/Twig-style sandbox modes are not a security boundary**—template logic runs in the same JS runtime as your app, with your privileges.

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
