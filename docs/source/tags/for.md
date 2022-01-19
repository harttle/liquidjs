---
title: For
---

{% since %}v1.9.1{% endsince %}

Iteration tags run blocks of code repeatedly.

## Basic Usage

### for...in

Repeatedly executes a block of code. For a full list of attributes available within a `for` loop, see [forloop](#forloop).

Input
```liquid
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}
```

Output
```text
hat shirt pants
```

For loops can iterate over arrays, hashes, and [ranges of integers](#range).

When iterating a hash, item[0] contains the key, and item[1] contains the value:

Input
```liquid
{% for item in hash %}
  * {{ item[0] }}: {{ item[1] }}
{% endfor %}
```

Output
```text
  * key1: value1
  * key2: value2
```

### else

Specifies a fallback case for a `for` loop which will run if the loop has zero length.

Input
```liquid
{% for product in collection.products %}
  {{ product.title }}
{% else %}
  The collection is empty.
{% endfor %}
```

Output
```text
The collection is empty.
```

### break

Causes the loop to stop iterating when it encounters the `break` tag.

Input
```liquid
{% for i in (1..5) %}
  {%- if i == 4 -%}
    {% break %}
  {%- else -%}
    {{ i }}
  {%- endif -%}
{% endfor %}
```

Output
```text
123
```

### continue

Causes the loop to skip the current iteration when it encounters the `continue` tag.

Input
```liquid
{% for i in (1..5) %}
  {%- if i == 4 -%}
    {%- continue -%}
  {%- else -%}
    {{ i }}
  {%- endif -%}
{% endfor %}
```

Output
```text
1235
```

### forloop

There's a `forloop` object available inside `for` loops. It's used to indicate the current state of `for` loop.

The `forloop.first`, `forloop.last` and `forloop.length` property:

Input
```liquid
{% for i in (1..5) %}
  {%- if forloop.first == true -%} First
  {%- elsif forloop.last == true -%} Last
  {%- else -%} {{ forloop.length }}
  {%- endif %}
{% endfor -%}
```

Output
```text
First
5
5
5
Last
```

The `forloop.index`, `forloop.index0`, `forloop.rindex` and `forloop.rindex0` property:

Input
```
index index0 rindex rindex0
{% for i in (1..5) %}
  {{- forloop.index }}     {{ forloop.index0 }}      {{ forloop.rindex }}      {{ forloop.rindex0 }}
{% endfor -%}
```

Output
```
index index0 rindex rindex0
1     0      5      4
2     1      4      3
3     2      3      2
4     3      2      1
5     4      1      0
```

## Parameters

### limit

Limits the loop to the specified number of iterations.

Input
```liquid
<!-- for array = [1,2,3,4,5,6] -->
{% for item in array limit:2 %}
  {{- item -}}
{% endfor %}
```

Output
```text
12
```

### offset

Begins the loop at the specified index.

Input
```liquid
<!-- for array = [1,2,3,4,5,6] -->
{% for item in array offset:2 %}
  {{- item -}}
{% endfor %}
```

Output
```text
3456
```

#### offset:continue

{% since %}v9.33.0{% endsince %}

Offset value can be `continue` to continue previous loop. For example:

Input
```liquid
<!-- for array = [1,2,3,4,5,6] -->
{% for item in array limit:2 %}
  {{- item -}}
{% endfor%}
{% for item in array offset:continue %}
  {{- item -}}
{% endfor%}
```

Output
```text
12
3456
```

For the same variable name (`"item"` in this case) and same collection (`"array"` in this case), there's one position record. That means you can start a new loop with a different variable name:

Input
```liquid
<!-- for array = [1,2,3,4,5,6] -->
{% for item in array limit:2 %}
  {{- item -}}
{% endfor%}
{% for item2 in array offset:continue %}
  {{- item2 -}}
{% endfor%}
```

Output
```text
12
123456
```

### range

Defines a range of numbers to loop through. The range can be defined by both literal and variable numbers.

Input
```liquid
{% for i in (3..5) %}
  {{- i -}}
{% endfor-%}

{% assign num = 4 %}
{% for i in (1..num) %}
  {{- i -}}
{% endfor %}
```

Output
```text
345
1234
```

### reversed

Reverses the order of the loop. Note that this flag's spelling is different from the filter `reverse`.

Input
```liquid
<!-- if array = [1,2,3,4,5,6] -->
{% for item in array reversed %}
  {{ item }}
{% endfor %}
```

Output
```text
6 5 4 3 2 1
```

When used with additional parameters, order is important. Leading with `reversed` reverses the order of the loop before executing the other parameters.

Input
```liquid
{% for i in (1..8) reversed limit: 4 %}
  {{ i }}
{% endfor %}
```

Output
```text
8 7 6 5
```

Input
```liquid
{% for i in (1..8) limit: 4 reversed %}
  {{ i }}
{% endfor %}
```

Output
```text
4 3 2 1
```
