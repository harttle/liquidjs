import { RenderBreakError } from 'src/util/error'

export default {
  render: async function () {
    throw new RenderBreakError('break')
  }
}
