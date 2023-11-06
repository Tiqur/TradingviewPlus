#!/bin/bash

# Check if at least one command line argument is provided
if [ $# -lt 1 ]; then
  echo "Usage: $0 [firefox|chrome]"
  exit 1
fi

MANIFEST_NAME=""
OUTPUT_FILE_NAME=""

# Check the value of the first command line argument
if [ "$1" == "firefox" ]; then
  echo "Building for Firefox..."
  MANIFEST_NAME="firefox-manifest.json"
  OUTPUT_FILE_NAME="extension.xpi"
elif [ "$1" == "chrome" ]; then
  echo "Building for Chrome..."
  MANIFEST_NAME="chrome-manifest.json"
  OUTPUT_FILE_NAME="extension.zip"
else
  echo "Invalid argument. Supported values are 'firefox' and 'chrome'."
  exit 1
fi

# Compile typescript
tsc

# Compile scss
npx sass public/:dist/

# Create temp dir
mkdir temp

# Copy files into temp dir
cp -r $MANIFEST_NAME public/ dist/ temp

# Zip contents "extension.xpi"
cd temp
zip -x "*.map" -x "*.scss" -r $OUTPUT_FILE_NAME *
mv $OUTPUT_FILE_NAME ..
cd ..

# Delete temp dir
rm -r temp
