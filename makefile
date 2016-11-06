MINIFY = ./node_modules/.bin/uglifyjs
BROWSERIFY = ./node_modules/.bin/browserify

.PHONY: dist default clean

default:

dist: 
	[ -d dist/ ] || mkdir dist/
	$(BROWSERIFY) index.js -s Liquid \
		--ignore path \
		-t [ babelify --global true --presets [ es2015 ] ] \
		> dist/liquid.js
	$(MINIFY) dist/liquid.js --compress warnings=false --mangle --output dist/liquid.min.js
	ls -lh dist/

clean: 
	rm -rf dist/
