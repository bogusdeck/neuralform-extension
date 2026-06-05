#!/bin/bash

# Script to package Firefox extension as XPI
# Run: bash package-extension.sh

echo "📦 Packaging extension as XPI..."

# Create a temporary directory for packaging
TEMP_DIR="temp_package"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Copy all files (exclude .git, node_modules, .env, backups)
rsync -av --exclude='.git' \
          --exclude='node_modules' \
          --exclude='.env' \
          --exclude='*.backup' \
          --exclude='temp_package' \
          --exclude='*.md' \
          --exclude='.gitignore' \
          . "$TEMP_DIR/"

# Create XPI file
cd "$TEMP_DIR"
zip -r "../autofill-pro.xpi" * -x "*.DS_Store"
cd ..

# Clean up
rm -rf "$TEMP_DIR"

echo "✅ Extension packaged as: autofill-pro.xpi"
echo "📁 File location: $(pwd)/autofill-pro.xpi"
