---
title: Use in Express.js
---

LiquidJS is compatible to the [express template engines](https://expressjs.com/en/resources/template-engines.html). You can set liquidjs instance to the [view engine][express-views] option:

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid();

// register liquid engine
app.engine('liquid', engine.express()); 
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set liquid to default
```

{% note info Working Demo %} Here's a working demo for LiquidJS usage in Express.js: <a href="https://github.com/harttle/liquidjs/blob/master/demo/express/" target="_blank">liquidjs/demo/express/</a>.{% endnote %}

## Template Lookup

The [root][root] option will continue to work as templates root, as you can see in [Render A Template File][render-a-file]. Additionally, the [`views`][express-views] option in express.js (as shown above) will also be respected. Say you have a template directory like:

```
.
├── views1/
│ └── hello.liquid
└── views2/
  └── world.liquid
```

And you're setting template root for liquidjs to `views1` and expressjs to `views2`:

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid({
    root: './views1/'
});

app.engine('liquid', engine.express()); 
app.set('views', './views2');            // specify the views directory
app.set('view engine', 'liquid');       // set liquid to default
```

Both of `hello.liquid` and `world.liquid` can be resolved and rendered:

```javascript
res.render('hello')
res.render('world')
```

## Caching

Simply setting the [cache option][cache] to true will enable template caching, as explained in [Caching][Caching]. It's recommended to enable cache in production environment, which can be done by:

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid({
    cache: process.env.NODE_ENV === 'production'
});
```

[cache]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-cache
[express-views]: http://expressjs.com/en/guide/using-template-engines.html
[parseFile]: ../api/classes/liquid_.liquid.html#parseFile
[parseFileSync]: ../api/classes/liquid_.liquid.html#parseFileSync
[layout]: https://help.shopify.com/en/themes/liquid/tags/theme-tags#layout
[include]: https://help.shopify.com/themes/liquid/tags/theme-tags#include
[root]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
[render-a-file]: ./render-a-file.html
[Caching]: ./caching.html
