import { evalExp } from './syntax.js'
import { RenderBreakError, RenderError } from './util/error.js'
import { stringify, create } from './util/underscore.js'
import assert from './util/assert.js'

const render = {
  renderTemplates: async function (templates, scope) {
    assert(scope, 'unable to evalTemplates: scope undefined')

    let html = ''
    for (const tpl of templates) {
      try {
        html += await renderTemplate.call(this, tpl)
      } catch (e) {
        if (e instanceof RenderBreakError) {
          e.resolvedHTML = html
          throw e
        }
        throw new RenderError(e, tpl)
      }
    }
    return html

    async function renderTemplate (template) {
      if (template.type === 'tag') {
        const partial = await this.renderTag(template, scope)
        return partial === undefined ? '' : partial
      }
      if (template.type === 'value') {
        return this.renderValue(template, scope)
      }
      return template.value
    }
  },

  renderTag: async function (template, scope) {
    if (template.name === 'continue') {
      throw new RenderBreakError('continue')
    }
    if (template.name === 'break') {
      throw new RenderBreakError('break')
    }
    return template.render(scope)
  },

  renderValue: async function (template, scope) {
    const partial = this.evalValue(template, scope)
    return partial === undefined ? '' : stringify(partial)
  },

  evalValue: function (template, scope) {
    assert(scope, 'unable to evalValue: scope undefined')
    return template.filters.reduce(
      (prev, filter) => filter.render(prev, scope),
      evalExp(template.initial, scope))
  }
}

export default function () {
  const instance = create(render)
  return instance
}
