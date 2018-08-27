import For from './for.js'
import Assign from './assign.js'
import Capture from './capture.js'
import Case from './case.js'
import Comment from './comment.js'
import Include from './include.js'
import Decrement from './decrement.js'
import Cycle from './cycle.js'
import If from './if.js'
import Increment from './increment.js'
import Layout from './layout.js'
import Raw from './raw.js'
import Tablerow from './tablerow.js'
import Unless from './unless.js'

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
