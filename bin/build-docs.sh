#!/usr/bin/env bash

./bin/build-contributors.sh
./bin/build-apidoc.sh

cd docs
npm ci
npm run build
cp CNAME public/
npm run index # env required: HEXO_ALGOLIA_INDEXING_KEY
