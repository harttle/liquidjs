const reported:{[key: string]: boolean} = {}

export function deprecate(msg: string, issue: number) {
  if (reported[msg]) return
  console.warn(msg + ` See: https://github.com/harttle/liquidjs/issues/${issue}`)
  reported[msg] = true
}