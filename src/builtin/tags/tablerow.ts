import assert from '../../util/assert'
import { evalExp } from '../../render/syntax'
import { identifier, value, hash } from '../../parser/lexical'
import TagToken from '../../parser/tag-token'
import Token from '../../parser/token'
import ITemplate from '../../template/itemplate'
import Context from '../../context/context'
import Hash from '../../template/tag/hash'
import ITagImplOptions from '../../template/tag/itag-impl-options'
import ParseStream from '../../parser/parse-stream'
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
      .on('template', (tpl: ITemplate) => p.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.raw} not closed`)
      })

    stream.start()
  },

  render: async function (ctx: Context, hash: Hash) {
    let collection = await evalExp(this.collection, ctx) || []
    const offset = hash.offset || 0
    const limit = (hash.limit === undefined) ? collection.length : hash.limit

    collection = collection.slice(offset, offset + limit)
    const cols = hash.cols || collection.length

    const tablerowloop = new TablerowloopDrop(collection.length, cols)
    const scope = { tablerowloop }
    ctx.push(scope)

    let html = ''
    for (let idx = 0; idx < collection.length; idx++, tablerowloop.next()) {
      scope[this.variable] = collection[idx]
      if (tablerowloop.col0() === 0) {
        if (tablerowloop.row() !== 1) html += '</tr>'
        html += `<tr class="row${tablerowloop.row()}">`
      }
      html += `<td class="col${tablerowloop.col()}">`
      html += await this.liquid.renderer.renderTemplates(this.templates, ctx)
      html += '</td>'
    }
    if (collection.length) html += '</tr>'
    ctx.pop()
    return html
  }
} as ITagImplOptions
