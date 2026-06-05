#!/bin/bash

echo "🚀 AutoFill Pro - Quick Setup Script"
echo "===================================="
echo ""

echo "📂 Current directory: $(pwd)"
echo ""

echo "Choose setup option:"
echo "1) Quick test (no icons)"
echo "2) Full setup (with icons)"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "⚡ Setting up for quick testing..."

    if [ -f "manifest.json" ] && [ -f "manifest-no-icons.json" ]; then
        mv manifest.json manifest-with-icons.json
        mv manifest-no-icons.json manifest.json
        echo "✅ Manifest updated (no icons required)"
    else
        echo "ℹ️  Manifest files already configured"
    fi

    echo ""
    echo "📝 Next steps:"
    echo "1. Open Firefox"
    echo "2. Go to: about:debugging"
    echo "3. Click 'This Firefox'"
    echo "4. Click 'Load Temporary Add-on'"
    echo "5. Select manifest.json from this folder"
    echo ""
    echo "✨ Then open test-form.html to try it out!"

elif [ "$choice" = "2" ]; then
    echo ""
    echo "🎨 Full setup selected..."
    echo ""

    if [ ! -f "icons/icon16.png" ] || [ ! -f "icons/icon48.png" ] || [ ! -f "icons/icon128.png" ]; then
        echo "⚠️  Icons not found!"
        echo ""
        echo "Please generate icons first:"
        echo "Option 1: Open icons/generate-icons.html in browser"
        echo "Option 2: Run: python3 icons/create-icons.py (then convert SVG to PNG)"
        echo "Option 3: Create simple colored squares as placeholders"
        echo ""
        read -p "Press Enter when icons are ready..."
    else
        echo "✅ Icons found!"
    fi

    if [ -f "manifest-with-icons.json" ] && [ -f "manifest-no-icons.json" ]; then
        mv manifest.json manifest-no-icons.json
        mv manifest-with-icons.json manifest.json
        echo "✅ Manifest updated (with icons)"
    fi

    echo ""
    echo "📝 Next steps:"
    echo "1. Open Firefox"
    echo "2. Go to: about:debugging"
    echo "3. Click 'This Firefox'"
    echo "4. Click 'Load Temporary Add-on'"
    echo "5. Select manifest.json from this folder"

else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "📚 Documentation:"
echo "- QUICKSTART.md - Fast setup guide"
echo "- README.md - Full documentation"
echo "- PROJECT_OVERVIEW.md - Project structure"
echo ""
echo "✅ Setup complete! Good luck! 🎉"
