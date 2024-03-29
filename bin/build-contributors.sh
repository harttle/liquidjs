#!/usr/bin/env bash

# Run `sed` in a way that's compatible with both macOS (BSD) and Linux (GNU)
sedi() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# create docs/themes/navy/layout/partial/all-contributors.swig
cp .all-contributorsrc docs/.all-contributorsrc
sedi \
  -e 's/README.md/docs\/themes\/navy\/layout\/partial\/all-contributors.swig/g' \
  -e 's/"contributorsPerLine": 7/"contributorsPerLine": 65535/g' \
  docs/.all-contributorsrc

all-contributors --config docs/.all-contributorsrc generate
sedi 's/<br \/>.*<\/td>/<\/a><\/td>/g' docs/themes/navy/layout/partial/all-contributors.swig

# create docs/themes/navy/layout/partial/financial-contributors.swig
awk '/FINANCIAL-CONTRIBUTORS-BEGIN/{flag=1;next}/FINANCIAL-CONTRIBUTORS-END/{flag=0}flag' README.md | \
  sed 's/<br \/>.*<\/td>/<\/a><\/td>/g' | \
  sed 's/width="[^"]*"//g' | \
  tr -d '\n' | \
  sed 's/<\/tr>\s*<tr>//g' \
  > docs/themes/navy/layout/partial/financial-contributors.swig
