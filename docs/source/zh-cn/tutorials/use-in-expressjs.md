---
title: 在 Express.js 里使用
---

LiquidJS 可以用来作为 [Express 的模板引擎](https://expressjs.com/en/resources/template-engines.html)。可以把 Liquid 设置到 [view engine][express-views] 选项上即可：

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid();

// 注册为 liquid 文件的模板引擎
app.engine('liquid', engine.express()); 
app.set('views', './views');            // 指定模板目录
app.set('view engine', 'liquid');       // 把 liquid 文件设为默认模板
```

{% note info 示例 %} 这是一个在 Express.js 中使用 LiquidJS 的例子：<a href="https://github.com/harttle/liquidjs/blob/master/demo/express/" target="_blank">liquidjs/demo/express/</a>.{% endnote %}

## 模板查找

LiquidJS 仍然会去 [root][root] 指定的目录查找（参考 [Render A Template File][render-a-file]），也会去 Express.js 的 [`views`][express-views] 选项指定的目录里（上述例子中是 `./views`）去查找。例如你有这样的目录结构：

```
.
├── views1/
│ └── hello.liquid
└── views2/
  └── world.liquid
```

LiquidJS 的模板 root 设置到了 `views1`，Express.js 的 views 设置到了 `views2`：

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid({
    root: './views1/'
});

app.engine('liquid', engine.express()); 
app.set('views', './views2');
app.set('view engine', 'liquid');
```

`hello.liquid` 和 `world.liquid` 两个文件都可以找到并且成功渲染：

```javascript
res.render('hello')
res.render('world')
```

## 缓存

直接把 [cache 选项][cache] 设为 `true` 即可开启模板缓存，参考 [缓存][Caching] 一文。推荐在生产环境中开启缓存，可以用如下代码：

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid({
    cache: process.env.NODE_ENV === 'production'
});
```

`cache` 还可以是一个数字表示最大缓存的模板数量，也可以是一个自定义的缓存实现，详情请参考 [cache 选项][cache]。

[cache]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-cache
[express-views]: http://expressjs.com/en/guide/using-template-engines.html
[parseFile]: ../../api/classes/liquid_.liquid.html#parseFile
[parseFileSync]: ../../api/classes/liquid_.liquid.html#parseFileSync
[layout]: https://help.shopify.com/en/themes/liquid/tags/theme-tags#layout
[include]: https://help.shopify.com/themes/liquid/tags/theme-tags#include
[root]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
[render-a-file]: ./render-a-file.html
[Caching]: ./caching.html
