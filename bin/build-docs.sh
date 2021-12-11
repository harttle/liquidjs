#!/usr/bin/env bash

set -ex

./bin/build-contributors.sh
./bin/build-apidoc.sh
./bin/build-changelog.sh

cd docs
npm ci
npm run build
cp CNAME public/

if [ "$HEXO_ALGOLIA_INDEXING_KEY" != "" ]; then
    npm run index
fi
