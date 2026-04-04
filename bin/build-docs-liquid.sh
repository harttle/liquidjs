#!/usr/bin/env bash

BUNDLES=min npm run build
mkdir -p docs/public/js/
cp dist/liquid.browser.min.js docs/public/js/

