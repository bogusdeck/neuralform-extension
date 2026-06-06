# NeuralForm - AI-Powered Firefox Extension

An intelligent Firefox extension that automatically detects and fills form fields with your saved personal details using Hybrid AI (Local & Cloud LLMs).

## Recent Evolution

The project has undergone several major updates:
- **Rebranding**: Transitioned from AutoFill Pro to **NeuralForm**.
- **AI Integration**: Integrated AI-powered form filling capabilities.
- **Performance**: Added a high-performance, GSAP-animated landing page in the `website/` directory.
- **Cleanup**: Removed legacy Supabase files, redundant manifests, and hardcoded secrets for a clean build.
- **Organization**: Restructured the codebase, moving documentation to `docs/` and adding `scripts/`, `tools/`, and `onboarding/` directories.

## Features

- 🚀 **Auto-detect form fields** - Intelligently identifies common form fields
- 🔥 **Firebase Cloud Storage** - Firestore NoSQL database
- 💾 **Local fallback** - Automatic local storage backup
- 🎨 **Beautiful UI** - Modern, user-friendly interface
- ⚡ **Quick fill** - One-click form filling
- 📝 **Comprehensive fields** - Supports personal, contact, address, education, and government exam details

## Installation

### 1. Setup Firebase (Required)

See `docs/FIREBASE_SETUP.md` for detailed instructions.

Quick steps:
1. Create Firebase project: https://console.firebase.google.com/
2. Enable Firestore Database
3. Copy Firebase config to `config/firebase.js`

### 2. Install Extension

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the extension directory and select `manifest.json`

### 3. (Optional) Generate Icons

See `docs/SETUP.md` for icon generation instructions.

## Usage

### 1. Save Your Details

1. Click the **NeuralForm** icon in the Firefox toolbar
2. Fill in your personal information across three tabs:
   - **Personal**: First name, last name, full name, DOB, gender
   - **Contact**: Email, phone numbers
   - **Address**: Street address, city, state, ZIP, country
3. Click **Save Details**

### 2. Auto-Fill Forms

1. Navigate to any webpage with a form
2. Click the **NeuralForm** icon
3. Click **Fill Current Page**
4. The extension will automatically detect and fill matching fields
5. Filled fields will briefly highlight in green
6. Review the filled information and submit the form

### 3. Clear Data

- Click **Clear All Data** in the popup to remove all saved information

## Supported Field Types

The extension intelligently detects fields based on:
- Input `name` attributes
- Input `id` attributes
- Input `placeholder` text
- Associated `label` elements
- `aria-label` attributes

### Recognized Fields

- **Name**: first name, last name, full name
- **Contact**: email, phone, alternate phone
- **Address**: street, city, state, ZIP, country
- **Personal**: date of birth, gender

## Project Structure

```
web-extension/
├── background/                 # Background service worker
│   └── background.js
├── config/                    # Firebase configuration
│   └── firebase.js
├── content/                    # Form detection & filling
│   └── content.js
├── docs/                      # Documentation
├── icons/                     # Extension icons
├── onboarding/                 # User onboarding flows
├── popup/                     # Extension popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── scripts/                   # Build and utility scripts
├── tools/                     # Development tools
├── website/                   # Landing page and web presence
└── manifest.json              # Extension configuration
```

## Technical Details

- **Manifest Version**: 3
- **Storage**: Firebase Firestore (NoSQL) with local fallback
- **Permissions**: storage, activeTab, scripting
- **Browser**: Firefox (Manifest V3)
- **Database**: Firebase Firestore with Security Rules

## Troubleshooting

### Extension doesn't fill forms
- Ensure you've saved your details first
- Check that the webpage has standard form fields
- Some websites use custom input fields that may not be detected

### Data not saving to cloud
- Check browser console for errors (`Ctrl+Shift+J`)
- Verify Firebase config in `config/firebase.js`
- Ensure Firestore database is enabled
- Check Firestore security rules allow writes

### Icons not showing
- Generate PNG icons using `icons/generate-icons.html`
- Or use `manifest-no-icons.json` to test without icons

### Connection test fails
- Verify anon key is correct
- Check internet connection
- Ensure Supabase project is active

## Development

To modify the extension:

1. Edit the relevant files
2. Reload the extension in `about:debugging`
3. Test on various websites

## License

MIT License - Feel free to modify and distribute

## Contributing

Contributions welcome! Please test thoroughly before submitting changes.

---

**Made with ❤️ for easier form filling**
