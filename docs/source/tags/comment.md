---
title: Comment
---

{% since %}v1.9.1{% endsince %}

Allows you to leave un-rendered code inside a Liquid template. Any text within the opening and closing `comment` blocks will not be printed, and any Liquid code within will not be executed.

Input
```liquid
Anything you put between {% comment %} and {% endcomment %} tags
is turned into a comment.
```

Output
```liquid
Anything you put between  tags
is turned into a comment.
```
