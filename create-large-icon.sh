#!/bin/bash

# Create a larger, more prominent icon for better visibility
# Uses ImageMagick to create icons with larger central elements

echo "🎨 Creating larger, more prominent icons..."

cd icons

# Create a 128x128 icon with larger elements
magick -size 128x128 xc:none \
  -fill "#667eea" \
  -draw "roundrectangle 0,0,128,128,20,20" \
  -fill "white" \
  -pointsize 40 \
  -gravity center \
  -annotate +0-10 "A" \
  -pointsize 20 \
  -annotate +0+30 "Fill" \
  icon128.png

# Resize to 48x48
magick icon128.png -resize 48x48 icon48.png

# Resize to 16x16
magick icon128.png -resize 16x16 icon16.png

echo "✅ Larger icons created!"
echo "📁 Files: icon16.png, icon48.png, icon128.png"
