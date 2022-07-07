import { TagToken } from '../../tokens/tag-token'
import { TopLevelToken } from '../../tokens/toplevel-token'
import { TagImplOptions } from '../../template/tag/tag-impl-options'

export default {
  parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
    if (tagToken.args.search(/\n\s*[^#\s]/g) !== -1) {
      throw new Error('every line of an inline comment must start with a \'#\' character')
    }
  }
} as TagImplOptions
