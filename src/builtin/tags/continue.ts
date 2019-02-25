import { RenderBreakError } from '../../util/error'

export default {
  render: async function () {
    throw new RenderBreakError('continue')
  }
}
