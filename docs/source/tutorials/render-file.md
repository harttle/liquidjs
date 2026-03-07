---
title: Render Files
---

For a typical project there could be a directory of template files, you'll need to set the [template root][root] and call [renderFile][renderFile] or [renderFileSync][renderFileSync] to render a specific file.

## Render a File

For example you have a directory of templates like this:

```
.
├── index.js
└── views/
  ├── hello.liquid
  └── world.liquid
```

`hello.liquid` contains a single line {%raw%}`name: {{name}}`{%endraw%}.
Now save the following contents into `index.js`:

```javascript
var engine = new Liquid({
    root: path.resolve(__dirname, 'views/'),  // root for layouts/includes lookup
    extname: '.liquid'          // used for layouts/includes, defaults ""
});
engine
    .renderFile("hello", {name: 'alice'})   // will read and render `views/hello.liquid`
    .then(console.log)  // outputs "Alice"
```

Run `node index.js` and you'll get output like this:

```
> node index.js
name: alice
```

## Template Lookup

Template files names passed to [renderFile][renderFile], [parseFile][parseFile], [renderFileSync][renderFileSync], [parseFileSync][parseFileSync] APIs,
and [include][include], [layout][layout] tags are resolved against [the root option][root].

It can be a string-typed path (see above example), or a list of root directories, in which case templates will be looked up in that order. e.g.

```javascript
var engine = new Liquid({
    root: ['views/'],
    partials: ['views/partials/'],
    layouts: ['views/layouts/'],
    extname: '.liquid'
});
```

{% note tip Relative Paths %}Relative paths in <code>root</code> will be resolved against <code>cwd()</code>.{% endnote %}

- When `parse()`, `render()` functions are called, for example `liquid.renderFile('foo')`, templates under `root` will be looked up.
- When a partial is requested, for example `{% raw %}{% render "foo" %}{% endraw %}`, templates under `partials` will be looked up.
- When a layout is requested, for example `{% raw %}{% layout "foo" %}{% endraw %}`, templates under `layouts` will be looked up.

When LiquidJS is used in browser, the paths will be resolved based on current location. Here's a demo for browsers: [demo/browser](https://github.com/harttle/liquidjs/tree/master/demo/browser).

## Abstract File System

LiquidJS defines an [abstract file system interface][ifs] and the default implementation is [src/fs/fs-impl.ts][fs-node] for Node.js and [src/build/fs-impl-browser.ts][fs-browser] for the browser bundle.

The `Liquid` constructor provides a [fs][fs] option to specify the file system implementation. It's supposed to be used to define customized template fetching logic, i.e. fetch template from a database table, like:

```javascript
var engine = new Liquid({
    fs: {
        readFileSync (file) {
            return db.model('Template').findByIdSync(file).text
        },
        async readFile (file) {
            const template = await db.model('Template').findById(file)
            return template.text
        },
        existsSync () {
            return true
        },
        async exists () {
            return true
        },
        contains () {
            return true
        },
        resolve(root, file, ext) {
            return file
        }
    }
});
```

{% note warn Path Traversal Vulnerability %}The default value of <code>contains()</code> always returns true. That means when specifying an abstract file system, you'll need to provide a proper <code>contains()</code> to avoid expose such vulnerabilities.{% endnote %}

## In-memory Template

To facilitate rendering w/o files, there's a `templates` option to specify a mapping of filenames and their content. LiquidJS will read templates from the mapping.

```typescript
const engine = new Liquid({
  templates: {
    'views/entry': 'header {% include "../partials/footer" %}',
    'partials/footer': 'footer'
  }
})
engine.renderFileSync('views/entry'))
// Result: 'header footer'
```

Note that file system options like `root`, `layouts`, `partials`, `relativeReference` will be ignored when `templates` is specified.

[fs]: /api/interfaces/LiquidOptions.html#fs
[ifs]: /api/interfaces/FS.html
[fs-node]: https://github.com/harttle/liquidjs/blob/master/src/fs/fs-impl.ts
[fs-browser]: https://github.com/harttle/liquidjs/blob/master/src/fs/fs-impl-browser.ts
[layout]: https://help.shopify.com/en/themes/liquid/tags/theme-tags#layout
[include]: https://help.shopify.com/themes/liquid/tags/theme-tags#include
[renderFile]: /api/classes/Liquid.html#renderFile
[renderFileSync]: /api/classes/Liquid.html#renderFileSync
[parseFile]: /api/classes/Liquid.html#parseFile
[parseFileSync]: /api/classes/Liquid.html#parseFileSync
[root]: /api/interfaces/LiquidOptions.html#root
