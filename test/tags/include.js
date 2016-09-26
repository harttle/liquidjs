const Liquid = require('../..');
const mock = require('mock-fs');
const chai = require("chai");
const expect = chai.expect;
const error = require('../../src/error.js');
chai.use(require("chai-as-promised"));

describe('tags/include', function() {
    var liquid, ctx;
    before(function() {
        liquid = Liquid({
            root: '/',
            extname: '.html'
        });
    });
    beforeEach(function() {
        ctx = {
            person: {
                firstName: 'Joe',
                lastName: 'Shmoe',
                address: {
                    city: 'Dallas'
                }
            }
        };
        mock({
            '/current.html': 'bar{% include "bar/foo.html" %}bar',
            '/bar/foo.html': 'foo',
            '/foo/relative.html': 'bar{% include "../bar/foo.html" %}bar',
            '/hash.html': '{% assign name="harttle" %}{% include "user.html", role: "admin", alias: name %}',
            '/illegal.html': '{%include%}',

            // colors
            '/scope.html': '{% assign shape="triangle" %}{% assign color="yellow" %}{% include "color.html" %}',
            '/with.html': '{% include "color" with "red", shape: "rect" %}',
            '/color.html': 'color:{{color}}, shape:{{shape}}',

            // person info
            '/personInfo.html': 'This is a person {% include "card.html" %}',
            '/card.html': '<p>{{person.firstName}} {{person.lastName}}<br/>{% include "address" %}</p>',
            '/user.html': '{{name}} : {{role}} : {{alias}}',
            '/address.html': 'City: {{person.address.city}}'
        });
    });
    afterEach(function() {
        mock.restore();
    });
    it('should support include', function() {
        return expect(liquid.renderFile('/current.html', ctx)).to.
            eventually.equal('barfoobar');
    });

    it('should throw when illegal', function() {
        return expect(liquid.renderFile('/illegal.html')).to.
            be.rejectedWith(error.ParseError, /illegal token {%include%}/);
    });

    it('should support include with relative path', function() {
        return expect(liquid.renderFile('foo/relative.html', ctx)).to.
            eventually.equal('barfoobar');
    });

    it('should support include: hash list', function() {
        return expect(liquid.renderFile('hash.html', ctx)).to.
            eventually.equal('harttle : admin : harttle');
    });

    it('should support include: parent scope', function() {
        return expect(liquid.renderFile('scope.html', ctx)).to.
            eventually.equal('color:yellow, shape:triangle');
    });

    it('should support include: with', function() {
        return expect(liquid.renderFile('with.html', ctx)).to.
            eventually.equal('color:red, shape:rect');
    });

    it('should support nested includes', function() {
        return expect(liquid.renderFile('personInfo.html', ctx)).to.
            eventually.equal('This is a person <p>Joe Shmoe<br/>City: Dallas</p>');
    });
});
