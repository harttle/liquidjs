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
    root: ['views/', 'views/partials/'],
    extname: '.liquid'
});
```

{% note tip Relative Paths %}Relative paths in <code>root</code> will be resolved against <code>cwd()</code>.{% endnote %}

When `{% raw %}{% render "foo" %}{% endraw %}` is renderd or `liquid.renderFile('foo')` is called, the following files will be looked up and the first existing file will be used:

- `cwd()`/views/foo.liquid
- `cwd()`/views/partials/foo.liquid

If none of the above files exists, an `ENOENT` error will be throwed. Here's a demo for Node.js: [demo/nodejs](https://github.com/harttle/liquidjs/tree/master/demo/nodejs).

When LiquidJS is used in browser, say current location is <https://example.com/bar/index.html>, only the first `root` will be used and the file to be fetched is:

- <https://example.com/bar/foo.liquid>

If fetch fails, a 404/500 error or network failures for example, an `ENOENT` error will be throwed.
Here's a demo for browsers: [demo/browser](https://github.com/harttle/liquidjs/tree/master/demo/browser).

## Abstract File System

LiquidJS defines an abstract file system interface in [src/fs/ifs.ts][ifs] and the default implementation is [src/fs/node.ts][fs-node] for Node.js and [src/fs/browser.ts][fs-browser] for the browser bundle.

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
        exists () {
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

[fs]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-fs
[ifs]: https://github.com/harttle/liquidjs/blob/master/src/fs/ifs.ts
[fs-node]: https://github.com/harttle/liquidjs/blob/master/src/fs/node.ts
[fs-browser]: https://github.com/harttle/liquidjs/blob/master/src/fs/browser.ts
[layout]: https://help.shopify.com/en/themes/liquid/tags/theme-tags#layout
[include]: https://help.shopify.com/themes/liquid/tags/theme-tags#include
[renderFile]: ../api/classes/liquid_.liquid.html#renderFile
[renderFileSync]: ../api/classes/liquid_.liquid.html#renderFilesync
[parseFile]: ../api/classes/liquid_.liquid.html#parseFile
[parseFileSync]: ../api/classes/liquid_.liquid.html#parseFileSync
[root]: ../api/interfaces/liquid_options_.liquidoptions.html#Optional-root
