import { RenderBreakError } from 'src/util/error'

export default {
  render: async function (scope) {
    throw new RenderBreakError('break')
  }
}
