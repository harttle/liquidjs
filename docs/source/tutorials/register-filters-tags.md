---
title: Register Filters/Tags
---

## Register Tags

```typescript
// Usage: {% upper name %}
import { Value, TagToken, Context, Emitter, TopLevelToken } from 'liquidjs'

engine.registerTag('upper', {
    parse: function(tagToken: TagToken, remainTokens: TopLevelToken[]) {
        this.value = new Value(token.args, liquid)
    },
    render: function*(ctx: Context) {
        const str = yield this.value.value(ctx); // 'alice'
        return str.toUpperCase() // 'ALICE'
    }
});
```

* `parse`: Read tokens from `remainTokens` until your end token.
* `render`: Combine scope data with your parsed tokens into HTML string.

For complex tag implementation, you can also provide a tag class:

```typescript
// Usage: {% upper name:"alice" %}
import { Hash, Tag, TagToken, Context, Emitter, TopLevelToken, Liquid } from 'liquidjs'

engine.registerTag('upper', class UpperTag extends Tag {
    private hash: Hash
    constructor(tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
        super(tagToken, remainTokens, liquid)
        this.hash = new Hash(tagToken.args)
    }
    * render(ctx: Context) {
        const hash = yield this.hash.render();
        return hash.name.toUpperCase() // 'ALICE'
    }
});
```

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