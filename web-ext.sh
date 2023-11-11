#!/bin/bash

# Check if at least one command line argument is provided
if [ $# -lt 1 ]; then
  echo "Usage: $0 [firefox|chrome|opera]"
  exit 1
fi

# Install node libraries
npm install

# Compile typescript
tsc

# Compile scss
npx sass public/:dist/

# Remove old manifest
rm manifest.json

# Copy firefox manifest to root dir then run web-ext
# Check the value of the first command line argument
if [ "$1" == "firefox" ]; then
  echo "Starting web-ext for Firefox..."
  cp platform/firefox/manifest.json .
  TMPDIR=~/tmp-dir/ web-ext run
elif [ "$1" == "chrome" ]; then
  echo "Starting web-ext for Chrome..."
  cp platform/chrome/manifest.json .
  TMPDIR=~/tmp-dir/ web-ext run -t chromium
elif [ "$1" == "opera" ]; then
  echo "Starting web-ext for Opera..."
  cp platform/opera/manifest.json .
  TMPDIR=~/tmp-dir/ web-ext run -t chromium --chromium-binary /usr/bin/opera
else
  echo "Invalid argument. Supported values are 'firefox', 'chrome' and 'opera'."
  exit 1
fi
