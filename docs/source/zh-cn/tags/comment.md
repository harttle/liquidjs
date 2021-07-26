---
title: Comment
---

{% since %}v1.9.1{% endsince %}

让 Liquid 模板里一段代码不渲染。处于 `comment` 开闭标签之间的文本都不会输出，Liquid 代码都不会执行。

输入
```liquid
Anything you put between {% comment %} and {% endcomment %} tags
is turned into a comment.
```

输出
```liquid
Anything you put between  tags
is turned into a comment.
```
