---
title: Access Scope in Filters
---

As covered in [Register Filters/Tags][register-filters], we can access filter arguments directly in filter function like:

```javascript
// Usage: {{ 1 | add: 2, 3 }}
// Output: 6
engine.registerFilter('add', (initial, arg1, arg2) => initial + arg1 + arg2)
```

When it comes to stateful filters, for example transform a URL path to full URL, we'll need to access a `origin` in current scope:

```javascript
// Usage: {{ '/index.html' | fullURL }}
// Scope: { origin: "https://liquidjs.com" }
// Output: https://liquidjs.com/index.html

engine.registerFilter('fullURL', function (path) {
    const origin = this.context.get(['origin'])
    return new URL(path, origin).toString() 
})
```

See this JSFiddle: <http://jsfiddle.net/ctj364up/1/>

{% note warn Arrow Functions %}
<code>this</code> in arrow functions is bound to current JavaScript context, you'll need to use <code>function(){}</code> instead of <code>()=>{}</code> syntax to access <code>this.context</code> correctly.
{% endnote %}

[register-filters]: /tutorials/register-filters-tags.html
