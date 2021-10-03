import { expect } from 'chai'
import { StreamedEmitter } from '../../../src/emitters/streamed-emitter-browser'

describe('emitters/streamed-emitter-browser', () => {
  it('should throw when try to constructing', () => {
    expect(() => new StreamedEmitter()).to.throw(/streaming not supported/)
  })
})
