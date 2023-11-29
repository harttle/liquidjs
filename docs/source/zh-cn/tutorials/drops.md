---
title: Liquid Drop
---

LiquidJS 还提供了一种类似于 [Shopify Drop][shopify-drops] 的机制，用于为模板作者提供在自定义解析变量值的功能。

{% note info JavaScript 中的 Drop %}
<em>Drop</em> 接口在 LiquidJS 中实现方式与内置过滤器和其他模板功能不同。由于 LiquidJS 在 JavaScript 中运行，自定义 Drop 在 JavaScript 中一定需要重新实现。JavaScript 类与 Ruby 类之间没有兼容性可言。
{% endnote %}

## 基本用法

```javascript
import { Liquid, Drop } from 'liquidjs'

class SettingsDrop extends Drop {
  constructor() {
    super()
    this.foo = 'FOO'
  }
  bar() {
    return 'BAR'
  }
}

const engine = new Liquid()
const template = `foo: {{settings.foo}}, bar: {{settings.bar}}`
const context = { settings: new SettingsDrop() }
// 输出: "foo: FOO, bar: BAR"
engine.parseAndRender(template, context).then(html => console.log(html))
```

[Runkit 链接](https://runkit.com/embed/2is7di4mc7kk)

如上所示，除了从上下文作用域中读取属性外，还可以调用方法。您只需创建一个继承自 `Drop` 的自定义类。

{% note tip 异步方法 %}
LiquidJS 完全支持异步，您可以在 Drop 的方法中安全地返回 Promise，或将 Drop 的方法定义为 `async`。
{% endnote %}

## liquidMethodMissing

如果属性名不能静态地确定的情况下，可以利用 `liquidMethodMissing` 来动态解析变量的值。

```javascript
import { Liquid, Drop } from 'liquidjs'

class SettingsDrop extends Drop {
  liquidMethodMissing(key) {
    return key.toUpperCase()
  }
}

const engine = new Liquid()
// 输出: "COO"
engine.parseAndRender("{{settings.coo}}", { settings: new SettingsDrop() })
  .then(html => console.log(html))
```

`liquidMethodMissing` 支持 Promise，这意味着您可以在其中进行异步调用。一个更有用的例子是通过使用 Drop 动态地从数据库获取值。通过使用 Drop，您可以避免将每个属性都硬编码到上下文中。例如：

```javascript
import { Liquid, Drop } from 'liquidjs'

class DBDrop extends Drop {
  async liquidMethodMissing(key) {
    const record = await db.getRecordByKey(key)
    return record.value
  }
}

const engine = new Liquid()
const context = { db: new DBDrop() }
engine.parseAndRender("{{db.coo}}", context).then(html => console.log(html))
```

## valueOf

Drop 可以实现一个 `valueOf()` 方法，用于在输出中替换自身。例如：

```javascript
import { Liquid, Drop } from 'liquidjs'

class ColorDrop extends Drop {
  valueOf() {
    return 'red'
  }
}

const engine = new Liquid()
const context = { color: new ColorDrop() }
// 输出: "red"
engine.parseAndRender("{{color}}", context).then(html => console.log(html))
```

## toLiquid

`toLiquid()` 不是 `Drop` 的方法，但它可以用于返回一个 `Drop`。在您有一个上下文中固定结构且不能更改其值的情况下，您可以实现 `toLiquid()`，以便让 LiquidJS 使用返回的值而不是自身来渲染模板。

```javascript
import { Liquid, Drop } from 'liquidjs'

const context = {
  person: {
    firstName: "Jun",
    lastName: "Yang",
    name: "Jun Yang",
    toLiquid: () => ({
      firstName: this.firstName,
      lastName: this.lastName,
      // 使用不同的 `name`
      name: "Yang, Jun"
    })
  }
}

const engine = new Liquid()
// 输出: "Yang, Jun"
engine.parseAndRender("{{person.name}}", context).then(html => console.log(html))
```

当然，您还可以在 `toLiquid()` 方法中返回一个 `PersonDrop` 实例，并在 `PersonDrop` 中实现此功能：

```javascript
import { Liquid, Drop } from 'liquidjs'

class PersonDrop extends Drop {
  constructor(person) {
    super()
    this.person = person
  }
  name() {
    return this.person.lastName + ", " + this.person.firstName
  }
}

const context = {
  person: {
    firstName: "Jun",
    lastName: "Yang",
    name: "Jun Yang",
    toLiquid: function () { return new PersonDrop(this) }
  }
}

const engine = new Liquid()
// 输出: "Yang, Jun"
engine.parseAndRender("{{person.name}}", context).then(html => console.log(html))
```

{% note info <code>toLiquid()</code> 和 <code>valueOf()</code> 的区别 %}
<ul>
    <li><code>valueOf()</code> 通常用来定义当前变量如何渲染，<code>toLiquid()</code> 通常用来把一个对象转换为 Drop 或另一个提供给模板的 scope。</li>
    <li><code>valueOf()</code> 是 Drop 才有的方法；而 <code>toLiquid()</code> 可以用在任何 scope 对象上。</li>
    <li><code>valueOf()</code> 是在自己即将被渲染时，用来替代自己；而 <code>toLiquid()</code> 在即将读取它的属性时才会被调用。</li>
</ul>
{% endnote %}

## 特殊 Drop

LiquidJS 本身实现了几个内置 Drop，以促进模板编写。此部分与 Shopify Liquid 兼容，因为我们需要模板具有可移植性。

### blank

用于检查字符串变量是否为 `false`、`null`、`undefined`、空字符串或字符串仅包含空白字符。

```liquid
{% unless author == blank %}
    {{author}}
{% endif %}
```

### empty

用于检查数组、字符串或对象是否为空。

```liquid
{% if authors == empty %}
    作者列表为空
{% endif %}
```

{% note info <code>empty</code> 的实现 %}
对于数组和字符串，LiquidJS 检查它们的 `.length` 属性。对于对象，LiquidJS 调用 `Object.keys()` 来检查它是否有键。
{% endnote %}

### nil

`nil` Drop 用于检查变量是否未定义或定义为 `null` 或 `undefined`，本质上等同于 JavaScript 的 `== null` 检查。

```liquid
{% if notexist == nil %}
    空变量
{% endif %}
```

### 其他 Drop

仍然有一些特定标签的 Drop，例如 `forloop`、`tablerowloop`、`block`，这些在各自的标签文档中有详细介绍。

[shopify-drops]: https://github.com/Shopify/liquid/wiki/Introduction-to-Drops
