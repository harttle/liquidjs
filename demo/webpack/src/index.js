import { Liquid } from 'liquidjs'

const engine = new Liquid({
  extname: '.liquid',
  globals: { title: 'LiquidJS Demo' },
  // root files for `.render()` and `.parse()`
  root: process.cwd(),
  // layout files for `{% layout %}`
  layouts: process.cwd() + '/layouts',
  // partial files for `{% include %}` and `{% render %}`
  partials: process.cwd() + '/partials'
})

const ctx = {
  todos: ['fork and clone', 'make it better', 'make a pull request']
}

async function main () {
  console.log('==========renderFile===========')
  const html = await engine.renderFile('todolist', ctx)
  console.log(html)

  console.log('===========Streamed===========')
  const tpls = await engine.parseFile('todolist')
  engine.renderToNodeStream(tpls, ctx)
    .on('data', data => process.stdout.write(data))
    .on('end', () => console.log(''))
}

main()
