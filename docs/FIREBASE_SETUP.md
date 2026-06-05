# 🔥 Firebase Setup Guide

Your extension has been migrated to Firebase! Follow these steps to complete the setup.

---

## 📋 Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click** "Add project"
3. **Enter** project name (e.g., "autofill-pro")
4. **(Optional)** Disable Google Analytics (not needed for this extension)
5. **Click** "Create project"
6. **Wait** for project to be created

---

## 📋 Step 2: Get Firebase Configuration

1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. **Register app** with nickname (e.g., "AutoFill Extension")
3. **Copy** the Firebase configuration object

It will look like:
```javascript
{
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}
```

---

## 📋 Step 3: Update Extension Configuration

Open `config/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",           // Paste your API key
    authDomain: "YOUR_AUTH_DOMAIN",        // Paste your auth domain
    projectId: "YOUR_PROJECT_ID",           // Paste your project ID
    storageBucket: "YOUR_STORAGE_BUCKET",   // Paste your storage bucket
    messagingSenderId: "YOUR_SENDER_ID",    // Paste your sender ID
    appId: "YOUR_APP_ID"                    // Paste your app ID
};
```

---

## 📋 Step 4: Setup Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. **Choose** "Start in test mode" (for development)
4. **Select** a location (choose nearest to you)
5. Click **"Enable"**

### Set Security Rules (Important!)

Go to **Rules** tab and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all users to read/write their own profile
    match /userProfiles/{userId} {
      allow read, write: if true;  // Open for testing
    }
  }
}
```

**Note**: For production, you should add authentication and restrict access.

---

## 📋 Step 5: Test the Setup

### Test with standalone form:
```bash
open add-user-profile-firebase.html
```

1. Fill in some test data
2. Click "Save Profile to Firebase"
3. Should see success message

### Verify in Firebase:
1. Go to Firebase Console → Firestore Database
2. You should see `userProfiles` collection
3. Click to see your data!

---

## 📋 Step 6: Install Extension

1. Open Firefox: `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest.json`

---

## 🎯 How It Works Now

### Data Flow:
```
Extension → Firebase SDK → Firestore → Cloud Database
```

### Storage Structure:
```
Firestore Database
└── userProfiles (collection)
    └── {userId} (document)
        ├── firstName
        ├── lastName
        ├── email
        ├── phone
        └── ... (all other fields)
```

---

## ✅ Configuration Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Firebase config pasted in `config/firebase.js`
- [ ] Firestore database enabled
- [ ] Security rules set
- [ ] Test form works (add-user-profile-firebase.html)
- [ ] Extension loaded in Firefox
- [ ] Can save data from extension
- [ ] Data appears in Firestore Console

---

## 🔐 Security Rules (Production)

When ready for production, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userProfiles/{userId} {
      // Only allow if authenticated and accessing own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Then add Firebase Authentication to your extension.

---

## 🐛 Troubleshooting

### Error: "Firebase not defined"
- Check that Firebase SDK scripts are loaded in HTML
- Open browser console (F12) to see errors

### Error: "Missing permissions"
- Check Firestore security rules
- Ensure rules are in "test mode" for development

### Data not saving
- Check Firebase console for quota limits
- Verify API key is correct
- Check browser console for errors

### Extension won't load
- Check manifest.json CSP allows www.gstatic.com
- Reload extension in about:debugging

---

## 📊 Firebase vs Supabase

| Feature | Supabase (Old) | Firebase (New) |
|---------|---------------|----------------|
| Database | PostgreSQL | Firestore (NoSQL) |
| Schema | Fixed tables | Flexible documents |
| Queries | SQL | NoSQL queries |
| Real-time | Available | ✅ Built-in |
| Free Tier | 500MB | 1GB storage |

---

## 🚀 Next Steps

1. **Complete setup** using steps above
2. **Test** extension with Firefox
3. **Add more fields** as needed (easy with NoSQL!)
4. **(Optional)** Add Firebase Authentication
5. **(Optional)** Enable real-time sync

---

## 📚 Resources

- Firebase Console: https://console.firebase.google.com/
- Firestore Docs: https://firebase.google.com/docs/firestore
- Firebase Web Docs: https://firebase.google.com/docs/web/setup

---

**Ready to start!** Begin with Step 1 and follow through. 🔥
