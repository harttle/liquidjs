#!/usr/bin/env bash

./bin/build-contributors.sh
./bin/build-apidoc.sh

cd docs
npm ci
npm run build
cp CNAME public/

cp ../CHANGELOG.md source/tutorials/changelog.md
sed -i '1i ---\ntitle: Changelog\n---\n' source/tutorials/changelog.md
cp ../CHANGELOG.md source/zh-cn/tutorials/changelog.md
sed -i '1i ---\ntitle: 更新日志\n---\n' source/zh-cn/tutorials/changelog.md

if [ "$HEXO_ALGOLIA_INDEXING_KEY" != "" ]; then
    npm run index
fi
