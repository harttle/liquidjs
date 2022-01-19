---
title: For
---

{% since %}v1.9.1{% endsince %}

重复执行代码块的迭代标签。

## 基本使用

### for...in

重复执行一段代码。

输入
```liquid
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}
```

输出
```text
hat shirt pants
```

### else

指定 `for` 循环的集合长度为零时执行的代码块。

输入
```liquid
{% for product in collection.products %}
  {{ product.title }}
{% else %}
  The collection is empty.
{% endfor %}
```

输出
```text
The collection is empty.
```

### break

遇到 `break` 标签时 `for` 循环停止执行。

输入
```liquid
{% for i in (1..5) %}
  {%- if i == 4 -%}
    {% break %}
  {%- else -%}
    {{ i }}
  {%- endif -%}
{% endfor %}
```

输出
```text
123
```

### continue

遇到 `continue` 标签时跳过当前这次迭代。

输入
```liquid
{% for i in (1..5) %}
  {%- if i == 4 -%}
    {%- continue -%}
  {%- else -%}
    {{ i }}
  {%- endif -%}
{% endfor %}
```

输出
```text
1235
```

### forloop

在 `for` 循环里有一个 `forloop` 变量可用，用来表示迭代的当前状态。

`forloop.first`, `forloop.last` 和 `forloop.length` 属性：

输入
```
{% for i in (1..5) %}
  {%- if forloop.first == true -%} First
  {%- elsif forloop.last == true -%} Last
  {%- else -%} {{ forloop.length }}
  {%- endif %}
{% endfor -%}
```

输出
```
First
5
5
5
Last
```

`forloop.index`, `forloop.index0`, `forloop.rindex` 和 `forloop.rindex0` 属性：

输入
```
index index0 rindex rindex0
{% for i in (1..5) %}
  {{- forloop.index }}     {{ forloop.index0 }}      {{ forloop.rindex }}      {{ forloop.rindex0 }}
{% endfor -%}
```

输出
```
index index0 rindex rindex0
1     0      5      4
2     1      4      3
3     2      3      2
4     3      2      1
5     4      1      0
```

## 参数

### limit

限制循环执行的次数。

输入
```liquid
<!-- if array = [1,2,3,4,5,6] -->
{% for item in array limit:2 %}
  {{- item -}}
{% endfor %}
```

输出
```text
12
```

### offset

从指定的下标处开始循环。

输入
```liquid
<!-- for array = [1,2,3,4,5,6] -->
{% for item in array offset:2 %}
  {{- item -}}
{% endfor %}
```

输出
```text
3456
```

#### offset:continue

{% since %}v9.33.0{% endsince %}

`offset` 的值可以是 `continue`，用来继续上一次循环。例如：

输入
```liquid
<!-- for array = [1,2,3,4,5,6] -->
{% for item in array limit:2 %}
  {{- item -}}
{% endfor%}
{% for item in array offset:continue %}
  {{- item -}}
{% endfor%}
```

输出
```text
12
3456
```

对同样的变量名和集合名（这个例子中是 `"item-array"`），存在唯一的位置记录。也就是说用新的变量名就可以开启一个新的循环：

输入
```liquid
<!-- for array = [1,2,3,4,5,6] -->
{% for item in array limit:2 %}
  {{- item -}}
{% endfor%}
{% for item2 in array offset:continue %}
  {{- item2 -}}
{% endfor%}
```

输出
```text
12
123456
```

### range

定义一个用于循环的数字范围。可以用字面量定义范围，也可以用变量定义范围。

输入
```liquid
{% for i in (3..5) %}
  {{ i }}
{% endfor %}

{% assign num = 4 %}
{% for i in (1..num) %}
  {{ i }}
{% endfor %}
```

输出
```text
3 4 5
1 2 3 4
```

### reversed

反转循环的顺序。注意这个参数的拼写和过滤器 `reverse` 不同。

输入
```liquid
<!-- if array = [1,2,3,4,5,6] -->
{% for item in array reversed %}
  {{ item }}
{% endfor %}
```

输出
```text
6 5 4 3 2 1
```
