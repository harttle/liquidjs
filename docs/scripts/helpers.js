/* global hexo */

'use strict'

const { resolve, basename } = require('path')
const { readFileSync } = require('fs')
const cheerio = require('cheerio')
const fullUrlFor = hexo.extend.helper.get('full_url_for').bind(hexo)

const localizedPath = ['tutorials', 'filters', 'tags', 'playground', 'api']

hexo.extend.helper.register('page_nav', function () {
  const type = this.page.canonical_path.split('/')[0]
  const sidebar = this.site.data.sidebar[type]
  const path = basename(this.path)
  const list = {}
  const prefix = 'sidebar.' + type + '.'

  for (const i in sidebar) {
    if (typeof sidebar[i] === 'string') list[sidebar[i]] = i
    else for (const j in sidebar[i]) list[sidebar[i][j]] = j
  }

  const keys = Object.keys(list)
  const index = keys.indexOf(path)
  let result = ''

  if (index > 0) {
    result += `<a href="${keys[index - 1]}" class="article-footer-prev" title="${this.__(prefix + list[keys[index - 1]])}"><i class="icon-chevron-left"></i><span>${this.__('page.prev')}</span></a>`
  }

  if (index < keys.length - 1) {
    result += `<a href="${keys[index + 1]}" class="article-footer-next" title="${this.__(prefix + list[keys[index + 1]])}"><span>${this.__('page.next')}</span><i class="icon-chevron-right"></i></a>`
  }

  return result
})

hexo.extend.helper.register('raw', function (filepath) {
  const content = readFileSync(resolve(this.view_dir, filepath), 'utf8')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
  return content
})

hexo.extend.helper.register('doc_sidebar', function (className) {
  const type = this.page.canonical_path.split('/')[0]
  const sidebar = this.site.data.sidebar[type]
  const path = basename(this.path)
  let result = ''
  const { __ } = this
  const prefix = 'sidebar.' + type + '.'

  if (typeof sidebar === 'undefined') {
    return ''
  }

  for (const [title, menu] of Object.entries(sidebar)) {
    if (typeof menu === 'string') renderLink(title, menu)
    else renderSection(title, menu)
  }

  return result

  function renderLink (text, link) {
    let itemClass = className + '-link'
    if (link === path) itemClass += ' current'

    const localized = __(prefix + text) === prefix + text ? text : __(prefix + text)
    result += '<a href="' + link + '" class="' + itemClass + '">' + localized + '</a>'
  }

  function renderSection (title, menu) {
    result += '<strong class="' + className + '-title">' + __(prefix + title) + '</strong>'
    for (const [text, link] of Object.entries(menu)) renderLink(text, link)
  }
})

hexo.extend.helper.register('header_menu', function (className) {
  const menu = this.site.data.menu
  let result = ''
  const lang = this.page.lang
  const isEnglish = lang === 'en'

  for (const [title, path] of Object.entries(menu)) {
    let langPath = path
    if (!isEnglish && ~localizedPath.indexOf(title)) langPath = lang + path
    const url = this.url_for(langPath)
    const active = ('/' + this.page.canonical_path).slice(0, path.length) === path ? ' active' : ''
    result += `<a href="${url}" class="${className}-link${active}">${this.__('menu.' + title)}</a>`
  }

  return result
})

hexo.extend.helper.register('canonical_url', function (lang) {
  let path = this.page.path
  if (lang && lang !== 'en') path = lang + '/' + path

  return fullUrlFor(path)
})

hexo.extend.helper.register('url_for_lang', function (path) {
  const lang = this.page.lang
  let url = this.url_for(path)

  if (lang !== 'en' && path[0] === '/') url = '/' + lang + path

  return url
})

hexo.extend.helper.register('raw_link', path => `https://github.com/harttle/liquidjs/edit/master/docs/source/${path}`)

hexo.extend.helper.register('page_anchor', str => {
  const $ = cheerio.load(str, { decodeEntities: false })
  const headings = $('h1, h2, h3, h4, h5, h6')

  if (!headings.length) return str

  headings.each(function () {
    const id = $(this).attr('id')

    $(this)
      .addClass('article-heading')
      .append(`<a class="article-anchor" href="#${id}" aria-hidden="true"></a>`)
  })

  return $.html()
})

// Will be replace with fullUrlFor after hexo v4 release
hexo.extend.helper.register('canonical_path_for_nav', function () {
  const path = this.page.canonical_path
  for (const slug of localizedPath) if (path.startsWith(slug)) return path
  return ''
})

hexo.extend.helper.register('lang_name', function (lang) {
  const data = this.site.data.languages[lang]
  return data.name || data
})

hexo.extend.helper.register('hexo_version', function () {
  return this.env.version
})
