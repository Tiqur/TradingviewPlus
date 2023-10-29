# Compile typescript
tsc

# Compile scss
npx sass public/:dist/

# Create temp dir
mkdir temp

# Copy files into temp dir
cp -r manifest.json public/ dist/ temp

# Zip contents "extension.xpi"
cd temp
zip -x "*.map" -x "*.scss" -r extension.xpi *
mv extension.xpi ..
cd ..

# Delete temp dir
rm -r temp

