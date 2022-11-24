import * as chai from 'chai'
import { ParseStream } from '../../../src/parser'
import { Token } from '../../../src/tokens'

const expect = chai.expect

describe('parseStream', () => {
  it('should trigger "token" event', () => {
    const token = { kind: 4 } as Token
    const ps = new ParseStream([token], (token) => ({ token } as any))
    let got
    ps.on('token', token => { got = token }).start()
    expect(got).to.equal(token)
  })
})
