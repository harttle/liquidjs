---
title: 渲染文件
---

一个典型的项目会有一个目录下都是模板，最方便的方式就是设置 LiquidJS 的 [root][root] 然后调用 [.renderFile()][renderFile] 或 [.renderFileSync()][renderFileSync] 来渲染其中的一个模板文件。

## 渲染一个文件

例如你有如下的目录结构：

```
.
├── index.js
└── views/
  ├── hello.liquid
  └── world.liquid
```

其中 `hello.liquid` 内容为：

```liquid
name: {{name}}
```

在 `index.js` 中可以这样渲染 `hello.liquid`:

```javascript
var engine = new Liquid({
    root: path.resolve(__dirname, 'views/'), // 设置模板查找目录
    extname: '.liquid' // 添加后缀，默认为 "" 表示不添加后缀
});
// 将会读取并渲染 `views/hello.liquid`
engine.renderFile("hello", {name: 'alice'}).then(console.log)
```

执行 `node index.js` 你将会得到类似这样的输出：

```
name: alice
```

## 模板查找

传递给 [.renderFile()][renderFile], [.parseFile()][parseFile] [.renderFileSync()][renderFileSync], [.parseFileSync()][parseFileSync] 这些 API 的模板名，
以及传递给 [include][include], [layout][layout] 这些标签的模板名，将会根据 [root][root] 选项来查找。

`root` 可以设置为 `string` 类型的路径（见上面的例子）， 也可以设置为一个字符串数组表示路径列表，这时 LiquidJS 将会按顺序去查找。例如：

```javascript
var engine = new Liquid({
    root: ['views/', 'views/partials/'],
    extname: '.liquid'
});
```

{% note tip 相对路径 %}<code>root</code> 中使用相对路径将会被解释为相对于 <code>cwd()</code>（当前工作目录）。{% endnote %}

当模板中引入子模板时（`{% raw %}{% render "foo" %}{% endraw %}`），或者调用 `.renderFile('foo')` 时，LiquidJS 会依次查看如下几个文件，并渲染第一个存在的文件：

- `cwd()`/views/foo.liquid
- `cwd()`/views/partials/foo.liquid

如果上述文件都不存在，将会抛出一个 `ENOENT` 错误。

{% note info 示例 %} 在 Node.js 示例中展示了怎么渲染一个文件 <a href="https://github.com/harttle/liquidjs/blob/master/demo/nodejs/" target="_blank">liquidjs/demo/nodejs/</a>。{% endnote %}

在浏览器中使用 LiquidJS 时，比如当前路径为 <https://example.com/bar/index.html>，只会去 `root` 数组中的第一个路径下获取，也就是这个文件：

- <https://example.com/bar/foo.liquid>

如果获取失败（比如得到一个 404/500 错误）或网络错误，将会抛出一个 `ENOENT` 错误。

{% note info 示例 %} 在这个示例中展示了如何从网络获取并渲染一个模板文件 <a href="https://github.com/harttle/liquidjs/blob/master/demo/browser/" target="_blank">liquidjs/demo/browser/</a>。{% endnote %}

## 文件系统接口

LiquidJS 定义了一个文件系统接口（[src/fs/ifs.ts][ifs]），在 Node.js 下的默认实现是 [src/fs/node.ts][fs-node]，在浏览器打包文件中的默认实现是 [src/fs/browser.ts][fs-browser]。
你可以通过创建 `Liquid` 时的 [fs][fs] 参数来指定一个自定义实现来指定如何读取模板文件。比如从数据库里读取：

```javascript
const engine = new Liquid({
    fs: {
        readFileSync (file) {
            return db.model('Template').findByIdSync(file).text
        },
        await readFile (file) {
            const template = await db.model('Template').findById(file)
            return template.text
        },
        existsSync () {
            return true
        },
        await exists () {
            return true
        },
        resolve(root, file, ext) {
            return file
        }
    }
});
```

[fs]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-fs
[ifs]: https://github.com/harttle/liquidjs/blob/master/src/fs/ifs.ts
[fs-node]: https://github.com/harttle/liquidjs/blob/master/src/fs/node.ts
[fs-browser]: https://github.com/harttle/liquidjs/blob/master/src/fs/browser.ts
[layout]: https://help.shopify.com/en/themes/liquid/tags/theme-tags#layout
[include]: https://help.shopify.com/themes/liquid/tags/theme-tags#include
[renderFile]: ../../api/classes/liquid_.liquid.html#renderFile
[renderFileSync]: ../../api/classes/liquid_.liquid.html#renderFilesync
[parseFile]: ../../api/classes/liquid_.liquid.html#parseFile
[parseFileSync]: ../../api/classes/liquid_.liquid.html#parseFileSync
[root]: ../../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
