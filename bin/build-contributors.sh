#!/usr/bin/env bash

cp .all-contributorsrc docs/.all-contributorsrc
sed -i \
    -e 's/README.md/docs\/themes\/navy\/layout\/partial\/all-contributors.swig/g' \
    -e 's/"contributorsPerLine": 7/"contributorsPerLine": 65535/g' \
    docs/.all-contributorsrc

all-contributors --config docs/.all-contributorsrc generate
sed -i 's/<br \/>.*<\/td>/<\/a><\/td>/g' docs/themes/navy/layout/partial/all-contributors.swig
