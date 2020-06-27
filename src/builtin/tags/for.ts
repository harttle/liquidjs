import { assert, Tokenizer, evalToken, Emitter, TagToken, TopLevelToken, Context, Template, TagImplOptions, ParseStream } from '../../types'
import { toEnumerable } from '../../util/collection'
import { ForloopDrop } from '../../drop/forloop-drop'
import { Hash } from '../../template/tag/hash'

export default {
  type: 'block',
  parse: function (token: TagToken, remainTokens: TopLevelToken[]) {
    const toknenizer = new Tokenizer(token.args)

    const variable = toknenizer.readWord()
    const inStr = toknenizer.readWord()
    const collection = toknenizer.readValue()
    assert(
      variable.size() && inStr.content === 'in' && collection,
      () => `illegal tag: ${token.getText()}`
    )

    this.variable = variable.content
    this.collection = collection
    this.hash = new Hash(toknenizer.remaining())
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
    let collection = yield toEnumerable(evalToken(this.collection, ctx))

    if (!collection.length) {
      yield r.renderTemplates(this.elseTemplates, ctx, emitter)
      return
    }

    const hash = yield this.hash.render(ctx)
    const offset = hash.offset || 0
    const limit = (hash.limit === undefined) ? collection.length : hash.limit

    collection = collection.slice(offset, offset + limit)
    if ('reversed' in hash) collection.reverse()

    const scope = { forloop: new ForloopDrop(collection.length) }
    ctx.push(scope)
    for (const item of collection) {
      scope[this.variable] = item
      yield r.renderTemplates(this.templates, ctx, emitter)
      if (emitter.break) {
        emitter.break = false
        break
      }
      emitter.continue = false
      scope.forloop.next()
    }
    ctx.pop()
  }
} as TagImplOptions
