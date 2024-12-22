#!/usr/bin/env bash

set -euo pipefail

zip -r - . --exclude \
  package.zip \
  package.sh \
  ".git/*" \
  ".github/*" \
  .gitignore \
  img/1280x800.png \
  img/icon.svg \
  README.md \
> package.zip

echo
echo "Packaged into package.zip"
