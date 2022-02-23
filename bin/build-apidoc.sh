#!/usr/bin/env bash

set -ex

rm -rf docs/source/api docs/source/zh-cn/api
typedoc ./src --gitRevision master --out docs/source/api --plugin typedoc-plugin-markdown --ignoreCompilerErrors true --theme vuepress
rm docs/source/api/README.md

for file in $(find docs/source/api -name "*.md"); do
    sed -i \
        -e 's/\(\]([^_)]*\)\/_/\1\//g' \
        -e 's/\(\]([^)]*\.\)md/\1html/g' \
        -e 's/\](_/\](/g' \
        -e '1 s/"/\&quot;/g' \
        -e '1 s/</\&lt;/g' \
        -e '1 s/>/\&gt;/g' \
        -e '1 s/\*//g' \
        -e '1 s/^# \(.*\)/---\ntitle: "\1"\nauto: true\n---/' \
        $file
    target=${file/\/_/\/}
    cat $file | ./bin/escape-nunjucks.js > $target
done

cp -r docs/source/api docs/source/zh-cn/api
