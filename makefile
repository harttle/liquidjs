MINIFY = ./node_modules/.bin/uglifyjs
BROWSERIFY = ./node_modules/.bin/browserify

.PHONY: dist default clean

default:

dist: 
	[ -d dist/ ] || mkdir dist/
	$(BROWSERIFY) index.js -s Liquid \
		-t [ babelify --global true --presets [ es2015 ] ] \
		> dist/shopify-liquid.js
	$(MINIFY) dist/shopify-liquid.js --output dist/shopify-liquid.min.js
	ls -lh dist/

clean: 
	rm -rf dist/
