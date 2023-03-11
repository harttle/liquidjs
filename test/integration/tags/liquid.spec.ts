import { Liquid } from '../../../src/liquid'

describe('tags/liquid', function () {
  const liquid = new Liquid()

  it('should support shorthand syntax', async function () {
    const src = `
    {%- liquid
      for value in array
        echo value
        unless forloop.last
          echo '#'
        endunless
    endfor
    -%}
    `
    const html = await liquid.parseAndRender(src, { array: [1, 2, 3] })
    return expect(html).toBe('1#2#3')
  })

  it('should support shorthand syntax with assignments and filters', async function () {
    const src = `
    {%- liquid
      for value in array
        assign double_value = value | times: 2
        echo double_value | times: 2
        unless forloop.last
          echo '#'
        endunless
      endfor
    
      echo '#'
      echo double_value
    -%}
    `
    const html = await liquid.parseAndRender(src, { array: [1, 2, 3] })
    return expect(html).toBe('4#8#12#6')
  })

  it('should handle empty tag', async function () {
    const src = '{% liquid %}'
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('')
  })

  it('should handle lines containing only whitespace', async function () {
    const src = `{% liquid 
      echo 'hello '
        

        \t
      echo 'goodbye'
    %}`
    const html = await liquid.parseAndRender(src)
    return expect(html).toBe('hello goodbye')
  })

  it('should fail with carriage return terminated tags', async function () {
    const src = [
      '{%- liquid',
      '  for value in array',
      '    echo value',
      '    unless forloop.last',
      '      echo "#"',
      '    endunless',
      'endfor',
      '-%}'
    ].join('\r')
    return expect(liquid.parseAndRender(src))
      .rejects.toThrow(/not closed/)
  })
})
