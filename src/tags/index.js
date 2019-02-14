import For from './for'
import Assign from './assign'
import Capture from './capture'
import Case from './case'
import Comment from './comment'
import Include from './include'
import Decrement from './decrement'
import Cycle from './cycle'
import If from './if'
import Increment from './increment'
import Layout from './layout'
import Raw from './raw'
import Tablerow from './tablerow'
import Unless from './unless'

export default function (engine, Liquid) {
  Assign(engine, Liquid)
  Capture(engine, Liquid)
  Case(engine, Liquid)
  Comment(engine, Liquid)
  Cycle(engine, Liquid)
  Decrement(engine, Liquid)
  For(engine, Liquid)
  If(engine, Liquid)
  Include(engine, Liquid)
  Increment(engine, Liquid)
  Layout(engine, Liquid)
  Raw(engine, Liquid)
  Tablerow(engine, Liquid)
  Unless(engine, Liquid)
}
