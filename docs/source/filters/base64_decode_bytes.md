---
title: base64_decode_bytes
---

{% since %}v10.29.0{% endsince %}

Decodes a Base64-formatted string into raw bytes without interpreting the
result as UTF-8 text. It returns a `Buffer` in Node.js and a `Uint8Array` in
browsers.

Use `evalValue()` or `evalValueSync()` to preserve the binary return value.
Rendering the result directly into a template converts it to text.

```javascript
const bytes = engine.evalValueSync(
  '"iVBORw0KGgr//g==" | base64_decode_bytes'
)
```

This filter is useful for binary content such as images and PDFs. For textual
content, use [`base64_decode`](./base64_decode.html) instead.
