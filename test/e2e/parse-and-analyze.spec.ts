import { Context, Emitter, Hash, Liquid, Scope, Tag, TagToken, Template, TopLevelToken, ParseStream, Parser, Arguments, analyzeSync, Variable, StaticAnalysisOptions, StaticAnalysis } from '../..'

class MockTag extends Tag {
  private args: Hash
  private templates: Template[]

  constructor (token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser) {
    super(token, remainTokens, liquid)
    this.args = new Hash(token.tokenizer)
    this.templates = []

    const stream: ParseStream = parser.parseStream(remainTokens)
      .on<TagToken>('tag:endmock', () => { stream.stop() })
      .on('template', (tpl: Template) => this.templates.push(tpl))
      .on('end', () => { throw new Error(`tag ${token.getText()} not closed`) })

    stream.start()
  }

  public * render (ctx: Context, emitter: Emitter): Generator<unknown, void, string> {
    const scope = (yield this.args.render(ctx)) as unknown as Scope
    ctx.push(scope)
    yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter)
    ctx.pop()
  }

  public * children (): Generator<unknown, Template[]> {
    return this.templates
  }

  public * arguments (): Arguments {
    // XXX: tokens and type guards are not exported
    yield * Object.values(this.args.hash).filter((el) => el !== undefined) as Arguments
  }

  public blockScope (): Iterable<string> {
    return Object.keys(this.args.hash)
  }
}

describe('Static analysis', () => {
  it('should report variables from non-standard tags', () => {
    const engine = new Liquid()
    engine.registerTag('mock', MockTag)

    const template = engine.parse('{% mock a:b x:y %}{{ x }}{{ z }}{% endmock %}')
    const analysis = analyzeSync(template)

    const b = [new Variable(['b'], { row: 1, col: 11, file: undefined })]
    const x = [new Variable(['x'], { row: 1, col: 22, file: undefined })]
    const y = [new Variable(['y'], { row: 1, col: 15, file: undefined })]
    const z = [new Variable(['z'], { row: 1, col: 29, file: undefined })]

    expect(analysis).toStrictEqual({
      variables: { b, x, y, z },
      globals: { b, y, z },
      locals: { }
    })
  })

  it('should export analysis interfaces', () => {
    const engine = new Liquid()
    const template = engine.parse('{% include nothing %}')
    const options: StaticAnalysisOptions = { partials: false }
    const analysis: StaticAnalysis = analyzeSync(template, options)
    const vars: Variable[] = analysis.variables['nothing'] || []
    const v: Variable = vars[0]
    expect(String(v)).toBe('nothing')
  })
})
