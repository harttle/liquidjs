const chai = require("chai");
const expect = chai.expect;

var Scope = require('../src/scope.js');

describe('scope', function() {
	var scope, ctx;
	beforeEach(function() {
		ctx = {
			foo: 'zoo',
			bar: {
				zoo: 'coo',
				"Mr.Smith": 'John',
				arr: ['a', 'b']
			}
		};
		scope = Scope.factory(ctx);
	});

	describe('#propertyAccessSeq()', function() {
		it('should handle dot syntax', function() {
			expect(scope.propertyAccessSeq('foo.bar'))
				.to.deep.equal(['foo', 'bar']);
		});
		it('should handle [<String>] syntax', function() {
			expect(scope.propertyAccessSeq('foo["bar"]'))
				.to.deep.equal(['foo', 'bar']);
		});
		it('should handle [<Identifier>] syntax', function() {
			expect(scope.propertyAccessSeq('foo[foo]'))
				.to.deep.equal(['foo', 'zoo']);
		});
		it('should handle nested access', function() {
			expect(scope.propertyAccessSeq('foo[bar.zoo]'))
				.to.deep.equal(['foo', 'coo']);
			expect(scope.propertyAccessSeq('foo[bar["zoo"]]'))
				.to.deep.equal(['foo', 'coo']);
		});
	});

	describe('#get()', function() {
		it('should get direct property', function() {
			expect(scope.get('foo')).equal('zoo');
		});

		it('should get undefined property', function() {
			function fn() {
				scope.get('notdefined');
			}
			expect(fn).to.not.throw();
			expect(scope.get('notdefined')).to.equal(undefined);
			expect(scope.get('')).to.equal(undefined);
			expect(scope.get(false)).to.equal(undefined);
		});

		it('should throw undefined in strict mode', function() {
			scope = Scope.factory(ctx, {
				strict: true
			});

			function fn() {
				scope.get('notdefined');
			}
			expect(fn).to.throw(/undefined variable: notdefined/);
		});

		it('should get all properties when arguments empty', function() {
			expect(scope.get()).deep.equal(ctx);
		});

		it('should access child property via dot syntax', function() {
			expect(scope.get('bar.zoo')).to.equal('coo');
			expect(scope.get('bar.arr')).to.deep.equal(['a', 'b']);
		});

		it('should access child property via [<String>] syntax', function() {
			expect(scope.get('bar["zoo"]')).to.equal('coo');
		});

		it('should access child property via [<Number>] syntax', function() {
			expect(scope.get('bar.arr[0]')).to.equal('a');
		});

		it('should access child property via [<Identifier>] syntax', function() {
			expect(scope.get('bar[foo]')).to.equal('coo');
		});

		it('should support nested case', function() {
			scope.set('posts', {
				"first": {"name": "A Nice Day"}
			});
			scope.set('category', {
				"diary": ["first"]
			});
			expect(scope.get('posts[category.diary[0]].name'), 'A Nice Day');
		});
	});

	describe('.push(), .pop()', function() {
		it('should push scope', function() {
			scope.set('bar', 'bar');
			scope.push({
				foo: 'foo'
			});
			expect(scope.get('foo')).to.equal('foo');
			expect(scope.get('bar')).to.equal('bar');
		});

		it('should pop scope', function() {
			scope.push({
				foo: 'foo'
			});
			scope.pop();
			expect(scope.get('foo')).to.equal('zoo');
		});
        it('should unshift scope', function() {
            scope.unshift({foo: 'blue', foo1: 'foo1'})
            scope.get('foo').should.equal('zoo');
            scope.get('foo1').should.equal('foo1');
        });

        it('should shift scope', function() {
            scope.unshift({foo: 'blue', foo1: 'foo1'});
            scope.shift();
            expect(scope.get('foo')).to.equal('zoo');
            expect(scope.get('foo1')).to.equal(undefined);
        });
	});
});
