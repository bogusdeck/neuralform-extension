# 🔥 Permanent Installation in Zen Browser

This guide explains how to permanently install the AutoFill Pro extension in Zen Browser (Mozilla-based).

---

## 📦 Package Extension as XPI

### Step 1: Run the packaging script

```bash
cd /Users/bogusdeck/Projects/web-extension
bash package-extension.sh
```

This creates `autofill-pro.xpi` file in your project directory.

### Step 2: Verify XPI file

You should see:
```
✅ Extension packaged as: autofill-pro.xpi
📁 File location: /Users/bogusdeck/Projects/web-extension/autofill-pro.xpi
```

---

## 🔐 Sign Extension (Required for Permanent Install)

### Option A: Sign with Mozilla (Production)

**Best for public distribution**

1. Go to: https://addons.mozilla.org/developers/
2. Log in with Mozilla account
3. Click **"Submit a new Add-on"**
4. Upload `autofill-pro.xpi`
5. Fill in extension details
6. Submit for review
7. Wait for approval (1-3 days)
8. After approval, install from AMO

**Pros:**
- ✅ Permanent installation
- ✅ Auto-updates enabled
- ✅ Trusted by Mozilla
- ✅ Publicly available

**Cons:**
- ❌ Review process takes time
- ❌ Requires approval
- ❌ Must follow Mozilla policies

---

### Option B: Unsigned Installation (Development/Personal)

**Best for personal use and development**

#### Disable Signature Requirement in Zen Browser

1. Open Zen Browser
2. Type: `about:config` in address bar
3. Click **"Accept the Risk and Continue"**
4. Search for: `xpinstall.signatures.required`
5. Double-click to set to `false`
6. Close the tab

**Note:** This allows installing unsigned extensions. Use only for personal development.

---

## 🚀 Install Extension in Zen Browser

### Method 1: Drag & Drop (Easiest)

1. Open Zen Browser
2. Open Finder (File Manager)
3. Navigate to `/Users/bogusdeck/Projects/web-extension/`
4. Drag `autofill-pro.xpi` to Zen Browser window
5. Click **"Add"** when prompted
6. Extension installed! ✅

### Method 2: File Menu

1. Open Zen Browser
2. Click menu (☰) → **"Add-ons and themes"**
   - Or type: `about:addons`
3. Click gear icon ⚙️ → **"Install Add-on From File..."**
4. Navigate to `/Users/bogusdeck/Projects/web-extension/`
5. Select `autofill-pro.xpi`
6. Click **"Add"**
7. Extension installed! ✅

---

## ✅ Verify Installation

### Check Extension is Active

1. Open Zen Browser
2. Type: `about:addons`
3. Look for **"AutoFill Pro"** in extensions list
4. Ensure toggle is **ON**
5. Extension icon should appear in toolbar

### Test Extension

1. Click extension icon in toolbar
2. Fill in your details
3. Click "Save Details"
4. Visit a test form: `test-form.html`
5. Click "Fill Current Page"
6. Form should auto-fill! 🎉

---

## 🔄 Update Extension

### For Unsigned Installation

1. Package new version:
```bash
bash package-extension.sh
```

2. In Zen Browser:
   - Go to `about:addons`
   - Click gear ⚙️ → **"Install Add-on From File..."**
   - Select new `autofill-pro.xpi`
   - Click **"Add"** (will replace old version)

### For Signed Installation (AMO)

Updates are automatic! Just upload new version to AMO and users get auto-updated.

---

## 🐛 Troubleshooting

### Extension won't install

**Error:** "This add-on could not be installed because it appears to be corrupt"

**Fix:**
```bash
# Re-package extension
bash package-extension.sh
```

**Error:** "Add-on is not signed"

**Fix:**
- Disable signature requirement (see Option B above)
- Or sign with Mozilla (see Option A)

### Extension icon not showing

**Fix:**
1. Go to `about:addons`
2. Find AutoFill Pro
3. Click "..." → **"Pin to Toolbar"**
4. Icon should appear

### Data not saving

**Fix:**
1. Ensure Firestore is enabled in Firebase Console
2. Check Firebase config in `config/firebase.js`
3. Open browser console (F12) for errors

---

## 📋 Quick Reference

### Package Command
```bash
cd /Users/bogusdeck/Projects/web-extension
bash package-extension.sh
```

### Zen Browser URLs
- Extensions: `about:addons`
- Debugging: `about:debugging`
- Config: `about:config`

### Disable Signature
```
xpinstall.signatures.required = false
```

---

## 🎯 Zen Browser Compatibility

Zen Browser is Firefox-based, so:
- ✅ All Firefox extensions work
- ✅ Same installation methods
- ✅ Same developer tools
- ✅ Same about: pages

---

## 📝 Development Workflow

### During Development

1. Make code changes
2. Reload extension in `about:debugging`
3. Test changes
4. Repeat

### For Testing

1. Package: `bash package-extension.sh`
2. Install in Zen Browser
3. Test thoroughly
4. Make adjustments

### For Production

1. Sign with Mozilla AMO
2. Submit for review
3. Wait for approval
4. Publish publicly

---

## 🔒 Security Notes

### Personal Use (Unsigned)
- Disable signature requirement
- Use only for your own browser
- Don't distribute to others

### Public Distribution (Signed)
- Must sign with Mozilla
- Follow Mozilla policies
- Pass review process
- Secure for public use

---

## 📚 Resources

- Zen Browser: https://zen-browser.app/
- Firefox Add-ons: https://addons.mozilla.org/
- Mozilla Developer Hub: https://addons.mozilla.org/developers/
- Extension Documentation: https://extensionworkshop.com/

---

**Ready to install?** Run the packaging script and drag the XPI to Zen Browser! 🚀
