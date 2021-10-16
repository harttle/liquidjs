#!/usr/bin/env bash

VERSION_LATEST=$(cat package.json | grep '"version":' | awk -F'"' '{print $4}')
FILE_LOCAL=dist/liquid.node.cjs.js
FILE_LATEST=dist/liquid.node.cjs.$VERSION_LATEST.js
URL_LATEST=https://unpkg.com/liquidjs@$VERSION_LATEST/dist/liquid.node.cjs.js

if [ ! -f $FILE_LATEST ]; then
    curl $URL_LATEST > $FILE_LATEST
fi

# if [ ! -f $FILE_LOCAL ]; then
BUNDLES=cjs npm run build:dist
# fi

exec node benchmark/diff.js $FILE_LOCAL $FILE_LATEST
