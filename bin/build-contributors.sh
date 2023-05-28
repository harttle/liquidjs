#!/usr/bin/env bash

REPLACE_README_MD='s/README.md/docs\/themes\/navy\/layout\/partial\/all-contributors.swig/g'
REPLACE_CONTRIBUTORS_PER_LINE='s/"contributorsPerLine": 7/"contributorsPerLine": 65535/g'
REPLACE_CONTRIBUTOR_LINKS='s/<br \/>.*<\/td>/<\/a><\/td>/g'

cp .all-contributorsrc docs/.all-contributorsrc
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' -e "$REPLACE_README_MD" -e "$REPLACE_CONTRIBUTORS_PER_LINE" docs/.all-contributorsrc
else
    sed -i -e "$REPLACE_README_MD" -e "$REPLACE_CONTRIBUTORS_PER_LINE" docs/.all-contributorsrc
fi

all-contributors --config docs/.all-contributorsrc generate
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' -e "$REPLACE_CONTRIBUTOR_LINKS" docs/themes/navy/layout/partial/all-contributors.swig
else
    sed -i "$REPLACE_CONTRIBUTOR_LINKS" docs/themes/navy/layout/partial/all-contributors.swig
fi
