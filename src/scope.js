const _ = require('./util/underscore.js');
const lexical = require('./lexical.js');

var Scope = {
	safeGet: function(str) {
		var i;
		// get all
		if (str === undefined) {
			var ctx = {};
			for (i = this.scopes.length - 1; i >= 0; i--) {
				var scp = this.scopes[i];
				for (var k in scp) {
					if (scp.hasOwnProperty(k)) {
						ctx[k] = scp[k];
					}
				}
			}
			return ctx;
		}
		// get one path
		for (i = this.scopes.length - 1; i >= 0; i--) {
			var v = this.getPropertyByPath(this.scopes[i], str);
			if (v !== undefined) return v;
		}
	},
	get: function(str) {
		var val = this.safeGet(str);
		if (val === undefined && this.opts.strict) {
			throw new Error(`[strict_variables] undefined variable: ${str}`);
		}
		return val;
	},
	set: function(k, v) {
		this.setPropertyByPath(this.scopes[this.scopes.length - 1], k, v);
		return this;
	},
	push: function(ctx) {
		if (!ctx) throw new Error(`trying to push ${ctx} into scopes`);
		return this.scopes.push(ctx);
	},
	pop: function() {
		return this.scopes.pop();
	},
    unshift: function(ctx) {
        if (!ctx) throw new Error('trying to push $(ctx) into scopes');
        return this.scopes.unshift(ctx);
    },
    shift: function() {
        return this.scopes.shift();
    },
	setPropertyByPath: function(obj, path, val) {
		if (_.isString(path)) {
			var paths = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
			for (var i = 0; i < paths.length; i++) {
				var key = paths[i];
				if (i === paths.length - 1) {
					return obj[key] = val;
				}
				if (undefined === obj[key]) obj[key] = {};
				// case for readonly objects
				obj = obj[key] || {};
			}
			return obj;
		}
		return obj[path] = val;
	},

	getPropertyByPath: function(obj, path) {
		if (_.isString(path) && path.length) {
			var paths = this.propertyAccessSeq(path);
			paths.forEach(p => obj = obj && obj[p]);
			return obj;
		}
		return obj[path];
	},

	/*
	 * Parse property access sequence from access string
	 * @example
	 * accessSeq("foo.bar")			// ['foo', 'bar']
	 * accessSeq("foo['bar']")  	// ['foo', 'bar']
	 * accessSeq("foo['b]r']")  	// ['foo', 'b]r']
	 * accessSeq("foo[bar.coo]")    // ['foo', 'bar'], for bar.coo == 'bar'
	 */
	propertyAccessSeq: function(str) {
		var seq = [],
			name = '';
		for (var i = 0; i < str.length; i++) {
			if (str[i] === '[') {
				seq.push(name);
				name = '';

				var delemiter = str[i + 1];
				// foo[bar.coo]
				if (delemiter !== "'" && delemiter !== '"') {
					var j = matchRightBracket(str, i + 1);
					if (j === -1) {
						throw new Error(`unbalanced []: ${str}`);
					}
					name = str.slice(i + 1, j);
					// foo[1]
					if(lexical.isInteger(name)){
						seq.push(name);
					}
					// foo["bar"]
					else{
						seq.push(this.get(name));
					}
					name = '';
					i = j;
				}
				// foo["bar"]
				else {
					var j = str.indexOf(delemiter, i + 2);
					if (j === -1) {
						throw new Error(`unbalanced ${delemiter}: ${str}`);
					}
					name = str.slice(i + 2, j);
					seq.push(name);
					name = '';
					i = j + 1;
				}
			}
			// foo.bar
			else if (str[i] === ".") {
				seq.push(name);
				name = '';
			}
			//foo.bar
			else {
				name += str[i];
			}
		}
		if (name.length) seq.push(name);
		return seq;
	}
};

function matchRightBracket(str, begin) {
	var stack = 1; // count of '[' - count of ']'
	for (var i = begin; i < str.length; i++) {
		if (str[i] === '[') {
			stack++;
		}
		if (str[i] === ']') {
			stack--;
			if (stack === 0) {
				return i;
			}
		}
	}
	return -1;
}

exports.factory = function(_ctx, opts) {
	opts = opts || {};
	opts.strict = opts.strict || false;

	var scope = Object.create(Scope);
	scope.opts = opts;
	scope.scopes = [_ctx || {}];
	return scope;
};
