## Async Support

harttle/shopify-liquid do NOT support async rendering, this is by design.

The primary principle of harttle/shopify-liquid is EASY TO EXTEND.
Async rendering introduces extra complexity in both implementation and extension.

For template-driven projects, checkout these Liquid-like engines:

* [liquid-node][liquid-node]: <https://github.com/sirlantis/liquid-node> 
* [nunjucks][nunjucks]: <http://mozilla.github.io/nunjucks/>

[nunjucks]: http://mozilla.github.io/nunjucks/
[liquid-node]: https://github.com/sirlantis/liquid-node
