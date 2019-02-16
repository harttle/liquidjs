import { mapSeries } from 'src/util/promise'
import { isString, isObject, isArray } from 'src/util/underscore'
import { evalExp } from 'src/render/syntax'
import assert from 'src/util/assert'
import { identifier, value, hash } from 'src/parser/lexical'
import { RenderBreakError } from 'src/util/error'

const re = new RegExp(`^(${identifier.source})\\s+in\\s+` +
  `(${value.source})` +
  `(?:\\s+${hash.source})*` +
  `(?:\\s+(reversed))?` +
  `(?:\\s+${hash.source})*$`)

function parse (tagToken, remainTokens) {
  const match = re.exec(tagToken.args)
  assert(match, `illegal tag: ${tagToken.raw}`)
  this.variable = match[1]
  this.collection = match[2]
  this.reversed = !!match[3]

  this.templates = []
  this.elseTemplates = []

  let p
  const stream = this.liquid.parser.parseStream(remainTokens)
    .on('start', () => (p = this.templates))
    .on('tag:else', () => (p = this.elseTemplates))
    .on('tag:endfor', () => stream.stop())
    .on('template', tpl => p.push(tpl))
    .on('end', () => {
      throw new Error(`tag ${tagToken.raw} not closed`)
    })

  stream.start()
}

async function render (scope, hash) {
  let collection = evalExp(this.collection, scope)

  if (!isArray(collection)) {
    if (isString(collection) && collection.length > 0) {
      collection = [collection]
    } else if (isObject(collection)) {
      collection = Object.keys(collection).map((key) => [key, collection[key]])
    }
  }
  if (!isArray(collection) || !collection.length) {
    return this.liquid.renderer.renderTemplates(this.elseTemplates, scope)
  }

  const offset = hash.offset || 0
  const limit = (hash.limit === undefined) ? collection.length : hash.limit

  collection = collection.slice(offset, offset + limit)
  if (this.reversed) collection.reverse()

  const contexts = collection.map((item, i) => {
    const ctx = {}
    ctx[this.variable] = item
    ctx['forloop'] = {
      first: i === 0,
      index: i + 1,
      index0: i,
      last: i === collection.length - 1,
      length: collection.length,
      rindex: collection.length - i,
      rindex0: collection.length - i - 1
    }
    return ctx
  })

  let html = ''
  let finished = false
  await mapSeries(contexts, async context => {
    if (finished) return

    scope.push(context)
    try {
      html += await this.liquid.renderer.renderTemplates(this.templates, scope)
    } catch (e) {
      if (e instanceof RenderBreakError) {
        html += e.resolvedHTML
        if (e.message === 'break') {
          finished = true
        }
      } else throw e
    }
    scope.pop(context)
  })
  return html
}

export default { parse, render }
