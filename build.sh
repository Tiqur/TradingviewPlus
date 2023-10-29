# Compile typescript
tsc

# Compile scss
npx sass public/:dist/

# Create temp dir
mkdir temp

# Copy files into temp dir
cp -r manifest.json dist/* temp

# Zip contents "extension.xpi"
zip -j extension.xpi temp/*

# Delete temp dir
rm -r temp

