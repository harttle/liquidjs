import { assert, Tokenizer, evalToken, Emitter, TagToken, TopLevelToken, Context, Template, TagImplOptions, ParseStream } from '../../types'
import { toEnumerable } from '../../util/collection'
import { ForloopDrop } from '../../drop/forloop-drop'
import { Hash } from '../../template/tag/hash'

const MODIFIERS = ['offset', 'limit', 'reversed']

type valueof<T> = T[keyof T]

export default {
  type: 'block',
  parse: function (token: TagToken, remainTokens: TopLevelToken[]) {
    const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie)

    const variable = tokenizer.readIdentifier()
    const inStr = tokenizer.readIdentifier()
    const collection = tokenizer.readValue()
    assert(
      variable.size() && inStr.content === 'in' && collection,
      () => `illegal tag: ${token.getText()}`
    )

    this.variable = variable.content
    this.collection = collection
    this.hash = new Hash(tokenizer.remaining())
    this.templates = []
    this.elseTemplates = []

    let p
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => (p = this.templates))
      .on('tag:else', () => (p = this.elseTemplates))
      .on('tag:endfor', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${token.getText()} not closed`)
      })

    stream.start()
  },
  render: function * (ctx: Context, emitter: Emitter) {
    const r = this.liquid.renderer
    let collection = toEnumerable(yield evalToken(this.collection, ctx))

    if (!collection.length) {
      yield r.renderTemplates(this.elseTemplates, ctx, emitter)
      return
    }

    const hash = yield this.hash.render(ctx)
    const modifiers = this.liquid.options.orderedFilterParameters
      ? Object.keys(hash).filter(x => MODIFIERS.includes(x))
      : MODIFIERS.filter(x => hash[x] !== undefined)

    collection = modifiers.reduce((collection, modifier: valueof<typeof MODIFIERS>) => {
      if (modifier === 'offset') return offset(collection, hash['offset'])
      if (modifier === 'limit') return limit(collection, hash['limit'])
      return reversed(collection)
    }, collection)

    const scope = { forloop: new ForloopDrop(collection.length) }
    ctx.push(scope)
    for (const item of collection) {
      scope[this.variable] = item
      yield r.renderTemplates(this.templates, ctx, emitter)
      if (emitter['break']) {
        emitter['break'] = false
        break
      }
      emitter['continue'] = false
      scope.forloop.next()
    }
    ctx.pop()
  }
} as TagImplOptions

function reversed<T> (arr: Array<T>) {
  return [...arr].reverse()
}

function offset<T> (arr: Array<T>, count: number) {
  return arr.slice(count)
}

function limit<T> (arr: Array<T>, count: number) {
  return arr.slice(0, count)
}
