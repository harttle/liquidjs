---
title: 插件
---

一组标签和过滤器可以封装为一个 **插件**，通常发包到 NPM 来方便使用。本文介绍如何创建和使用插件。

## 编写插件

LiquidJS 插件就是一个简单的函数，它的第一个参数是 [Liquid 类][liquid]，其中的 `this` 是它被注册到的 Liquid 实例。可以通过 `this` 来调用 Liquid API，比如 [注册标签和过滤器][register]。

现在我们来写一个插件并在其中注册一个过滤器，来把输入字符串转换为大写：

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

把上述代码保存为 `upup.js`。

## 使用插件

把插件传递给 `.plugin()` 方法即可注册插件，例如：

```javascript
const engine = new Liquid()

engine.plugin(require('./upup.js'));
engine.parseAndRender('{{ "foo" | upup }}').then(console.log)
```

上述代码将会输出 `"FOO"`。

## 插件列表

由于本仓库只包含 [Shopify/liquid](https://github.com/Shopify/liquid/) 核心仓库的标签和插件（参考 <https://github.com/harttle/liquidjs#differences-and-limitations>），Shopify 平台上特有的插件只能通过插件来使用。

这里是一个插件列表，欢迎添加你的插件（点击右上角编辑按钮）：

* Sections 标签（开发中）： https://github.com/harttle/liquidjs-section-tags
* 颜色过滤器： https://github.com/harttle/liquidjs-color-filters

[liquid]: ../../api/classes/liquid_.liquid.html
[register]: ./register-filters-tags.html