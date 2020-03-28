---
title: 标签
---

LiquidJS 支持 Liquid 语法中具体业务无关的标签，包含 [shopify/liquid 核心][shopify/liquid] 里的所有标签。这部分包含了所有 LiquidJS 支持的标签的文档和使用示例。

LiquidJS 支持十几个过滤器，可以分为如下几类：

类别 | 用途 | 标签
--- | --- | ---
迭代 | 遍历一个集合 | for, cycle, tablerow
控制流 | 控制模板渲染的执行分支 | if, unless, elif, else, case, when
变量 | 定义和修改变量 | assign, increment, decrement
文件 | 引入或继承其他模板 | render, include, layout
语言 | 暂时禁用 Liquid 语法 | raw, comment

[shopify/liquid]: https://github.com/Shopify/liquid
