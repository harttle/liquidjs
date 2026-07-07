import { throwIntendedError, rejectIntendedError } from './util'
import { Tag } from '../../src/template/tag'
import type { TagToken, TopLevelToken } from '../../src/tokens'
import type { Liquid } from '../../src/liquid'

export class ThrowingTag extends Tag {
  render () {
    throwIntendedError()
  }
}

export class RejectingTag extends Tag {
  async render () {
    await rejectIntendedError()
  }
}

export class ThrowsOnParseTag extends Tag {
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    throwIntendedError()
  }
  render () {
    return ''
  }
}

export class IntendedRenderErrorTag extends Tag {
  render () {
    throw new Error('intended render error')
  }
}
