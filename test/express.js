const chai = require('chai')
const expect = chai.expect
const mock = require('mock-fs')
const request = require('supertest')
const express = require('express')
const Liquid = require('..')

// describe('engine#express()', function () {
//   var app, engine

//   beforeEach(function () {
//     app = express()
//     engine = Liquid({
//       root: '/root',
//       extname: '.html'
//     })

//     app.set('view engine', 'html')
//     app.engine('html', engine.express())

//     app.get('/name', (req, res) => res.render('name', {
//       name: 'harttle'
//     }))
//     app.get('/include/:file', (req, res) => res.render('include', {
//       file: req.params.file
//     }))
//   })
//   after(function () {
//     mock.restore()
//   })
//   it('should render express views', function (done) {
//     mock({ '/views/name.html': 'My name is {{name}}.' })
//     app.set('views', ['/views'])
//     request(app).get('/name')
//       .expect('My name is harttle.')
//       .expect(200, done)
//   })
//   it('should pass error when file not found', function (done) {
//     var view = {
//       root: []
//     }
//     var file = '/not-exist.html'
//     var ctx = {}
//     engine.express().call(view, file, ctx, function (err) {
//       try {
//         expect(err.code).to.equal('ENOENT')
//         expect(err.message).to.match(/Failed to lookup/)
//         done()
//       } catch (e) {
//         done(e)
//       }
//     })
//   })
//   it('should respect root option when lookup', function (done) {
//     mock({
//       '/root/foo.html': 'foo',
//       '/views/include.html': '{% include file %}'
//     })
//     app.set('views', ['/views'])
//     request(app).get('/include/foo')
//       .expect('foo')
//       .expect(200, done)
//   })
//   it('should respect express views (Array) when lookup', function (done) {
//     mock({
//       '/views/include.html': '{% include file %}',
//       '/partials/bar.html': 'bar'
//     })
//     app.set('views', ['/views', '/partials'])
//     request(app).get('/include/bar')
//       .expect('bar')
//       .expect(200, done)
//   })
//   it('should respect express views (String) when lookup', function (done) {
//     mock({
//       '/views/include.html': '{% include file %}',
//       '/views/bar.html': 'bar'
//     })
//     app.set('views', '/views')
//     request(app).get('/include/bar')
//       .expect('bar')
//       .expect(200, done)
//   })
//   it('should respect express views (Undefined) when lookup', function (done) {
//     var files = {}
//     files[process.cwd() + '/views/include.html'] = '{% include file %}'
//     files[process.cwd() + '/views/bar.html'] = 'bar'
//     mock(files)

//     request(app).get('/include/bar')
//       .expect('bar')
//       .expect(200, done)
//   })
// })
