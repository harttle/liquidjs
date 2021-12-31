---
title: Liquid 模板语言
---

LiquidJS 是一个简单的、安全的、兼容 Shopify 的、纯 JavaScript 编写的模板引擎。这个项目的目的是为 JavaScript 社区提供一个 Liquid 模板引擎的实现。Liquid 最初用 Ruby 实现并用于 Github Pages, Jekyll 和 Shopify，参考 [和 Shopify/liquid 的区别][diff]。

LiquidJS 语法相对简单。LiquidJS 中有两种标记：

- **标签**。标签由标签名和参数构成，由 `{%raw%}{%{%endraw%}` 和 `%}` 包裹。
- **输出**。输出由一个值和一组可选的过滤器构成，由 `{%raw%}{{{%endraw%}` 和 `}}` 包裹。

{% note info 在线示例 %}
在进一步了解细节之前，这里有一个在线示例：<https://liquidjs.com/playground.html>。
{% endnote %}

## 输出

**输出** 用于转换和输出变量到 HTMl。下面的模板将会把 `username` 的值插入到 input 的 `value`：

```liquid
<input type="text" name="user" value="{{username}}">
```

*输出* 里的值可以在输出之前经过若干个 **过滤器** 的转换。比如在变量后面追加一个字符串：

```liquid
{{ username | append: ", welcome to LiquidJS!" }}
```

过滤器可以级联，用起来像管道一样：

```liquid
{{ username | append: ", welcome to LiquidJS!" | capitalize }}
```

[这里](../filters/overview.html) 是 LiquidJS 支持的完整的过滤器列表。

## 标签

**标签** 用于控制模板渲染过程，操作模板变量，和其他模板交互等。例如 `assign` 可以用来定义一个模板中可以使用的变量：

```liquid
{% assign foo = "FOO" %}
```

一般标签成对地出现，一个开始标签和一个对应的结束标签，比如：

```liquid
{% if foo == "FOO" %}
    Variable `foo` equals "FOO"
{% else %}
    Variable `foo` not equals "FOO"
{% endif %}
```

[这里](../tags/overview.html) 是 LiquidJS 支持的完整的标签列表。

[shopify/liquid]: https://github.com/Shopify/liquid
[diff]: ./differences.html
