const chai = require("chai");
const expect = chai.expect;
const mock = require('mock-fs');
const request = require('supertest');
const express = require('express');
const Liquid = require('..');

describe('engine#express()', function() {
    var app, engine;

    before(function() {
        mock({
            '/root/foo.html': 'foo',
            '/views/name.html': 'My name is {{name}}.',
            '/views/include.html': '{% include file %}',
            '/partials/bar.html': 'bar'
        });
        app = express();
        engine = Liquid({
            root: '/root',
            extname: '.html'
        });

        app.set('views', ['/views', '/partials']);
        app.set('view engine', 'html');
        app.engine('html', engine.express());

        app.get('/name', function(req, res) {
            res.render('name', {
                name: 'harttle'
            });
        });
        app.get('/include/:file', function(req, res) {
            res.render('include', {
                file: req.params.file
            });
        });
    });
    after(function(){
        mock.restore();
    });
    it('should render templates', function(done) {
        request(app).get('/name')
            .expect('My name is harttle.')
            .expect(200, done);
    });
    it('should pass error when file not found', function(done) {
        var view = {
            root: []
        };
        var file = '/not-exist.html';
        var ctx = {};
        engine.express().call(view, file, ctx, function(err) {
            try{
                expect(err.code).to.equal('ENOENT');
                expect(err.message).to.match(/Failed to lookup/);
                done();
            }
            catch(e){
                done(e);
            }
        });
    });
    it('should respect root option when lookup', function(done) {
        request(app).get('/include/foo')
            .expect('foo')
            .expect(200, done);
    });
});
