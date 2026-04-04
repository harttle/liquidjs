#!/usr/bin/env bash

rm -rf docs/source/api
typedoc --plugin typedoc-plugin-missing-exports ./src --gitRevision master --out docs/source/api
