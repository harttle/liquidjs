---
title: 注册标签和过滤器
---

## 注册标签

```javascript
// 使用方式: {% upper name %}
engine.registerTag('upper', {
    parse: function(tagToken, remainTokens) {
        this.value = new Value(token.args, liquid)
    },
    render: function*(scope, hash) {
        const str = yield this.value.value(ctx); // 'alice'
        return str.toUpperCase()  // 'Alice'
    }
});
```

* `parse`: 从 `remainTokens` 中读取后续的标签/输出/HTML，直到找到你期望的结束标签。
* `render`: 把 scope 数据和此前解析得到的 Token 结合，输出 HTML 字符串。

对于更复杂的标签实现，可以提供一个继承自 `Tag` 的类：

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

可以参考已有的标签实现：<https://github.com/harttle/liquidjs/tree/master/src/tags>

## 注册过滤器

```javascript
// 使用方式: {{ name | upper }}
engine.registerFilter('upper', v => v.toUpperCase())
```

过滤器的参数将会传递给上面注册的过滤器函数，从第二个参数开始（第一个参数是过滤器左侧的输入），例如：

```javascript
// Usage: {{ 1 | add: 2, 3 }}
engine.registerFilter('add', (initial, arg1, arg2) => initial + arg1 + arg2)
```

查看已有的过滤器实现：<https://github.com/harttle/liquidjs/tree/master/src/filters>。对于复杂的标签，也可以用一个类来实现：

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

## 反注册标签/过滤器

有时可能需要禁用一些标签/过滤器（比如 [#324](https://github.com/harttle/liquidjs/issues/324)），注册一个假的标签/过滤器并在里面抛出相应的错误即可。

```javascript
// 禁用标签
const disabledTag = {
    parse: function(token) {
        throw new Error(`tag "${token.name}" disabled`);
    }
}
engine.registerTag('include', disabledTag);

// 禁用过滤器
function disabledFilter(name) {
    return function () {
        throw new Error(`filter "${name}" disabled`);
    }
}
engine.registerFilter('plus', disabledFilter('plus'));
```
