---
title: Liquid Drops
---

LiquidJS also provides a mechanism similar to [Shopify Drops][shopify-drops], allowing template authors to incorporate custom functionality in resolving variable values.

{% note info Drop for JavaScript %}
<em>Drop</em> interface is implemented differently in LiquidJS compared to built-in filters and other template functionalities. Since LiquidJS runs in JavaScript, custom Drops need to be reimplemented in JavaScript anyway. There's no compatibility between JavaScript classes and Ruby classes.
{% endnote %}

## Basic Usage

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
// Outputs: "foo: FOO, bar: BAR"
engine.parseAndRender(template, context).then(html => console.log(html))
```

[Runkit link](https://runkit.com/embed/2is7di4mc7kk)

As shown above, besides reading properties from context scopes, you can also call methods. You only need to create a custom class inherited from `Drop`.

{% note tip Async Methods %}
LiquidJS is fully async-friendly. You can safely return a Promise in your Drop methods or define your methods in Drop as `async`.
{% endnote %}

## liquidMethodMissing

For cases when there isn't a fixed set of properties, you can leverage `liquidMethodMissing` to dynamically resolve the value of a variable name.

```javascript
import { Liquid, Drop } from 'liquidjs'

class SettingsDrop extends Drop {
  liquidMethodMissing(key) {
    return key.toUpperCase()
  }
}

const engine = new Liquid()
// Outputs: "COO"
engine.parseAndRender("{{settings.coo}}", { settings: new SettingsDrop() })
  .then(html => console.log(html))
```

`liquidMethodMissing` supports Promise, meaning you can make async calls within it. A more useful case can be fetching the value dynamically from the database. By using Drops, you can avoid hardcoding each property into the context. For example:

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

Drops can implement a `valueOf()` method, the return value of which can be used to replace itself in the output. For example:

```javascript
import { Liquid, Drop } from 'liquidjs'

class ColorDrop extends Drop {
  valueOf() {
    return 'red'
  }
}

const engine = new Liquid()
const context = { color: new ColorDrop() }
// Outputs: "red"
engine.parseAndRender("{{color}}", context).then(html => console.log(html))
```

## toLiquid

`toLiquid()` is not a method of `Drop`, but it can be used to return a `Drop`. In cases where you have a fixed structure in the `context` that cannot change its values, you can implement `toLiquid()` to let LiquidJS use the returned value instead of itself to render the templates.

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
      // use a different `name`
      name: "Yang, Jun"
    })
  }
}

const engine = new Liquid()
// Outputs: "Yang, Jun"
engine.parseAndRender("{{person.name}}", context).then(html => console.log(html))
```

Of course, you can also return a `PersonDrop` instance in the `toLiquid()` method and implement this functionality within `PersonDrop`:

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
// Outputs: "Yang, Jun"
engine.parseAndRender("{{person.name}}", context).then(html => console.log(html))
```

{% note info <code>toLiquid()</code> vs. <code>valueOf()</code> Difference %}
<ul>
  <li><code>valueOf()</code> is typically used to define how the current variable should be rendered, while <code>toLiquid()</code> is often used to convert an object into a Drop or another scope provided to the template.</li>
  <li><code>valueOf()</code> is a method exclusive to Drops; whereas <code>toLiquid()</code> can be used on any scope object.</li>
  <li><code>valueOf()</code> is called when the variable itself is about to be rendered, replacing itself; whereas <code>toLiquid()</code> is called when its properties are about to be read.</li>
</ul>
{% endnote %}

## Special Drops

LiquidJS itself implements several built-in drops to facilitate template writing. This part is compatible with Shopify Liquid, as we need templates to be portable.

### blank

Useful to check whether a string variable is `false`, `null`, `undefined`, an empty string, or a string containing only blank characters.

```liquid
{% unless author == blank %}
    {{author}}
{% endif %}
```

### empty

Useful to check if an array, string, or object is empty.

```liquid
{% if authors == empty %}
    Author list is empty
{% endif %}
```

{% note info <code>empty</code> implementation %}
For arrays and strings, LiquidJS checks their `.length` property. For objects, LiquidJS calls `Object.keys()` to check whether they have keys.
{% endnote %}

### nil

`nil` Drop is used to check whether a variable is not defined or defined as `null` or `undefined`, essentially equivalent to JavaScript `== null` check.

```liquid
{% if nonexistent == nil %}
    null variable
{% endif %}
```

### Other Drops

There are still several Drops for specific tags, like `forloop`, `tablerowloop`, `block`, which are covered by respective tag documents.

[shopify-drops]: https://github.com/Shopify/liquid/wiki/Introduction-to-Drops
