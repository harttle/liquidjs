#!/usr/bin/env bash

rm -rf docs/source/api
typedoc ./src --gitRevision master --out docs/source/api
