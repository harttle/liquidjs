import { TagToken } from './tag-token'
import { HTMLToken } from './html-token'
import { OutputToken } from './output-token'

export type TopLevelToken = TagToken | OutputToken | HTMLToken
