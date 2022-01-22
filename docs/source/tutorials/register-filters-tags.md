---
title: Register Filters/Tags
---

## Register Tags

```typescript
// Usage: {% upper name %}
import { TagToken, Context, Emitter, TopLevelToken } from 'liquidjs'

engine.registerTag('upper', {
    parse: function(tagToken: TagToken, remainTokens: TopLevelToken[]) {
        this.str = tagToken.args; // name
    },
    render: async function(ctx: Context) {
        var str = await this.liquid.evalValue(this.str, ctx); // 'alice'
        return str.toUpperCase() // 'ALICE'
    }
});
```

* `parse`: Read tokens from `remainTokens` until your end token.
* `render`: Combine scope data with your parsed tokens into HTML string.

See existing tag implementations here: <https://github.com/harttle/liquidjs/tree/master/src/builtin/tags>
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

See existing filter implementations here: <https://github.com/harttle/liquidjs/tree/master/src/builtin/filters>

## Unregister Tags/Filters

In some cases it's desirable to disable some tags/filters (see [#324](https://github.com/harttle/liquidjs/issues/324)), you'll need to register a dummy tag/filter in which an corresponding Error throws.

```javascript
// disable a tag
const disabledTag = {
    parse: function(token) {
        throw new Error(`tag "${token.name}" disabled`);
    }
}
engine.registerTag('include', disabledTag);

// disable a filter
function disabledFilter(name) {
    return function () {
        throw new Error(`filter "${name}" disabled`);
    }
}
engine.registerFilter('plus', disabledFilter('plus'));
```