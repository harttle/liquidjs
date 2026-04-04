#!/usr/bin/env bash

# Run `sed` in a way that's compatible with both macOS (BSD) and Linux (GNU)
sedi() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    /usr/bin/sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# create docs/themes/navy/layout/partial/all-contributors.swig
awk '/ALL-CONTRIBUTORS-LIST:START/{flag=1;next}/ALL-CONTRIBUTORS-LIST:END/{flag=0}flag' README.md | \
  sed 's/<br \/>.*<\/td>/<\/a><\/td>/g' | \
  sed 's/width="[^"]*"//g' | \
  tr -d '\n' | \
  sed 's/<\/tr>\s*<tr>//g' \
  > docs/themes/navy/layout/partial/all-contributors.swig

# create docs/themes/navy/layout/partial/financial-contributors.swig
awk '/FINANCIAL-CONTRIBUTORS-BEGIN/{flag=1;next}/FINANCIAL-CONTRIBUTORS-END/{flag=0}flag' README.md | \
  sed 's/<br \/>.*<\/td>/<\/a><\/td>/g' | \
  tr -d '\n' | \
  sed 's/<\/tr>\s*<tr>//g' \
  > docs/themes/navy/layout/partial/financial-contributors.swig
