#!/usr/bin/env bash

REPLACE_START_RAW='s/{%/{% raw %}{%{% endraw %}/g'
REPLACE_END_RAW='s/{{/{% raw %}{{{% endraw %}/g'
ESCAPE_QUOT='1 s/"/\&quot;/g'
ESCAPE_LT='1 s/</\&lt;/g'
ESCAPE_GT='1 s/>/\&gt;/g'

cd docs
cp ../CHANGELOG.md source/tutorials/changelog.md
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' -e "$REPLACE_START_RAW" -e "$REPLACE_END_RAW" -e "$ESCAPE_QUOT" -e "$ESCAPE_LT" -e "$ESCAPE_GT" source/tutorials/changelog.md
else
    sed -i -e "$REPLACE_START_RAW" -e "$REPLACE_END_RAW" -e "$ESCAPE_QUOT" -e "$ESCAPE_LT" -e "$ESCAPE_GT" source/tutorials/changelog.md
fi
cp source/tutorials/changelog.md source/zh-cn/tutorials/changelog.md

if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' -e '1i\
 ---\ntitle: Changelog\nauto: true\n---\n' source/tutorials/changelog.md
    sed -i '' -e '1i\
 ---\ntitle: 更新日志\nauto: true\n---\n' source/zh-cn/tutorials/changelog.md
else
    sed -i '1i ---\ntitle: Changelog\nauto: true\n---\n' source/tutorials/changelog.md
    sed -i '1i ---\ntitle: 更新日志\nauto: true\n---\n' source/zh-cn/tutorials/changelog.md
fi
