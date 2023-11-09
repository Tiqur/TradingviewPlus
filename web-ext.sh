# Install node libraries
npm install

# Compile typescript
tsc

# Compile scss
npx sass public/:dist/

# Copy firefox manifest to root dir
cp platform/firefox/manifest.json .

# Run web-ext
TMPDIR=~/tmp-dir/ web-ext run
