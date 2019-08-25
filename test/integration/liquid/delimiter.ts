import { expect } from 'chai'
import { Liquid } from '../../../src/liquid'

describe('LiquidOptions#*_delimiter_*', function () {
  it('should respect tag_delimiter_*', async function () {
    const engine = new Liquid({
      tagDelimiterLeft: '<%=',
      tagDelimiterRight: '%>'
    })
    const html = await engine.parseAndRender('<%=if true%>foo<%=endif%> ')
    return expect(html).to.equal('foo ')
  })
  it('should respect output_delimiter_*', async function () {
    const engine = new Liquid({
      outputDelimiterLeft: '<<',
      outputDelimiterRight: '>>'
    })
    const html = await engine.parseAndRender('<< "liquid" | capitalize >>')
    return expect(html).to.equal('Liquid')
  })
  it('should support trimming with tag_delimiter_* set', async function () {
    const engine = new Liquid({
      tagDelimiterLeft: '<%=',
      tagDelimiterRight: '%>',
      trimTagLeft: true,
      trimTagRight: true
    })
    const html = await engine.parseAndRender(' <%=if true%> \tfoo\t <%=endif%> ')
    return expect(html).to.equal('foo')
  })
})
