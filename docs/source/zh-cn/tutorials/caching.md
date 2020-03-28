---
title: 缓存
---

在典型的网站项目中，同一个模板文件可能会反复地用不同数据去渲染。在生产环境下模板文件的内容不太会发生变化（除非重新部署了服务），因此可以把从磁盘读取的文件内容和解析得到的模板结构（AST）缓存下来重复使用来节省渲染时间。

LiquidJS 在这一方面比较灵活，提供了多种不同的方式来达到提升性能的目的。

## 手动缓存

[.parse()][parse], [.parseFile()][parseFile], [.parseFileSync()][parseFileSync] API 可以用来把字符串或文件解析成模板。得到的模板可以用不同的数据去重复地渲染得到不同的 HTML。

从字符串解析：

```javascript
var tpl = engine.parse('{{name | capitalize}}');

engine.renderSync(tpl, {name: 'alice'}) // 'Alice'
engine.renderSync(tpl, {name: 'bob'}) // 'Bob'
```

从文件解析：

```javascript
var tpl = engine.parseFileSync('hello');    // contents of `hello.liquid`: {{name}}

engine.renderSync(tpl, {name: 'alice'}) // 'Alice'
engine.renderSync(tpl, {name: 'bob'}) // 'Bob'
```

上述代码中字符串或文件只被解析了一次，可以反复利用去渲染不同的数据。有很多模板文件时可以把 `tpl` 变量存在 `Map` 中，后续再 `.render()` 时直接从 Map 中拿出解析好的模板去渲染。

## `cache` 选项

如果你只用 `.renderFile()` 和 `.renderFileSync()` 也可以直接设置 [cache][cache] 选项，LiquidJS 会帮你缓存。

```javascript
var { Liquid } = require('liquidjs');
var engine = new Liquid({
    cache: true
});

// LiquidJS 将会解析 hello.liquid 然后用 {name: 'alice'} 渲染它
engine.renderFileSync('hello', {name: 'alice'})

// LiquidJS 会找到上次 hello.liquid 解析的结果模板，再用 {name: 'bob'} 渲染它
engine.renderFileSync('hello', {name: 'bob'})
```

[parse]: ../../api/classes/liquid_.liquid.html#parse
[parseFile]: ../../api/classes/liquid_.liquid.html#parseFile
[parseFileSync]: ../../api/classes/liquid_.liquid.html#parseFileSync
[renderFile]: ../../api/classes/liquid_.liquid.html#renderFile
[renderFileSync]: ../../api/classes/liquid_.liquid.html#renderFilesync
