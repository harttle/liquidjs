import { assert } from '../../util/assert'
import { Expression, Emitter, Hash, TagToken, Token, Context, Template, TagImplOptions, ParseStream } from '../../types'
import { identifier, value, hash } from '../../parser/lexical'
import { TablerowloopDrop } from '../../drop/tablerowloop-drop'

const re = new RegExp(`^(${identifier.source})\\s+in\\s+` +
  `(${value.source})` +
  `(?:\\s+${hash.source})*$`)

export default {
  parse: function (tagToken: TagToken, remainTokens: Token[]) {
    const match = re.exec(tagToken.args) as RegExpExecArray
    assert(match, `illegal tag: ${tagToken.raw}`)

    this.variable = match[1]
    this.collection = match[2]
    this.templates = []

    let p
    const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => (p = this.templates))
      .on('tag:endtablerow', () => stream.stop())
      .on('template', (tpl: Template) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },

  render: function * (ctx: Context, hash: Hash, emitter: Emitter) {
    let collection = (yield new Expression(this.collection).value(ctx)) || []
    const offset = hash.offset || 0
    const limit = (hash.limit === undefined) ? collection.length : hash.limit

    collection = collection.slice(offset, offset + limit)
    const cols = hash.cols || collection.length

    const r = this.liquid.renderer
    const tablerowloop = new TablerowloopDrop(collection.length, cols)
    const scope = { tablerowloop }
    ctx.push(scope)

    for (let idx = 0; idx < collection.length; idx++, tablerowloop.next()) {
      scope[this.variable] = collection[idx]
      if (tablerowloop.col0() === 0) {
        if (tablerowloop.row() !== 1) emitter.write('</tr>')
        emitter.write(`<tr class="row${tablerowloop.row()}">`)
      }
      emitter.write(`<td class="col${tablerowloop.col()}">`)
      yield r.renderTemplates(this.templates, ctx, emitter)
      emitter.write('</td>')
    }
    if (collection.length) emitter.write('</tr>')
    ctx.pop()
  }
} as TagImplOptions
