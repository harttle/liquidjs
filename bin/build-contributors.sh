#!/usr/bin/env bash

# Run `sed` in a way that's compatible with both macOS (BSD) and Linux (GNU)
sedi() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

cp .all-contributorsrc docs/.all-contributorsrc
sedi \
  -e 's/README.md/docs\/themes\/navy\/layout\/partial\/all-contributors.swig/g' \
  -e 's/"contributorsPerLine": 7/"contributorsPerLine": 65535/g' \
  docs/.all-contributorsrc

all-contributors --config docs/.all-contributorsrc generate
sedi 's/<br \/>.*<\/td>/<\/a><\/td>/g' docs/themes/navy/layout/partial/all-contributors.swig
