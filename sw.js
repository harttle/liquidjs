'use strict'

const CACHE_NAME = ''
const urlsToCache = [
  '/',
  '/css/navy.css',
  '/js/main.js',
  '/icon/logo.png',
  '/fonts/icomoon.ttf?e8nnma'
]
const blackList = [
  /google-analytics.com.*collect/
]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(cacheNames => Promise.all(
    cacheNames.map(cacheName => cacheName !== CACHE_NAME && caches.delete(cacheName))
  )))
})

self.addEventListener('fetch', event => {
  if (
    event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin'
  ) return cache(event.request)
  if (
    event.request.method !== 'GET' || blackList.some(regex => regex.exec(event.request.url))
  ) return network(event.request)
  const pn = networkAndSave(event.request)
  event.respondWith(cache(event.request).then(res => res || pn).catch(() => pn))
})

function cache (req) {
  return caches.open(CACHE_NAME).then(cache => cache.match(req.clone()))
}

function networkAndSave (req) {
  return network(req).then(res => {
    if (validate(res)) save(req.clone(), res.clone())
    return res
  })
}

function network (req) {
  return fetch(req.clone())
}

function save (key, val) {
  return caches.open(CACHE_NAME).then(cache => cache.put(key, val))
}

function validate (res) {
  if (res && res.type === 'basic' && res.status !== 200) return false
  return true
}
