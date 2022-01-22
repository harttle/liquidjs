---
title: 过滤器里访问上下文
---

在 [注册过滤器和标签][register-filters] 里介绍过，可以在函数参数里直接获得过滤器的参数：

```javascript
// Usage: {{ 1 | add: 2, 3 }}
// Output: 6
engine.registerFilter('add', (initial, arg1, arg2) => initial + arg1 + arg2)
```

但有些过滤器还需要访问当前上下文的变量，比如把 URL 路径转换为完整的 URL 时，需要访问上下文的 `origin` 变量：

```javascript
// Usage: {{ '/index.html' | fullURL }}
// Scope: { origin: "https://liquidjs.com" }
// Output: https://liquidjs.com/index.html

engine.registerFilter('fullURL', function (path) {
    const origin = this.context.get(['origin'])
    return new URL(path, origin).toString() 
})
```

见这个 JSFiddle：<http://jsfiddle.net/ctj364up/1/>。

{% note warn 箭头函数 %}
在箭头函数里 `this` 会绑定到当前 JavaScript 上下文，你需要用 `function(){}` 来替代 `()=>{}` 语法，才能正确地访问 `this.context`。
{% endnote %}

[register-filters]: /tutorials/register-filters-tags.html
