import { expect } from 'chai'
import { Context } from '../../../src/context/context'
import { HTMLToken, TagToken } from '../../../src/tokens'
import { Render } from '../../../src/render/render'
import { HTML } from '../../../src/template/html'
import { SimpleEmitter } from '../../../src/emitters/simple-emitter'
import { toPromise } from '../../../src/util/async'
import { Tag } from '../../../src/template/tag'

describe('render', function () {
  let render: Render
  before(function () {
    render = new Render()
  })

  describe('.renderTemplates()', function () {
    it('should render html', async function () {
      const scope = new Context()
      const token = { getContent: () => '<p>' } as HTMLToken
      const html = await toPromise(render.renderTemplates([new HTML(token)], scope, new SimpleEmitter()))
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
      class CustomTag extends Tag {
        render () {
          return new Promise(
            resolve => setTimeout(() => resolve('async tag'), 10)
          )
        }
      }
      const tpls = [
        new HTML({ getContent: () => '<p>' } as HTMLToken),
        new CustomTag({ content: 'foo', args: '', name: 'foo' } as TagToken, [], {} as any),
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
