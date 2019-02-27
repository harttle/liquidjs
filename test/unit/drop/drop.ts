import { expect } from 'chai'
import { Drop } from '../../../src/drop/drop'

describe('drop/drop', function () {
  class CustomDrop extends Drop { }

  it('.valueOf() should return undefined by default', async function () {
    expect(new CustomDrop().valueOf()).to.be.undefined
  })
})
