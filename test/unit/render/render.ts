import { expect } from 'chai'
import { Context } from '../../../src/context/context'
import { HTMLToken } from '../../../src/tokens/html-token'
import { Render } from '../../../src/render/render'
import { HTML } from '../../../src/template/html'
import { SimpleEmitter } from '../../../src/emitters/simple-emitter'
import { toThenable } from '../../../src/util/async'
import { Tag } from '../../../src/template/tag/tag'
import { TagToken } from '../../../src/types'

describe('render', function () {
  let render: Render
  before(function () {
    render = new Render()
  })

  describe('.renderTemplates()', function () {
    it('should render html', async function () {
      const scope = new Context()
      const token = { getContent: () => '<p>' } as HTMLToken
      const html = await toThenable(render.renderTemplates([new HTML(token)], scope, new SimpleEmitter()))
      return expect(html).to.equal('<p>')
    })
  })

  describe('.renderTemplatesToNodeStream()', function () {
    it('should render to html stream', function (done) {
      const scope = new Context()
      const tpls = [
        new HTML({ getContent: () => '<p>' } as HTMLToken),
        new HTML({ getContent: () => '</p>' } as HTMLToken)
      ]
      const stream = render.renderTemplatesToNodeStream(tpls, scope)
      let result = ''
      stream.on('data', (data) => {
        result += data
      })
      stream.on('end', () => {
        expect(result).to.equal('<p></p>')
        done()
      })
    })
    it('should render to html stream asyncly', function (done) {
      const scope = new Context()
      const tpls = [
        new HTML({ getContent: () => '<p>' } as HTMLToken),
        new Tag({ content: 'foo', args: '', name: 'foo' } as TagToken, [], {
          tags: {
            get: () => ({
              render: () => new Promise(
                resolve => setTimeout(() => resolve('async tag'), 10)
              )
            })
          }
        } as any),
        new HTML({ getContent: () => '</p>' } as HTMLToken)
      ]
      const stream = render.renderTemplatesToNodeStream(tpls, scope)
      let result = ''
      stream.on('data', (data) => {
        result += data
      })
      stream.on('end', () => {
        expect(result).to.equal('<p>async tag</p>')
        done()
      })
    })
  })
})
