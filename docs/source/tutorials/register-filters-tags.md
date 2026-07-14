---
title: Register Filters/Tags
---

## Register Tags

```typescript
// Usage: {% upper name %}
import { Value, Tag, TagToken, Context, TopLevelToken, Liquid } from 'liquidjs'

engine.registerTag('upper', class UpperTag extends Tag {
    private value: Value
    constructor(tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
        super(tagToken, remainTokens, liquid)
        this.value = new Value(tagToken.args, liquid)
    }
    * render(ctx: Context) {
        const str = yield this.value.value(ctx) // 'alice'
        return str.toUpperCase() // 'ALICE'
    }
});
```

* `constructor`: Parse tag arguments and read tokens from `remainTokens` until your end token. `liquid` is passed as the third argument.
* `render`: Return an HTML string (or `return yield` a value) for simple tags that produce one value; use `emitter.write()` when writing incrementally or delegating via `yield this.liquid.renderer.renderTemplates()`, since nested templates write through the shared emitter.

See existing tag implementations here: <https://github.com/harttle/liquidjs/tree/master/src/tags>
See demo example here: https://github.com/harttle/liquidjs/blob/master/demo/typescript/index.ts

## Register Filters

```javascript
// Usage: {{ name | upper }}
engine.registerFilter('upper', v => v.toUpperCase())
```

Filter arguments will be passed to the registered filter function, for example:

```javascript
// Usage: {{ 1 | add: 2, 3 }}
engine.registerFilter('add', (initial, arg1, arg2) => initial + arg1 + arg2)
```

See existing filter implementations here: <https://github.com/harttle/liquidjs/tree/master/src/filters>

## Unregister Tags/Filters

In some cases it's desirable to disable some tags/filters (see [#324](https://github.com/harttle/liquidjs/issues/324)). You'll need to register a dummy tag/filter that throws a corresponding Error.

```typescript
import { Tag } from 'liquidjs'

// disable a tag
engine.registerTag('include', class extends Tag {
    constructor(token, remainTokens, liquid) {
        super(token, remainTokens, liquid)
        throw new Error(`tag "${token.name}" disabled`)
    }
    render() {}
})

// disable a filter
function disabledFilter(name) {
    return function () {
        throw new Error(`filter "${name}" disabled`);
    }
}
engine.registerFilter('plus', disabledFilter('plus'));
```
