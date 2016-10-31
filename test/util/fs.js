const chai = require("chai");
const expect = chai.expect;

const fs = require('../../src/util/fs.js');
const pathResolve = fs.pathResolve;

describe('fs', function() {
    describe('.pathResolve(root, path)', function() {
        it('should accept root with no trailing slash', function() {
            expect(pathResolve('/root', 'files/foo.html')).to.equal('/root/files/foo.html');
        });
        it('should accept root with trailing slash', function() {
            expect(pathResolve('/root/', 'files/foo.html')).to.equal('/root/files/foo.html');
        });
        it('should accept dot path', function() {
            expect(pathResolve('/root', './foo.html')).to.equal('/root/foo.html');
        });
        it('should accept double-dot path', function() {
            expect(pathResolve('/root', 'files/../foo.html')).to.equal('/root/foo.html');
        });
    });
});
