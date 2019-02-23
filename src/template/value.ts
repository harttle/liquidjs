import { evalExp } from 'src/render/syntax'
import * as lexical from 'src/parser/lexical'
import Filter from './filter/filter'
import Scope from 'src/scope/scope'


enum ParseState {
  INIT = 0,
  FILTER_NAME = 1,
  FILTER_ARG = 2
}

export default class {
  initial: any
  filters: Array<Filter> = []

  /**
   * @param str value string, like: "i have a dream | truncate: 3
   */
  constructor (str: string, strictFilters: boolean) {
    const N = str.length
    let buffer = ''
    let quoted = ''
    let state = ParseState.INIT
    let sealed = false

    let filterName = ''
    let filterArgs: string[] = []

    for(let i = 0; i < str.length; i++) {
      if (quoted) {
        if (str[i] == quoted) {
          quoted = ''
          sealed = true
        }
        buffer += str[i]
      }
      else if (/\s/.test(str[i])) {
        if (!buffer) continue
        else sealed = true
      }
      else if (str[i] === '|') {
        if (state === ParseState.INIT) {
          this.initial = buffer
        }
        else {
          if (state === ParseState.FILTER_NAME) filterName = buffer
          else filterArgs.push(buffer)
          this.filters.push(new Filter(filterName, filterArgs, strictFilters))
          filterName = ''
          filterArgs = []
        }
        state = ParseState.FILTER_NAME
        buffer = ''
        sealed = false
      }
      else if (state === ParseState.FILTER_NAME && str[i] === ':') {
        filterName = buffer
        state = ParseState.FILTER_ARG
        buffer = ''
        sealed = false
      }
      else if (state === ParseState.FILTER_ARG && str[i] === ',') {
        filterArgs.push(buffer)
        buffer = ''
        sealed = false
      }
      else if (sealed) continue
      else {
        if ((str[i] === '"' || str[i] === "'") && !quoted) quoted = str[i]
        buffer += str[i]
      }
    }

    if (buffer) {
      if (state === ParseState.INIT) this.initial = buffer
      else if (state === ParseState.FILTER_NAME) this.filters.push(new Filter(buffer, [], strictFilters))
      else {
        filterArgs.push(buffer)
        this.filters.push(new Filter(filterName, filterArgs, strictFilters))
      }
    }
  }
  value (scope: Scope) {
    return this.filters.reduce(
      (prev, filter) => filter.render(prev, scope),
      evalExp(this.initial, scope))
  }
}
