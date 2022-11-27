import AssignTag from './assign'
import ForTag from './for'
import CaptureTag from './capture'
import CaseTag from './case'
import CommentTag from './comment'
import IncludeTag from './include'
import RenderTag from './render'
import DecrementTag from './decrement'
import CycleTag from './cycle'
import IfTag from './if'
import IncrementTag from './increment'
import LayoutTag from './layout'
import BlockTag from './block'
import RawTag from './raw'
import TablerowTag from './tablerow'
import UnlessTag from './unless'
import BreakTag from './break'
import ContinueTag from './continue'
import EchoTag from './echo'
import LiquidTag from './liquid'
import InlineCommentTag from './inline-comment'
import type { TagClass } from '../template/tag'

export const tags: Record<string, TagClass> = {
  assign: AssignTag,
  'for': ForTag,
  capture: CaptureTag,
  'case': CaseTag,
  comment: CommentTag,
  include: IncludeTag,
  render: RenderTag,
  decrement: DecrementTag,
  increment: IncrementTag,
  cycle: CycleTag,
  'if': IfTag,
  layout: LayoutTag,
  block: BlockTag,
  raw: RawTag,
  tablerow: TablerowTag,
  unless: UnlessTag,
  'break': BreakTag,
  'continue': ContinueTag,
  echo: EchoTag,
  liquid: LiquidTag,
  '#': InlineCommentTag
}

export { AssignTag, ForTag, CaptureTag, CaseTag, CommentTag, IncludeTag, RenderTag, DecrementTag, IncrementTag, CycleTag, IfTag, LayoutTag, BlockTag, RawTag, TablerowTag, UnlessTag, BreakTag, ContinueTag, EchoTag, LiquidTag, InlineCommentTag }
