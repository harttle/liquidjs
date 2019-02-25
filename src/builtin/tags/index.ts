import assign from './assign'
import For from './for'
import capture from './capture'
import Case from './case'
import comment from './comment'
import include from './include'
import decrement from './decrement'
import cycle from './cycle'
import If from './if'
import increment from './increment'
import layout from './layout'
import block from './block'
import raw from './raw'
import tablerow from './tablerow'
import unless from './unless'
import Break from './break'
import Continue from './continue'
import ITagImplOptions from '../../template/tag/itag-impl-options'

const tags: { [key: string]: ITagImplOptions } = {
  assign, 'for': For, capture, 'case': Case, comment, include, decrement, increment, cycle, 'if': If, layout, block, raw, tablerow, unless, 'break': Break, 'continue': Continue
}

export default tags
