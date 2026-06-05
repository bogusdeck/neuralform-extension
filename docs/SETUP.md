# Quick Setup Guide

## Step 1: Generate Icons

You have two options:

### Option A: Use the HTML Generator (Easy)
1. Open `icons/generate-icons.html` in any web browser
2. Click the download links to save icon16.png, icon48.png, and icon128.png
3. Move the downloaded files to the `icons/` folder

### Option B: Use Online Tool
1. Go to https://www.iloveimg.com/resize-image/resize-svg
2. Upload `icons/icon.svg`
3. Create three versions: 16x16px, 48x48px, and 128x128px
4. Save them as icon16.png, icon48.png, and icon128.png in the `icons/` folder

## Step 2: Install in Firefox

1. Open Firefox
2. Type `about:debugging` in the address bar
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to this folder and select `manifest.json`

## Step 3: Start Using

1. Click the AutoFill Pro icon in the toolbar
2. Fill in your details in the popup
3. Click "Save Details"
4. Navigate to any form on the web
5. Click the extension icon and then "Fill Current Page"

## Troubleshooting

If icons don't load, you can temporarily comment out the icon references in manifest.json:

```json
// Comment these lines temporarily:
// "default_icon": { ... }
// "icons": { ... }
```

The extension will work without icons, just showing a default Firefox extension icon.

## Next Steps

- Test on various websites (Google Forms, contact forms, etc.)
- Customize field mappings in `content/content.js` if needed
- Prepare for migration to cloud database (Neon/Supabase)
