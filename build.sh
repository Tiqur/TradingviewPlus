#!/bin/bash

# Check if at least one command line argument is provided
if [ $# -lt 1 ]; then
  echo "Usage: $0 [firefox|chrome|opera]"
  exit 1
fi

MANIFEST_PATH=""
OUTPUT_FILE_NAME=""

# Check the value of the first command line argument
if [ "$1" == "firefox" ]; then
  echo "Building for Firefox..."
  MANIFEST_PATH="platform/firefox/manifest.json"
  OUTPUT_FILE_NAME="extension.xpi"
elif [ "$1" == "chrome" ]; then
  echo "Building for Chrome..."
  MANIFEST_PATH="platform/chrome/manifest.json"
  OUTPUT_FILE_NAME="extension.zip"
elif [ "$1" == "opera" ]; then
  echo "Building for Opera..."
  MANIFEST_PATH="platform/opera/manifest.json"
  OUTPUT_FILE_NAME="extension.zip"
else
  echo "Invalid argument. Supported values are 'firefox', 'chrome' and 'opera'."
  exit 1
fi

# Compile typescript
npx tsc

# Compile scss
npx sass public/:dist/

# Create temp dir
mkdir temp

# Copy files into temp dir
cp -r $MANIFEST_NAME public/ dist/ temp

# Copy manifest to temp
cp $MANIFEST_PATH temp/

# Go into temp dir
cd temp

# Zip contents "extension.xpi"
zip -x "*.map" -x "*.scss" -r $OUTPUT_FILE_NAME *
mv $OUTPUT_FILE_NAME ..
cd ..

# Delete temp dir
rm -r temp
