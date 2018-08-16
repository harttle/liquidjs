import Scope from './scope'
import _ from './util/underscore.js'
import assert from './util/assert.js'
import tokenizer from './tokenizer.js'
import {statFileAsync, readFileAsync} from './util/fs.js'
import path from 'path'
import {valid as isValidUrl, extname, resolve} from './util/url.js'
import lexical from './lexical.js'
import Render from './render.js'
import Tag from './tag.js'
import Filter from './filter.js'
import Parser from './parser'
import {isTruthy, isFalsy, evalExp, evalValue} from './syntax.js'
import tags from './tags'
import filters from './filters'
import {anySeries} from './util/promise.js'
import Errors from './util/error.js'

let _engine = {
  init: function (tag, filter, options) {
    if (options.cache) {
      this.cache = {}
    }
    this.options = options
    this.tag = tag
    this.filter = filter
    this.parser = Parser(tag, filter)
    this.renderer = Render()

    tags(this)
    filters(this)

    return this
  },
  parse: function (html, filepath) {
    let tokens = tokenizer.parse(html, filepath, this.options)
    return this.parser.parse(tokens)
  },
  render: function (tpl, ctx, opts) {
    opts = _.assign({}, this.options, opts)
    let scope = Scope.factory(ctx, opts)
    return this.renderer.renderTemplates(tpl, scope)
  },
  parseAndRender: function (html, ctx, opts) {
    return Promise.resolve()
      .then(() => this.parse(html))
      .then(tpl => this.render(tpl, ctx, opts))
  },
  renderFile: function (filepath, ctx, opts) {
    opts = _.assign({}, opts)
    return this.getTemplate(filepath, opts.root)
      .then(templates => this.render(templates, ctx, opts))
  },
  evalValue: function (str, scope) {
    let tpl = this.parser.parseValue(str.trim())
    return this.renderer.evalValue(tpl, scope)
  },
  registerFilter: function (name, filter) {
    return this.filter.register(name, filter)
  },
  registerTag: function (name, tag) {
    return this.tag.register(name, tag)
  },
  lookup: function (filepath, root) {
    root = this.options.root.concat(root || [])
    root = _.uniq(root)
    let paths = root.map(root => path.resolve(root, filepath))
    return anySeries(paths, path => statFileAsync(path).then(() => path))
      .catch((e) => {
        e.message = `${e.code}: Failed to lookup ${filepath} in: ${root}`
        throw e
      })
  },
  getTemplate: function (filepath, root) {
    return typeof XMLHttpRequest === 'undefined'
      ? this.getTemplateFromFile(filepath, root)
      : this.getTemplateFromUrl(filepath, root)
  },
  getTemplateFromFile: function (filepath, root) {
    if (!path.extname(filepath)) {
      filepath += this.options.extname
    }
    return this
      .lookup(filepath, root)
      .then(filepath => {
        if (this.options.cache) {
          let tpl = this.cache[filepath]
          if (tpl) {
            return Promise.resolve(tpl)
          }
          return readFileAsync(filepath)
            .then(str => this.parse(str))
            .then(tpl => (this.cache[filepath] = tpl))
        } else {
          return readFileAsync(filepath).then(str => this.parse(str, filepath))
        }
      })
  },
  getTemplateFromUrl: function (filepath, root) {
    let fullUrl
    if (isValidUrl(filepath)) {
      fullUrl = filepath
    } else {
      if (!extname(filepath)) {
        filepath += this.options.extname
      }
      fullUrl = resolve(root || this.options.root, filepath)
    }
    if (this.options.cache) {
      let tpl = this.cache[filepath]
      if (tpl) {
        return Promise.resolve(tpl)
      }
    }
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let tpl = this.parse(xhr.responseText)
          if (this.options.cache) {
            this.cache[filepath] = tpl
          }
          resolve(tpl)
        } else {
          reject(new Error(xhr.statusText))
        }
      }
      xhr.onerror = () => {
        reject(new Error('An error occurred whilst sending the response.'))
      }
      xhr.open('GET', fullUrl)
      xhr.send()
    })
  },
  express: function (opts) {
    opts = opts || {}
    let self = this
    return function (filePath, ctx, callback) {
      assert(Array.isArray(this.root) || _.isString(this.root),
        'illegal views root, are you using express.js?')
      opts.root = this.root
      self.renderFile(filePath, ctx, opts)
        .then(html => callback(null, html))
        .catch(e => callback(e))
    }
  }
}

function factory (options) {
  options = _.assign({
    root: ['.'],
    cache: false,
    extname: '',
    dynamicPartials: true,
    trim_tag_right: false,
    trim_tag_left: false,
    trim_value_right: false,
    trim_value_left: false,
    greedy: true,
    strict_filters: false,
    strict_variables: false
  }, options)
  options.root = normalizeStringArray(options.root)

  let engine = Object.create(_engine)
  engine.init(Tag(), Filter(options), options)
  return engine
}

function normalizeStringArray (value) {
  if (Array.isArray(value)) return value
  if (_.isString(value)) return [value]
  return []
}

const Types = {
  ParseError: Errors.ParseError,
  TokenizationEroor: Errors.TokenizationError,
  RenderBreakError: Errors.RenderBreakError,
  AssertionError: Errors.AssertionError
}

factory.isTruthy = isTruthy
factory.isFalsy = isFalsy
factory.evalExp = evalExp
factory.evalValue = evalValue
factory.Types = Types
factory.lexical = lexical

module.exports = factory
