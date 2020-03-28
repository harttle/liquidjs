---
title: Register Filters/Tags
---

## Register Tags

```javascript
// Usage: {% upper name %}
engine.registerTag('upper', {
    parse: function(tagToken, remainTokens) {
        this.str = tagToken.args; // name
    },
    render: async function(scope, hash) {
        var str = await this.liquid.evalValue(this.str, scope); // 'alice'
        return str.toUpperCase()  // 'Alice'
    }
});
```

* `parse`: Read tokens from `remainTokens` until your end token.
* `render`: Combine scope data with your parsed tokens into HTML string.

See existing tag implementations here: <https://github.com/harttle/liquidjs/tree/master/src/builtin/tags>

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
