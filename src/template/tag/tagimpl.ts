import Liquid from 'src/liquid'
import Scope from 'src/scope/scope'

export default interface TagImpl {
  liquid: Liquid
  parse: (token: any, remainingTokens: Array<any>) => void
  render: (scope: Scope, hash: any) => Promise<string>
}
