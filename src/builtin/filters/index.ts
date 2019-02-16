import { assign } from 'src/util/underscore'
import html from './html'
import str from './string'
import math from './math'
import url from './url'
import array from './array'
import date from './date'
import obj from './object'

const filters = assign({}, html, str, math, url, date, obj, array)

export default filters
