---
title: 引用和继承
---

## 引用模板片段

对于如下两个模板文件：

```
// 文件：color.liquid
color: '{{ color }}' shape: '{{ shape }}'

// 文件：theme.liquid
{% assign shape = 'circle' %}
{% include 'color' %}
{% include 'color' with 'red' %}
{% include 'color', color: 'yellow', shape: 'square' %}
```

输出为：

```
color: '' shape: 'circle'
color: 'red' shape: 'circle'
color: 'yellow' shape: 'square'
```

{% note tip &quot;.liquid&quot; 文件扩展名 %}
如果设置了 `extname: ".liquid"` 选项，就可以省略 <code>layout</code>, <code>render</code> 和 <code>include</code> 里面文件名的 ".liquid" 后缀。详情请参考 <a href="./options.html#extname">extname 选项</a>。
{% endnote %}

## 布局模板（模板继承）

对于如下两个模板文件：

```
// 文件：default-layout.liquid
Header
{% block content %}My default content{% endblock %}
Footer

// 文件：page.liquid
{% layout "default-layout" %}
{% block content %}My page content{% endblock %}
```

渲染 `page.liquid` 将会输出：

```
Header
My page content
Footer
```

{% note tip Block %}
<ul>
    <li>布局文件（父模板）中可以定义多个 block；</li>
    <li>只有一个 block 时，block 名字可以省略。</li>
</ul>
{% endnote %}
