#!/usr/bin/env bash

./bin/build-contributors.sh
./bin/build-apidoc.sh

cd docs
npm ci
npm run build
cp CNAME public/

cp ../CHANGELOG.md source/tutorials/changelog.md
sed -i \
  -e 's/{%/{% raw %}{%{% endraw %}/g' \
  -e 's/{{/{% raw %}{{{% endraw %}/g' \
  -e '1 s/"/\&quot;/g' \
  -e '1 s/</\&lt;/g' \
  -e '1 s/>/\&gt;/g' \
  source/tutorials/changelog.md
cp source/tutorials/changelog.md source/zh-cn/tutorials/changelog.md

sed -i '1i ---\ntitle: Changelog\nauto: true\n---\n' source/tutorials/changelog.md
sed -i '1i ---\ntitle: 更新日志\nauto: true\n---\n' source/zh-cn/tutorials/changelog.md

if [ "$HEXO_ALGOLIA_INDEXING_KEY" != "" ]; then
    npm run index
fi
