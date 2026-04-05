#!/usr/bin/env bash

VERSION_LATEST=$(cat package.json | grep '"version":' | head -1 | awk -F'"' '{print $4}')
FILE_LOCAL=dist/liquid.node.js
FILE_LATEST=dist/liquid.node.$VERSION_LATEST.js
URL_LATEST=https://unpkg.com/liquidjs@$VERSION_LATEST/dist/liquid.node.js

if [ ! -f "$FILE_LATEST" ]; then
    curl $URL_LATEST > $FILE_LATEST
fi

exec node benchmark/diff.js $FILE_LOCAL $FILE_LATEST
