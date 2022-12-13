import { Value, Liquid, TagToken, Context, Emitter, Tag, TopLevelToken } from 'liquidjs'

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})

engine.registerTag('header', class HeaderTag extends Tag {
  private value: Value
  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid)
    this.value = new Value(token.args, liquid)
  }
  * render (ctx: Context, emitter: Emitter) {
    const title = yield this.value.value(ctx)
    emitter.write(`<h1>${title}</h1>`)
  }
})

const scope = {
  todos: ['fork and clone', 'make it better', 'make a pull request'],
  title: 'Welcome to liquidjs!'
}

engine.renderFile('todolist', scope).then(console.log)
