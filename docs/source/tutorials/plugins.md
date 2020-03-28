---
title: Plugins
---

A number of tags and filters can be encapsulated into a **plugin**, which will be typically installed via npm. This article provides information about how to create and use a plugin.

## Write a Plugin

A liquidjs plugin is simple function which takes the [Liquid class][liquid] as the first parameter and the Liquid instance for `this`. We can call liquidjs APIs on `this` to make certain changes, especially [register filters and tags][register].

Now we'll make a plugin to upper case every letter of the input, save the following snippet to `upup.js`:

```javascript
/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerFilter('upup', x => x.toUpperCase());
}
```

## Use a Plugin

Simply pass the plugin function into the `.plugin()` method:

```javascript
const engine = new Liquid()

engine.plugin(require('./upup.js'));
engine
    .parseAndRender('{{ "foo" | upup }}')
    .then(console.log)  // outputs "FOO"
```

## Plugin List

Since this library excludes certain features that are available on the Shopify platform but not on the [Shopify/liquid](https://github.com/Shopify/liquid/) repo, see <https://github.com/harttle/liquidjs#differences-and-limitations>.

Here's a list of plugins that backfill those features. Feel free to add yours, this file is publicly editable.

* Sections Tags (WIP): https://github.com/harttle/liquidjs-section-tags
* Color Filters: https://github.com/harttle/liquidjs-color-filters

[liquid]: ../api/classes/liquid_.liquid.html
[register]: /harttle/liquidjs/wiki/Register-Filters-Tags